import type { CollectionConfig } from 'payload'

// App users. `auth: true` makes this the authentication collection: Payload
// adds email + password, sessions (JWT/cookies) and the admin-panel login.
// Replaces the NextAuth `User` / `Account` / `Session` Prisma models.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'System',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email and password are added by default via `auth: true`.
    {
      name: 'name',
      type: 'text',
    },
    {
      // WordPress-style account roles. Access control checks these (e.g. admin
      // and editor bypass the reader paywall). Only admins can change them.
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['reader'],
      options: ['admin', 'editor', 'author', 'reader'],
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
      },
    },
    // Bidirectional views (virtual — no columns, read the FK on the other side):
    {
      // The author profile linked to this user, if any (reverse of the 1:1
      // Authors.user). One row max because Authors.user is unique.
      name: 'author',
      type: 'join',
      collection: 'authors',
      on: 'user',
      admin: { allowCreate: false },
    },
    {
      // This user's purchases (reverse of Orders.user).
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'user',
      admin: { allowCreate: false, defaultColumns: ['book', 'status', 'grossAmount'] },
    },
  ],
}
