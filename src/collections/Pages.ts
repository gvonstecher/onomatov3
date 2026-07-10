import type { CollectionConfig } from 'payload'
import { HeroV2 } from '../blocks/HeroV2'
import { ProductReel } from '../blocks/ProductReel'

// Block-based page builder — the Payload analog of a WordPress page assembled
// from ACF Flexible Content. `layout` is a `blocks` field (= ACF Flexible
// Content): editors add, reorder and remove blocks in the admin.
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroV2, ProductReel],
    },
  ],
}
