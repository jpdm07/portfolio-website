/**
 * Capture LUNE homepage desktop mockup; waits for hero Unsplash image to decode.
 * Usage (preview running): npx --package=playwright node scripts/capture-lune-desktop.mjs
 * Optional: LUNE_URL=https://jpdm07.github.io/lune-store/
 */
import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(__dirname, '..', 'images', 'lune-store-desktop.png')
/** Prefer local preview (matches latest build); set LUNE_URL for production. */
const url = process.env.LUNE_URL || 'http://127.0.0.1:4173/lune-store/'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
await page.waitForFunction(
  () => {
    const img = document.querySelector('#root section:first-of-type img')
    return img && img.complete && img.naturalWidth > 200
  },
  { timeout: 60000 }
)
await page.waitForTimeout(400)
await page.screenshot({ path: out, type: 'png' })
await browser.close()
console.log('Wrote', out)
