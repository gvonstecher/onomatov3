import type { CollectionConfig } from 'payload'

// Maps the Prisma `Tag` model. The `BookTag` junction table disappears:
// the many-to-many lives as a `relationship` field with `hasMany` on Books.
export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Catalog',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      // Books carrying this tag (reverse of Books.tags, a hasMany relationship).
      name: 'books',
      type: 'join',
      collection: 'books',
      on: 'tags',
      admin: { allowCreate: false },
    },
  ],
}
