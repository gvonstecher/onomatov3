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
  ],
}
