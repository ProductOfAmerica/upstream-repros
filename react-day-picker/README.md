# react-day-picker: default day button name fails axe `label-content-name-mismatch`

`<DayPicker mode="single" />` renders day buttons whose visible text is `22` but whose accessible name is `Thursday, January 22nd, 2026`. axe-core flags this under WCAG 2.5.3 (Label in Name) because `22` is not a whole word of `22nd`.

Versions: react-day-picker 10.0.2, axe-core 4.14.0 (via @axe-core/playwright 4.14.0), Playwright 1.64.1, React 19.3.1, Vite 8.3.5, Chromium, locale en-US.

## Run

```sh
npm install
npm run dev            # http://localhost:5181
# in a second terminal:
npm run check          # exits 1 and prints the violation
```

`check.mjs` launches Playwright's Chromium. If Playwright has no matching browser installed, run `npx playwright install chromium` or set `CHROMIUM_PATH` to a Chromium executable.

## Expected output (abridged)

```
<button class="rdp-day_button" type="button" tabindex="-1" aria-label="Thursday, January 22nd, 2026">22</button>
axe-core 4.14.0
violations: 1
label-content-name-mismatch (serious)
affected nodes: 31
Text inside the element is not included in the accessible name
```
