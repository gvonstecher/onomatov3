import type { CollectionConfig } from 'payload'

// Maps the Prisma `Book` model. `tags` is the many-to-many that replaces the
// old `BookTag` junction table (relationship + hasMany). `createdAt` is added
// automatically by Payload (timestamps default to true).
export const Books: CollectionConfig = {
  slug: 'books',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Catalog',
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [
      // Enqueue page extraction whenever the source PDF is set or replaced.
      // Guarded so unrelated edits (title, price, etc.) don't reprocess.
      async ({ req, doc, previousDoc, operation }) => {
        const pdfChanged = doc.pdf && doc.pdf !== previousDoc?.pdf
        if (pdfChanged) {
          await req.payload.jobs.queue({
            task: 'extractBookPages',
            input: { bookId: doc.id },
            queue: 'pdf-extract',
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
    },
    {
      // Last page readable for free (preview). Was `last_free_page` SmallInt.
      name: 'lastFreePage',
      type: 'number',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      // Creative attribution: one or more authors, each with a role. Covers
      // "autor completo" (single credit) and "guionista + dibujante" (two).
      // Kept separate from ownership (a future `publisher`/label account).
      name: 'credits',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Crédito', plural: 'Créditos' },
      fields: [
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'authors',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          defaultValue: 'autor completo',
          options: ['autor completo', 'guionista', 'dibujante', 'entintador', 'colorista', 'letrista'],
        },
      ],
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      // Source PDF: the downloadable book and the input for page extraction.
      // Setting it enqueues the page-extraction job (see afterChange hook).
      name: 'pdf',
      type: 'upload',
      relationTo: 'book-files',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
}
