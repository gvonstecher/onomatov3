'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { RenderBlocks } from './RenderBlocks'

// Client wrapper for Live Preview. Outside the admin it just renders the data
// the server component already fetched. Inside the admin's preview iframe,
// `useLivePreview` takes over: it listens for the editor's form state over
// postMessage and re-populates (depth 2 → image URLs + related books) so the
// blocks re-render on every keystroke, no save required.
export function PageClient({ page }) {
  // serverURL validates the postMessage origin; it must match the admin's
  // origin. Same-origin here, so derive it from the window at runtime instead
  // of a build-time env var (which points at a dead ngrok tunnel).
  const serverURL = typeof window !== 'undefined' ? window.location.origin : ''

  const { data } = useLivePreview({
    initialData: page,
    serverURL,
    // Payload's REST API is mounted at /payload-api (not the default /api),
    // because the app's own route handlers live under /api. The hook re-fetches
    // populated data (depth 2) from this route on each change, so it must match.
    apiRoute: '/payload-api',
    depth: 2,
  })

  return <RenderBlocks blocks={data?.layout ?? []} />
}
