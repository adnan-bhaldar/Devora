import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)],
  )
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
        .filter((path) => path !== '/sw.js' && !path.endsWith('.map'))
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
    precachePlugin()
  ],
})