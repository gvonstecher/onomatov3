import type { CollectionConfig } from 'payload'

// Maps the Prisma `Payment` model. `mercadopagoPaymentId` was a BigInt unique
// in Prisma; stored here as text to avoid JS number-precision loss on large ids.
export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    group: 'Commerce',
    defaultColumns: ['order', 'status', 'amount', 'date'],
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      index: true,
    },
    {
      name: 'amount',
      type: 'number',
    },
    {
      name: 'currencyId',
      type: 'text',
    },
    {
      name: 'mercadopagoPaymentId',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
    },
  ],
}
