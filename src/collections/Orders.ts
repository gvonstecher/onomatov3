import type { CollectionConfig } from 'payload'

// Maps the Prisma `Order` model. A pay-per-book order linked to MercadoPago.
// `createdAt` is added automatically by Payload.
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    defaultColumns: ['user', 'book', 'status', 'price'],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'cancelled'],
      defaultValue: 'pending',
    },
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
      name: 'price',
      type: 'number',
    },
    {
      name: 'currencyId',
      type: 'text',
    },
    {
      // MercadoPago preference/order id.
      name: 'mercadopagoId',
      type: 'text',
    },
  ],
}
