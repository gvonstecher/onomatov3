import type { CollectionConfig } from 'payload'

// Maps the Prisma `FollowedAuthor` model (a user following an author). The old
// composite primary key (id_user + id_author) becomes a regular collection
// with two relationships; uniqueness can be enforced later via a hook if needed.
export const FollowedAuthors: CollectionConfig = {
  slug: 'followed-authors',
  admin: {
    group: 'Engagement',
    defaultColumns: ['user', 'author'],
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
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      index: true,
    },
  ],
}
