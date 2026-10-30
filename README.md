# upstream-repros

Minimal reproductions for bugs I reported upstream. Each folder has its own README with run steps.

- `storybook-mcp-test-run`: the Storybook MCP `test-run` tool ignores per-story `globals`, and skips stories from story files added outside the project root after Storybook started.
- `cmdk-empty`: cmdk renders `Command.Empty` inside the listbox, which fails axe `aria-required-children` when nothing matches.
- `react-day-picker`: the default day button labels use ordinals ("22nd") and fail axe `label-content-name-mismatch`.
- `radix-navigation-menu`: the NavigationMenu focus proxy is focusable while `aria-hidden` (radix-ui/primitives#3085).
