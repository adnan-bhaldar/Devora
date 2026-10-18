import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { categories, tools } from './src/data/tools.js'

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)],
  )
}

// The site's public address, from SITE_URL or Vercel. Empty when unknown.
function getSiteUrl() {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return (process.env.SITE_URL ?? (vercelHost ? `https://${vercelHost}` : '')).replace(/\/+$/, '')
}


/*
 * Writes sitemap.xml and robots.txt (which points to it) so search engines can find every page.
 * It needs the site's address: set SITE_URL (for example https://devora.example.com) when
 * building. Vercel provides its own production address automatically, so no setup is needed there.
 * Without an address a sitemap can't be written, so the plain public/robots.txt is used instead.
 */
function seoFilesPlugin() {
  let outDir

  return {
    name: 'devora-seo-files',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir)
    },
    // Link previews need full web addresses for og:url and og:image, which are only known at
    // build time. Without a site address they are left out rather than written wrongly.
    transformIndexHtml() {
      const base = getSiteUrl()
      if (!base) return []
      return [
        { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: `${base}/icons/icon-512.png` }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${base}/icons/icon-512.png` }, injectTo: 'head' },
      ]
    },
    closeBundle() {
      const base = getSiteUrl()
      if (!base) {
        console.warn('[devora] SITE_URL is not set, so sitemap.xml was not generated.')
        return
      }

      const paths = [
        '/',
        '/about',
        ...categories
          .filter((category) => tools.some((tool) => tool.categories.includes(category.id)))
          .map((category) => `/categories/${category.id}`),
        ...tools.filter((tool) => tool.status === 'live').map((tool) => tool.route),
      ]
      const entries = paths.map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n')

      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
      )
      writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`)
    },
  }
}

/*
 * After the build, writes the list of every built file into the service worker, together with
 * a version made from the files' contents. The version changes whenever any file changes, so
 * visitors always get an up-to-date app and old saved files are cleaned up.
 */
function precachePlugin() {
  let outDir

  return {
    name: 'devora-precache',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir)
    },
    closeBundle() {
      const files = listFiles(outDir)
        .map((file) => '/' + relative(outDir, file).split('\\').join('/'))
        .filter((path) => !['/sw.js', '/robots.txt', '/sitemap.xml'].includes(path) && !path.endsWith('.map'))
        .sort()

      const hash = createHash('sha256')
      for (const path of files) hash.update(path).update(readFileSync(join(outDir, path)))
      const version = hash.digest('hex').slice(0, 10)

      const swPath = join(outDir, 'sw.js')
      const source = readFileSync(swPath, 'utf8')
        .replace('__BUILD_VERSION__', version)
        .replace("'__PRECACHE_LIST__'", JSON.stringify(files))
      writeFileSync(swPath, source)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoFilesPlugin(),
    precachePlugin()
  ],
})