import type { CollectionConfig } from 'payload'

// Maps the Prisma `BookVote` model. A user voting a book.
export const BookVotes: CollectionConfig = {
  slug: 'book-votes',
  admin: {
    group: 'Engagement',
    defaultColumns: ['user', 'book', 'createdAt'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true,
      index: true,
    },
  ],
}
