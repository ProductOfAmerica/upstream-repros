import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const describe = (el) =>
  el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.getAttribute('aria-hidden') ? '[aria-hidden]' : ''}${el.textContent ? ' "' + el.textContent.trim() + '"' : ''}` : 'null';

// Records every focus event (including programmatic ones) with the element it landed on.
async function trackFocus(page) {
  await page.evaluate((src) => {
    window.__focusLog = [];
    window.__describe = new Function('el', `return (${src})(el)`);
    document.addEventListener('focusin', (e) => window.__focusLog.push(window.__describe(e.target)), true);
  }, describe.toString());
}

const settled = (page) => page.evaluate(() => window.__describe(document.activeElement));
const takeLog = (page) => page.evaluate(() => window.__focusLog.splice(0));

async function openMenu(page) {
  await page.goto('/');
  await trackFocus(page);
  await page.focus('#trigger');
  await page.keyboard.press('Enter');
  await expect(page.locator('#link-a')).toBeVisible();
  await takeLog(page);
}

test('axe: aria-hidden-focus on an open NavigationMenu item', async ({ page }) => {
  await openMenu(page);
  const results = await new AxeBuilder({ page }).analyze();
  const hit = results.violations.find((v) => v.id === 'aria-hidden-focus');
  console.log('axe-core', results.testEngine.version);
  console.log('violations:', results.violations.map((v) => v.id));
  console.log('aria-hidden-focus nodes:', JSON.stringify(hit?.nodes.map((n) => ({ html: n.html, target: n.target, failureSummary: n.failureSummary })), null, 2));
  expect(hit).toBeDefined();
});

test('axe: closed menu has no violation', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((v) => v.id)).not.toContain('aria-hidden-focus');
});

test('proxy computed box and listener', async ({ page }) => {
  await openMenu(page);
  const info = await page.evaluate(() => {
    const el = document.querySelector('[aria-hidden="true"][tabindex="0"]');
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { outerHTML: el.outerHTML, onfocusProperty: el.onfocus, width: cs.width, height: cs.height, pointerEvents: cs.pointerEvents, position: cs.position, rect: [r.width, r.height] };
  });
  console.log('proxy:', JSON.stringify(info, null, 2));
});

test('Tab from trigger passes through the proxy into the content', async ({ page }) => {
  await openMenu(page);
  await page.keyboard.press('Tab');
  console.log('Tab from trigger, focus events:', await takeLog(page), '| settled on:', await settled(page));
});

test('Shift+Tab from first link', async ({ page }) => {
  await openMenu(page);
  await page.keyboard.press('Tab');
  await takeLog(page);
  await page.keyboard.press('Shift+Tab');
  console.log('Shift+Tab from first link, focus events:', await takeLog(page), '| settled on:', await settled(page));
});

test('Tab past last link', async ({ page }) => {
  await openMenu(page);
  await page.keyboard.press('Tab'); // link-a
  await page.keyboard.press('Tab'); // link-b
  await takeLog(page);
  await page.keyboard.press('Tab');
  console.log('Tab from last link, focus events:', await takeLog(page), '| settled on:', await settled(page));
});

test('Shift+Tab from trigger', async ({ page }) => {
  await openMenu(page);
  await page.keyboard.press('Shift+Tab');
  console.log('Shift+Tab from trigger, focus events:', await takeLog(page), '| settled on:', await settled(page));
});

test('Tab order stops (never rests on proxy)', async ({ page }) => {
  await openMenu(page);
  const stops = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    stops.push(await settled(page));
  }
  console.log('Six Tab presses from trigger, resting element after each:', stops);
  expect(stops.some((s) => s.includes('[aria-hidden]'))).toBe(false);
});

test('Shift+Tab stops (never rests on proxy)', async ({ page }) => {
  await openMenu(page);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const stops = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Shift+Tab');
    stops.push(await settled(page));
  }
  console.log('Six Shift+Tab presses from link-b, resting element after each:', stops);
  expect(stops.some((s) => s.includes('[aria-hidden]'))).toBe(false);
});

test('accessibility tree around the proxy', async ({ page }) => {
  await openMenu(page);
  console.log(await page.locator('li').ariaSnapshot());
});

test('content with nothing tabbable: focus rests on the proxy', async ({ page }) => {
  await page.goto('/?content=text');
  await trackFocus(page);
  await page.focus('#trigger');
  await page.keyboard.press('Enter');
  await expect(page.locator('#text')).toBeVisible();
  await takeLog(page);
  await page.keyboard.press('Tab');
  console.log('Tab from trigger, text-only content, focus events:', await takeLog(page), '| settled on:', await settled(page));
  await page.keyboard.press('Tab');
  console.log('Next Tab settled on:', await settled(page));
});
