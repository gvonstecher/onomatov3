import type { CollectionConfig } from 'payload'

// A payment against an order, provider-agnostic. Amount in integer cents.
export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    group: 'Commerce',
    defaultColumns: ['order', 'provider', 'status', 'amount', 'date'],
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
      name: 'provider',
      type: 'select',
      options: ['mercadopago', 'paypal'],
      required: true,
    },
    {
      // The gateway's payment id. Text (gateway ids can exceed JS-safe ints).
      name: 'providerPaymentId',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'amount',
      type: 'number',
      admin: { description: 'Amount, in cents.' },
    },
    {
      name: 'currencyId',
      type: 'text',
      defaultValue: 'ARS',
    },
    {
      name: 'status',
      type: 'select',
      options: ['approved', 'pending', 'rejected', 'refunded'],
      required: true,
    },
    {
      name: 'date',
      type: 'date',
    },
  ],
}
