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
  ],
}
