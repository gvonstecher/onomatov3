import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from './RenderBlocks'

// Decoupled page: the frontend asks Payload for a Page by slug and renders its
// block layout. Payload is consumed purely as a content backend — this route
// knows nothing about the database, only the content contract. depth: 2
// populates uploads (image URLs) and relationships (selected books).
export const dynamic = 'force-dynamic'

export default async function DecoupledPage({ params }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const page = docs[0]
  if (!page) notFound()

  return (
    <main>
      <RenderBlocks blocks={page.layout ?? []} />
    </main>
  )
}
