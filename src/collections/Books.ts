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
      admin: { description: 'Price in cents (e.g. 80000 = $800).' },
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
      // Ownership: the author account that uploaded the book and receives the
      // payout (the marketplace split goes to this account). Distinct from
      // `credits` (attribution). A future label/publisher would go here too.
      name: 'owner',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
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
    // Bidirectional views (virtual — no columns, read the FK on the other side):
    {
      // Generated PDF page images (reverse of BookPages.book). Lets the admin
      // list a book's pages inline instead of the separate Book Pages screen.
      name: 'pages',
      type: 'join',
      collection: 'book-pages',
      on: 'book',
      admin: { allowCreate: false, defaultColumns: ['pageNumber', 'image'] },
    },
    {
      // Users following this book (reverse of FollowedBooks.book).
      name: 'followers',
      type: 'join',
      collection: 'followed-books',
      on: 'book',
      admin: { allowCreate: false },
    },
    {
      // Votes cast on this book (reverse of BookVotes.book).
      name: 'votes',
      type: 'join',
      collection: 'book-votes',
      on: 'book',
      admin: { allowCreate: false },
    },
  ],
}
