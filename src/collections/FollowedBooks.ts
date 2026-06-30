import type { CollectionConfig } from 'payload'

// Maps the Prisma `FollowedBook` model. `bought` is the ownership flag set
// after a confirmed payment; `lastPageRead` tracks reading progress. The old
// composite PK (id_user + id_book) becomes a regular collection.
export const FollowedBooks: CollectionConfig = {
  slug: 'followed-books',
  admin: {
    defaultColumns: ['user', 'book', 'bought'],
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
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
    },
    {
      name: 'bought',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'lastPageRead',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
