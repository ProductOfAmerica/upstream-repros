# cmdk Command.Empty inside Command.List fails axe aria-required-children

Minimal reproduction. With nothing matching the filter, `Command.Empty` renders its text inside the `role="listbox"` element, and axe reports `aria-required-children` on the listbox.

Versions: cmdk 1.1.1, axe-core 4.14.0 (via @axe-core/playwright 4.14.0), React 19.3.1, Vite 8.3.5, Playwright 1.64.1, headless Chromium.

## Run

```bash
pnpm install
pnpm exec playwright install chromium   # once
pnpm dev                                # http://localhost:5184
node check.mjs                          # in a second terminal
```

`check.mjs` opens each variant at `/?v=<name>` and prints the axe `aria-required-children` result plus the list's rendered HTML. The output from my run is in `out.txt`.

## Variants (all with the input value `zzz`, so nothing matches)

| `v=` | Markup | axe |
|---|---|---|
| `base` | `Command.Empty` and one `Command.Item` inside `Command.List` | violation |
| `group` | same, with the item in a `Command.Group` | violation |
| `empty-only` | only `Command.Empty` inside the list | violation |
| `no-empty` | no `Command.Empty` | incomplete ("needs review"), no violation |
| `empty-outside-list` | `Command.Empty` as a sibling after `Command.List` | incomplete, no violation |
| `has-match` | input value `app`, so the item matches | clean |
| `plain-empty-listbox` | `<div role="listbox" />` | incomplete |
| `plain-sizer` | listbox with one empty child `div` | incomplete |
| `plain-sizer-text` | listbox with a `div` containing text | violation |
| `plain-sizer-presentation` | cmdk's exact nesting with plain divs | violation |
| `plain-presentation-direct` | listbox with a `role="presentation"` div containing text | violation |

The plain-HTML controls show cmdk is not special here: any listbox that contains text and no `option` or `group` fails the rule. An empty listbox only gets "needs review".

## Rendered HTML of the failing list

```html
<div cmdk-list="" role="listbox" tabindex="-1" aria-label="Suggestions" id="radix-_r_0_" style="--cmdk-list-height: 18.0px;"><div cmdk-list-sizer=""><div cmdk-empty="" role="presentation">No results.</div></div></div>
```
