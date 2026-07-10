import type { Block } from 'payload'
import { headingField } from './fields/heading'
import { linkField } from './fields/link'

// Port of MadCave's ACF block `acf/product-reel` (single). Field-type mapping:
//   ACF accordion "Content"/"Settings" -> Payload `collapsible`
//   ACF clone "Heading"                 -> shared `group` (headingField)
//   ACF true_false                      -> `checkbox`
//   ACF conditional_logic               -> `admin.condition`
//   ACF relationship                    -> `relationship`
//
// Adapted to onomato's domain: MadCave "products" -> `books`. MadCave-specific
// multisite fields (`site_origin`, `volume`) are dropped — they only make
// sense in a WordPress multisite comics catalog.
export const ProductReel: Block = {
  slug: 'productReel',
  labels: { singular: 'Product Reel', plural: 'Product Reels' },
  fields: [
    {
      type: 'collapsible',
      label: 'Content',
      admin: { initCollapsed: false },
      fields: [
        headingField('heading'),
        {
          name: 'subheading',
          type: 'text',
          admin: { description: 'Displays above the main heading' },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        linkField('viewAllButton', 'View All Button'),
        {
          name: 'sliderHeading',
          type: 'text',
        },
        {
          name: 'backgroundVisual',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'backgroundVisualMobile',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'brandSvg',
          type: 'upload',
          relationTo: 'media',
          label: 'Banner Decorative Element',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Settings',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'productsToShow',
          type: 'number',
          defaultValue: 8,
          min: 1,
          max: 12,
          admin: { description: 'How many cards to display' },
        },
        {
          name: 'automaticSelection',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'On = auto-pick by criteria; off = choose manually' },
        },
        {
          // Manual mode (MadCave: selected products/variations relationship).
          name: 'selectedBooks',
          type: 'relationship',
          relationTo: 'books',
          hasMany: true,
          admin: {
            condition: (_data, siblingData) => !siblingData?.automaticSelection,
          },
        },
        {
          // Automatic mode: selection criteria.
          name: 'selectionType',
          type: 'select',
          defaultValue: 'new_releases',
          options: [
            { label: 'New Releases', value: 'new_releases' },
            { label: 'Trending Now', value: 'trending_now' },
            { label: 'Best Sellers', value: 'best_sellers' },
          ],
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.automaticSelection),
          },
        },
        {
          name: 'blockPosition',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'First', value: 'first' },
            { label: 'Last', value: 'last' },
          ],
          admin: { description: 'Position when multiple reels are stacked' },
        },
      ],
    },
  ],
}
