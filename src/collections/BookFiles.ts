import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Absolute dir where uploaded PDFs land. Exported so the page-extraction job
// can read the file straight off disk by `path.join(bookFilesDir, filename)`.
export const bookFilesDir = path.resolve(dirname, '../../uploads/book-files')

// Source PDF for a book: the downloadable file AND the input for page
// extraction. Kept separate from `Media` because Media only accepts images
// (mimeTypes image/*) and because a PDF download is paid content with
// different access rules than the public page previews.
export const BookFiles: CollectionConfig = {
  slug: 'book-files',
  access: {
    // Placeholder: only authenticated users. Real gating (only buyers of the
    // related book) comes when we wire purchase-based access control.
    read: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: bookFilesDir,
    mimeTypes: ['application/pdf'],
  },
  fields: [],
}
