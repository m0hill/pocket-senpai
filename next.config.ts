import lingoCompiler from 'lingo.dev/compiler'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
}

const withLingo = lingoCompiler.next({
  sourceRoot: 'src/app',
  lingoDir: 'lingo',
  sourceLocale: 'en',
  targetLocales: ['es', 'fr', 'de', 'ja', 'zh'],
  rsc: true,
  useDirective: false,
  debug: false,
  models: 'lingo.dev',
})

// Conditionally apply Lingo compiler based on environment variable
const shouldUseLingo = process.env.NEXTJS_ENV !== 'development'

export default shouldUseLingo ? withLingo(nextConfig) : nextConfig

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()
