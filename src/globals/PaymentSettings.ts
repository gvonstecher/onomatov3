import type { GlobalConfig } from 'payload'

// Platform-wide payment settings. `commissionPercent` is the cut the platform
// takes from each sale; the rest is paid directly to the book owner's gateway
// account (marketplace split), so we never hold the author's money.
export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  admin: {
    group: 'System',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'commissionPercent',
      type: 'number',
      defaultValue: 15,
      min: 0,
      max: 100,
      required: true,
      admin: { description: 'Platform commission taken from each sale (percent).' },
    },
  ],
}
