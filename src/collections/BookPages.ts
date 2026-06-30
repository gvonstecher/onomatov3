import type { CollectionConfig } from 'payload'

// Maps the Prisma `BookPage` model. Kept as its own collection (not an array
// inside Books) because a book can have hundreds of pages, each with its own
// image, and the reader loads them page by page.
export const BookPages: CollectionConfig = {
  slug: 'book-pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'pageNumber',
    defaultColumns: ['book', 'pageNumber'],
  },
  fields: [
    {
      name: 'pageNumber',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true,
      index: true,
    },
    {
      // Rendered WebP page image, generated from the book's PDF by the
      // extraction job. Not uploaded by hand.
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
