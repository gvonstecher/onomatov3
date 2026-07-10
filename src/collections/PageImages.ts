import type { CollectionConfig } from 'payload'

// Generated book-page images (rendered from PDFs by the extractBookPages job).
// Kept separate from `Media` so the curated media library (covers, author
// photos) isn't flooded with thousands of derived page files.
export const PageImages: CollectionConfig = {
  slug: 'page-images',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [],
}
