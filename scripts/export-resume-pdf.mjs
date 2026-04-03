/**
 * Regenerate Jane_Chavez_Resume_2026.pdf from resume.html (uses @media print styles).
 * Run from repo root: npx -p playwright node scripts/export-resume-pdf.mjs
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'resume.html');
const outPath = path.join(root, 'Jane_Chavez_Resume_2026.pdf');
const url = pathToFileURL(htmlPath).href;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 120000 });
await new Promise((r) => setTimeout(r, 2500));
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: outPath,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0.2in', bottom: '0.25in', left: '0.35in', right: '0.35in' },
});
await browser.close();
console.log('Wrote', outPath);
