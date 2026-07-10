import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PageImages } from './collections/PageImages'
import { Tags } from './collections/Tags'
import { Authors } from './collections/Authors'
import { Books } from './collections/Books'
import { BookFiles } from './collections/BookFiles'
import { BookPages } from './collections/BookPages'
import { BookVotes } from './collections/BookVotes'
import { FollowedAuthors } from './collections/FollowedAuthors'
import { FollowedBooks } from './collections/FollowedBooks'
import { Orders } from './collections/Orders'
import { Payments } from './collections/Payments'
import { Pages } from './collections/Pages'
import { extractBookPages } from './jobs/extractBookPages'
import { PaymentSettings } from './globals/PaymentSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Media,
    PageImages,
    Tags,
    Authors,
    Books,
    BookFiles,
    BookPages,
    BookVotes,
    FollowedAuthors,
    FollowedBooks,
    Orders,
    Payments,
    Pages,
    Users,
  ],
  globals: [PaymentSettings],
  editor: lexicalEditor(),
  // Background jobs. `extractBookPages` renders a book's PDF into page images.
  // In dev, autoRun polls the queue every minute so uploads get processed
  // without a separate worker. In production you'd run `payload jobs:run
  // --cron ...` in its own process instead.
  jobs: {
    tasks: [extractBookPages],
    autoRun: [
      {
        cron: '* * * * *',
        queue: 'default',
        limit: 5,
      },
      {
        // PDF page extraction runs on its own queue with limit 1: pdf-to-img /
        // pdfjs shares state in-process and corrupts renders when two books
        // extract concurrently, so these jobs must run one at a time.
        cron: '* * * * *',
        queue: 'pdf-extract',
        limit: 1,
      },
    ],
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // The project's own route handlers live under src/app/(app)/api/*, which
  // serve /api/auth, /api/checkout, /api/file, /api/notifyPayment. To avoid a
  // catch-all collision with those, Payload's REST + GraphQL API is mounted at
  // /payload-api instead of the default /api. By default Payload nests GraphQL
  // under the api path (/api/graphql), so when `api` is overridden the
  // `graphQL` and `graphQLPlayground` routes must be set explicitly too. The
  // route folders under src/app/(payload)/payload-api/ MUST match these values.
  routes: {
    api: '/payload-api',
    graphQL: '/payload-api/graphql',
    graphQLPlayground: '/payload-api/graphql-playground',
  },
  db: postgresAdapter({
    // Payload shares the `onomato` database with the existing Prisma app.
    // Isolate Payload's tables in their own `payload` schema so its dev-mode
    // schema introspection/push never touches Prisma's tables (some of which
    // have composite primary keys that crash Payload's schema pull — see
    // payloadcms/payload#12858). Safe here because Payload's table names
    // (users, media, payload_*) do not collide with Prisma's PascalCase tables.
    schemaName: 'payload',
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
})
