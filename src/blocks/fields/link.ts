import type { Field } from 'payload'

// ACF ships a dedicated "link" field (title + url + target). Payload has no
// single link field, so the idiomatic equivalent is a small group. This is one
// of the few ACF field types with no 1:1 mapping — you compose it.
export const linkField = (name: string, label?: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'label',
      type: 'text',
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
      defaultValue: false,
    },
  ],
})
