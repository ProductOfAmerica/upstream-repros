# Storybook MCP `test-run` reproductions

Minimal reproductions for two problems with the `test-run` tool of `@storybook/addon-mcp` (Storybook 10.6.5, the latest release when this was written). No AI client is needed: `scripts/mcp.mjs` talks to the MCP server over HTTP and prints every request and raw response.

1. `test-run` accepts a per-story `globals` input and ignores it.
2. `test-run` silently leaves out stories from a story file that was created after Storybook started, when that file lives outside the Storybook project root (the usual monorepo layout).

## Layout

```
apps/web/                  Storybook project (React + Vite, addon-vitest, addon-mcp). Vite and Vitest root.
  .storybook/main.ts       stories: apps/web/src and packages/ui
  .storybook/preview.tsx   initialGlobals { theme: 'light' }, a theme global type and a decorator
  src/ThemeProbe.stories.tsx
packages/ui/Badge.tsx      component for the story files the scripts create
scripts/mcp.mjs            MCP client over HTTP (initialize, then tools/call)
scripts/add-story.mjs      creates a story file while Storybook runs
scripts/reset.mjs          removes the story files add-story.mjs created
evidence/                  raw output from the run that backs the issue text
```

## Setup

Needs Node 22 or newer and pnpm. Tested on Windows 11 with Node 24.13.0 and pnpm 10/11.

```sh
pnpm install
pnpm --filter web exec playwright install chromium
```

## Start Storybook (port 6107)

```sh
pnpm storybook
```

Leave it running and use a second terminal for the rest. The MCP endpoint is `http://localhost:6107/mcp`; set `MCP_URL` to change it.

## 1. `globals` are ignored

`ThemeProbe.stories.tsx` has two stories. `ExpectsLight` asserts `globals.theme === 'light'` and `ExpectsDark` asserts `globals.theme === 'dark'`. The preview sets `initialGlobals: { theme: 'light' }`.

Baseline, no globals:

```sh
node scripts/mcp.mjs test-run '{"stories":[{"storyId":"probe-themeprobe--expects-dark"},{"storyId":"probe-themeprobe--expects-light"}]}'
```

Same call with the documented per-story `globals`:

```sh
node scripts/mcp.mjs test-run '{"stories":[{"storyId":"probe-themeprobe--expects-dark","globals":{"theme":"dark"}},{"storyId":"probe-themeprobe--expects-light"}]}'
```

Expected: `probe-themeprobe--expects-dark` passes in the second call.
Observed: both calls fail it with `expected 'light' to be 'dark'`. The input is accepted and has no effect.

## 2. A story file added after startup is left out

With Storybook running (and the test runner already started by step 1, though a fresh start behaves the same):

```sh
# a new file inside the project root: runs normally
node scripts/add-story.mjs inside
node scripts/mcp.mjs test-run '{"stories":[{"storyId":"probe-themeprobe--expects-light"},{"storyId":"probe-added--renders"}]}'

# a new file outside the project root (packages/ui): left out
node scripts/add-story.mjs outside
curl -s http://localhost:6107/index.json        # lists probe-badge--renders
node scripts/mcp.mjs test-run '{"stories":[{"storyId":"probe-themeprobe--expects-light"},{"storyId":"probe-badge--renders"}]}'
node scripts/mcp.mjs test-run '{"stories":[{"storyId":"probe-badge--renders"}]}'
```

Expected: `probe-badge--renders` appears under "Passing Stories", like `probe-added--renders` does.
Observed: it appears nowhere (no pass, no fail, no "not found"), and the last call returns an empty string. Stop Storybook, start it again, and the same call passes.

Clean up with `node scripts/reset.mjs`.

## Evidence

`evidence/` holds the raw `scripts/mcp.mjs` output from one run on Storybook 10.6.5 (machine paths replaced with `<repo>`) and the `storybook info` output.
