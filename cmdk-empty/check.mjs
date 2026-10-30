import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5184';
const variants = [
  'base',
  'no-empty',
  'group',
  'has-match',
  'empty-only',
  'empty-outside-list',
  'plain-empty-listbox',
  'plain-sizer',
  'plain-sizer-text',
  'plain-sizer-presentation',
  'plain-presentation-direct',
];

const browser = await chromium.launch();
for (const v of variants) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${BASE}/?v=${v}`);
  await page.waitForSelector('[role=listbox]', { state: 'attached' });
  const results = await new AxeBuilder({ page }).withRules(['aria-required-children']).analyze();
  const html = await page.$eval('[role=listbox]', (el) => el.outerHTML);
  console.log(`\n=== ${v}`);
  console.log('violations:', results.violations.length, ' incomplete:', results.incomplete.length);
  for (const r of [...results.violations, ...results.incomplete]) {
    for (const n of r.nodes) {
      console.log(' ', results.violations.includes(r) ? 'VIOLATION' : 'incomplete', n.target.join(' '));
      console.log('   ', n.failureSummary?.replace(/\n/g, '\n    '));
    }
  }
  console.log('listbox html:', html);
  if (v === 'base') console.log('axe-core', results.testEngine.version);
  await context.close();
}
await browser.close();



