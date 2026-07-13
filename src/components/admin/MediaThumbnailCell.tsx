'use client'

import type { DefaultCellComponentProps } from 'payload'
import React from 'react'

// Renders a small image preview inside the Media list-view table, so rows are
// recognizable at a glance instead of showing only the alt text. Reads the
// thumbnail rendition from the row (falling back to the medium size, then the
// original) — no extra request, the URLs are already on the row data.
export const MediaThumbnailCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
  const row = (rowData ?? {}) as Record<string, any>
  const src: string | undefined =
    row.thumbnailURL ||
    row.sizes?.thumbnail?.url ||
    row.sizes?.medium?.url ||
    row.url

  if (!src) {
    return <span style={{ color: 'var(--theme-elevation-400)' }}>—</span>
  }

  return (
    <img
      src={src}
      alt={row.alt || ''}
      style={{
        width: 48,
        height: 48,
        objectFit: 'cover',
        borderRadius: 4,
        display: 'block',
        background: 'var(--theme-elevation-100)',
      }}
    />
  )
}

export default MediaThumbnailCell
