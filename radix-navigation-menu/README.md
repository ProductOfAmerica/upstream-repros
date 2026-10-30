# NavigationMenu focus proxy: axe `aria-hidden-focus` and Tab behavior

Minimal page with one open Radix `NavigationMenu` item, checked with
`@axe-core/playwright` in headless Chromium, plus keyboard checks of how focus
moves through the visually hidden `<span aria-hidden="true" tabindex="0">`
focus proxy.

Versions pinned in `package.json`: radix-ui 1.8.1 (which resolves
`@radix-ui/react-navigation-menu` 1.4.1), React 19.2.0, axe-core 4.14.0,
Playwright 1.64.1 (Chromium 156.0.8078.4).

## Run

```sh
npm install
npx playwright install chromium   # once
npx playwright test
```

Playwright starts the Vite dev server on port 5183 itself. To look at the page
by hand: `npm run dev`, then open http://localhost:5183 (and
http://localhost:5183/?content=text for the panel with no links).

## What the tests show

- axe reports `aria-hidden-focus` (serious) for the proxy while an item is open,
  and nothing when closed.
- With links in the panel, the proxy receives focus for one step and forwards it:
  Tab from the trigger goes proxy, then first link; Shift+Tab from the first link
  goes proxy, then trigger; Tab from the last link goes proxy, then the next
  page element. Focus never comes to rest on it.
- With a panel that has nothing tabbable (`?content=text`), Tab from the trigger
  stops on the proxy and stays there. The next Tab moves on. The proxy has no
  size and no accessible name, so the stop is invisible.
