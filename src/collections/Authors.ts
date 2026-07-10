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
    group: 'Catalog',
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
      // One author profile per user (enforces the 1:1 account↔profile link).
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
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
    {
      // Where this author gets paid, per gateway. Used for the marketplace
      // direct split (the payout goes straight to their gateway account).
      name: 'payoutAccounts',
      type: 'array',
      labels: { singular: 'Cuenta de cobro', plural: 'Cuentas de cobro' },
      fields: [
        {
          name: 'provider',
          type: 'select',
          options: ['mercadopago', 'paypal'],
          required: true,
        },
        {
          name: 'accountId',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
