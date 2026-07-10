import type { CollectionConfig } from 'payload'

// A user following a book (wishlist / follow). Ownership is NOT stored here —
// it is derived from a paid Order (single source of truth). Reading progress,
// if added later, belongs in its own collection.
export const FollowedBooks: CollectionConfig = {
  slug: 'followed-books',
  admin: {
    group: 'Engagement',
    defaultColumns: ['user', 'book'],
  },
  indexes: [
    // One follow row per (user, book).
    { fields: ['user', 'book'], unique: true },
  ],
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
