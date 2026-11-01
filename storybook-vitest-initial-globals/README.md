# Storybook Vitest addon: the `initialGlobals` one-project-per-theme example

Minimal reproduction for the `initialGlobals` example in the Vitest addon docs (Storybook 10.6.5, the latest release when this was written). The example creates one `storybookTest` project per theme from the same `.storybook` directory. No AI client is needed: `scripts/mcp.mjs` talks to the MCP server over HTTP and prints every request and raw response.

1. As written, the example doesn't start. It sets `provider: 'playwright'`, and Vitest 4 and 5 (the versions `@storybook/addon-vitest` 10.6.5 supports) take a provider factory instead.
2. With the provider fixed, the CLI runs every story in both themes. Storybook can't start Vitest with that config, though: when Storybook runs the tests, the plugin renames both projects to `storybook:<configDir>`, and Vitest rejects the duplicate name.

## Layout

```
.storybook/main.ts           React + Vite, addon-vitest, addon-mcp
.storybook/preview.tsx       initialGlobals { theme: 'light' }, a theme global type and a decorator
src/ThemeProbe.stories.tsx   one story; its play function logs the theme it ran with
docs-verbatim.config.ts      the docs example, unchanged
vitest.config.ts             the same example with `provider: playwright()`
scripts/mcp.mjs              MCP client over HTTP (initialize, then tools/call)
evidence/                    raw output from the run that backs the issue text
```

## Setup

Needs Node 22 or newer and pnpm. Tested on Windows 11 with Node 24.13.0 and pnpm 10.28.0.

```sh
pnpm install
pnpm exec playwright install chromium
```

## 1. The example as written

```sh
pnpm exec vitest run --config docs-verbatim.config.ts
```

Observed: `Browser Mode was enabled, but provider was not specified anywhere`, once per project.

## 2. Provider fixed, from the CLI

```sh
pnpm exec vitest run --reporter=verbose
```

Observed: `Renders` passes in `storybook-light` and in `storybook-dark`, and logs `theme=light` and `theme=dark`. The option works.

## 3. Provider fixed, from Storybook

```sh
pnpm storybook                       # port 6108
node scripts/mcp.mjs test-run '{}'   # in a second terminal
```

Expected: `Renders` runs, in one theme or both.
Observed: `test-run` returns `Error: Failed to start Vitest`, and Storybook's terminal shows `Project name "storybook:<repo>/.storybook" is not unique`. The testing widget in the sidebar starts Vitest through the same `VitestManager.startVitest` (read from the source; storybookjs/storybook#31729 shows it failing the same way). Here the dev server then exits about a second later (pnpm reports exit code 1); it did so on both runs.

## Evidence

`evidence/` holds the raw output from one run on Storybook 10.6.5 (machine paths replaced with `<repo>`) and the `storybook info` output.
