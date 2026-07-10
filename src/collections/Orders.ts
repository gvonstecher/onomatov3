import type { CollectionConfig } from 'payload'

// A pay-per-book order. Provider-agnostic (MercadoPago today, PayPal later).
// Money is stored in integer cents. The sale is split at the gateway: the
// platform keeps `platformFee` and the book owner receives `authorAmount`
// directly to their account (marketplace split), so we hold no author money.
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: 'Commerce',
    defaultColumns: ['user', 'book', 'status', 'grossAmount'],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'cancelled', 'refunded'],
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
      name: 'grossAmount',
      type: 'number',
      admin: { description: 'Total charged, in cents.' },
    },
    {
      name: 'platformFee',
      type: 'number',
      admin: { description: 'Platform commission, in cents.' },
    },
    {
      name: 'authorAmount',
      type: 'number',
      admin: { description: 'Paid directly to the book owner, in cents.' },
    },
    {
      name: 'currencyId',
      type: 'text',
      defaultValue: 'ARS',
    },
    {
      name: 'provider',
      type: 'select',
      options: ['mercadopago', 'paypal'],
    },
    {
      // The gateway's order/preference reference for this order.
      name: 'providerReference',
      type: 'text',
    },
  ],
}
