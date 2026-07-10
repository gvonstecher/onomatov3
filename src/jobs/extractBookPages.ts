import type { PayloadRequest, TaskConfig } from 'payload'
import { pdf } from 'pdf-to-img'
import sharp from 'sharp'
import path from 'path'
import { readFile } from 'fs/promises'

import { bookFilesDir } from '../collections/BookFiles'

// Renders every page of a book's source PDF to a WebP image, storing each as a
// Media doc + a BookPage doc. Runs in the background (Payload Jobs Queue), not
// inline on upload, because PDF rendering is heavy. Memory is freed per page:
// each PNG/WebP buffer goes out of scope at the end of its loop iteration.
//
// Pragmatic version (option B): processes the whole book in one job, no
// chunking/resume yet. The render engine (pdf-to-img) is isolated here, so
// swapping it for mupdf later touches only this file.
export const extractBookPages: TaskConfig<'extractBookPages'> = {
  slug: 'extractBookPages',
  handler: async ({
    input,
    req,
  }: {
    input: { bookId: number | string }
    req: PayloadRequest
  }) => {
    const { payload } = req
    const { bookId } = input

    // Defensive: a transitive dependency in this project pollutes
    // Array.prototype with an enumerable method, and pdfjs (used by
    // pdf-to-img) refuses to run alongside it ("Array.prototype contains
    // unexpected enumerable property"). Standard prototype methods are
    // non-enumerable, so Object.keys() returns only the polluting ones —
    // we flip them back to non-enumerable before rendering.
    for (const key of Object.keys(Array.prototype)) {
      Object.defineProperty(Array.prototype, key, { enumerable: false })
    }

    const book = await payload.findByID({ collection: 'books', id: bookId, depth: 1 })
    const pdfFile = book?.pdf

    // `pdf` is unpopulated (just an id) or missing → nothing to do.
    if (!pdfFile || typeof pdfFile !== 'object' || !pdfFile.filename) {
      return { output: { pages: 0, skipped: true } }
    }

    const buffer = await readFile(path.join(bookFilesDir, pdfFile.filename))

    // Idempotency: remove previously generated pages AND their images so a
    // re-run regenerates cleanly instead of leaving duplicate pages or
    // orphaned media.
    const existingPages = await payload.find({
      collection: 'book-pages',
      where: { book: { equals: bookId } },
      limit: 100000,
      depth: 0,
    })
    await payload.delete({ collection: 'book-pages', where: { book: { equals: bookId } } })
    for (const doc of existingPages.docs) {
      if (doc.image) {
        try {
          await payload.delete({ collection: 'page-images', id: doc.image })
        } catch (err) {
          payload.logger.error(`extractBookPages: could not delete old page image ${doc.image}: ${err}`)
        }
      }
    }

    const document = await pdf(buffer, { scale: 3 })
    const total = document.length

    let pages = 0

    // Index-based loop with per-page isolation: a page that fails to render or
    // store is logged and skipped, so one bad page can't kill the whole book
    // (the `for await` iterator would abort the job on the first throw).
    for (let n = 1; n <= total; n++) {
      let pngBuffer: Buffer
      try {
        pngBuffer = await document.getPage(n)
      } catch (err) {
        payload.logger.error(`extractBookPages: skipping page ${n}/${total} of book ${bookId} (render failed): ${err}`)
        continue
      }

      try {
        const webp = await sharp(pngBuffer).webp({ quality: 82 }).toBuffer()

        const image = await payload.create({
          collection: 'page-images',
          data: {},
          file: {
            data: webp,
            name: `book-${bookId}-page-${String(n).padStart(4, '0')}.webp`,
            mimetype: 'image/webp',
            size: webp.length,
          },
        })

        await payload.create({
          collection: 'book-pages',
          data: { book: bookId, pageNumber: n, image: image.id },
        })
        pages += 1
      } catch (err) {
        payload.logger.error(`extractBookPages: skipping page ${n}/${total} of book ${bookId} (store failed): ${err}`)
      }
    }

    return { output: { pages, total } }
  },
}
