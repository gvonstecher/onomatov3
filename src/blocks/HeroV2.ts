import type { Block } from 'payload'
import { headingField } from './fields/heading'
import { linkField } from './fields/link'

// Port of MadCave's ACF block `acf/hero-v2`. Field-type mapping:
//   ACF repeater "slides"  -> Payload `array`
//   ACF clone "Heading"    -> shared `group` (headingField)
//   ACF image (return id)  -> `upload` (relationTo media)
//   ACF range              -> `number` with min/max/step
//   ACF link               -> `group` (linkField)
export const HeroV2: Block = {
  slug: 'heroV2',
  labels: { singular: 'Hero V2', plural: 'Hero V2' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: { initCollapsed: true },
      fields: [
        headingField('title'),
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Desktop background (recommended 1920x1080)' },
        },
        {
          name: 'mobileBackgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Falls back to the desktop image if empty' },
        },
        {
          name: 'backgroundOverlayOpacity',
          type: 'number',
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: { step: 5, description: '0 = transparent, 100 = fully opaque' },
        },
        linkField('primaryButton', 'Primary Button'),
        linkField('secondaryButton', 'Secondary Button'),
      ],
    },
  ],
}
