// Removes the story files created by add-story.mjs.
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
for (const p of ['packages/ui/Badge.stories.tsx', 'apps/web/src/Added.stories.tsx']) {
  rmSync(fileURLToPath(new URL(`../${p}`, import.meta.url)), { force: true });
}
