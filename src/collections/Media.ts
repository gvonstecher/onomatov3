import type { CollectionConfig } from 'payload'

// Central image store. Replaces the Prisma `File` model and its custom
// sharp + object-hash pipeline (src/app/(app)/api/file/route.js). Payload
// handles upload, storage and resize natively via the `upload` config below.
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    // Lead the list with an image preview so rows are recognizable at a glance.
    defaultColumns: ['preview', 'alt', 'updatedAt'],
  },
  upload: {
    mimeTypes: ['image/*'],
    // WordPress-style image sizes. The original file is always kept as-is;
    // Payload generates these extra renditions with sharp on every upload.
    imageSizes: [
      {
        // Square crop for lists/grids (like the WP "thumbnail" size). Both
        // dimensions set → sharp cover-crops around the focal point.
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        // Intermediate rendition for detail views: capped at 1024px wide,
        // aspect ratio preserved (no height, no crop). Small originals are
        // not upscaled.
        name: 'medium',
        width: 1024,
        withoutEnlargement: true,
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
  fields: [
    {
      // Presentational-only column: renders the thumbnail in the list view.
      // A `ui` field holds no data; its Cell reads the row's image URLs.
      name: 'preview',
      type: 'ui',
      label: 'Preview',
      admin: {
        components: {
          Cell: '/components/admin/MediaThumbnailCell#MediaThumbnailCell',
        },
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
