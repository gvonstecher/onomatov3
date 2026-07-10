import type { Field } from 'payload'

// Shared "Heading" field — the Payload analog of MadCave's ACF clone group
// "Support: Heading" (a heading tag + text), reused across blocks. In ACF this
// is a `clone`; in Payload a reusable factory that returns a `group` field.
export const headingField = (name = 'heading'): Field => ({
  name,
  type: 'group',
  fields: [
    {
      name: 'tag',
      type: 'select',
      defaultValue: 'h2',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    {
      name: 'text',
      type: 'text',
    },
  ],
})
