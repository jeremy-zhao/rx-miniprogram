import { defineConfig } from 'tsup'
import fs from 'fs-extra'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  outDir: './lib',
})

process.on('beforeExit', (code) => {
  if (code !== 0) return

  fs.renameSync('lib/index.js', 'lib/rx-miniprogram.js')
  fs.renameSync('lib/index.js.map', 'lib/rx-miniprogram.js.map')
  fs.renameSync('lib/index.d.ts', 'lib/rx-miniprogram.d.ts')
})
