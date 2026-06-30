import type { CollectionConfig } from 'payload'

// Maps the Prisma `Author` model. The `AuthorSocialmedia` table disappears:
// it becomes an `array` field below (data that only exists hanging off the
// parent does not deserve its own collection). `user` is now a clean Payload
// relationship to Users instead of the old `id_user` text/cuid hack, because
// Users lives inside Payload too.
export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'headerPhoto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialmedias',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: ['twitter', 'instagram', 'facebook', 'youtube', 'tiktok', 'website'],
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}
