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
    // Live Preview: the admin renders the real frontend in an iframe and streams
    // the in-editor form state to it in real time (no save). `url` points each
    // Page at its own decoupled /p/[slug] route; breakpoints drive the
    // responsive toolbar. This is the self-hosted answer to Storyblok's visual
    // editing — the content model stays code-first, the preview is the live app.
    livePreview: {
      // Relative URL → the iframe loads same-origin as the admin (localhost in
      // dev, the real host in prod). No dependency on NEXT_PUBLIC_BASE_FETCH_URL,
      // which points at an ngrok tunnel used for MercadoPago webhooks.
      url: ({ data }) => `/p/${data?.slug ?? ''}`,
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 375, height: 667 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
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
