// Verbatim: the initialGlobals example from docs/writing-tests/integrations/vitest-addon/index.mdx
// (storybookjs/storybook, next branch, 2026-11-01). Vitest 4 and 5 reject `provider: 'playwright'`.

import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import viteConfig from './vite.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const storybookProject = (theme: string) => ({
  extends: true,
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
      // Pin the `theme` global for every story in this project
      initialGlobals: { theme },
    }),
  ],
  test: {
    name: `storybook-${theme}`,
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // One project per theme, so every story is tested in both
      projects: [storybookProject('light'), storybookProject('dark')],
    },
  }),
);
