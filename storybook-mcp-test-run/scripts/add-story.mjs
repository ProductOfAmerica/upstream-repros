// Creates a new story file while Storybook is running.
//   node scripts/add-story.mjs outside   -> packages/ui/Badge.stories.tsx (outside the Storybook/Vitest project root apps/web)
//   node scripts/add-story.mjs inside    -> apps/web/src/Added.stories.tsx (inside the project root)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const where = process.argv[2];
const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));

if (where === 'outside') {
  writeFileSync(root('packages/ui/Badge.stories.tsx'), `import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = { title: 'Probe/Badge', component: Badge, args: { label: 'new' } } satisfies Meta<typeof Badge>;
export default meta;
export const Renders: StoryObj<typeof meta> = {};
`);
  console.log('created packages/ui/Badge.stories.tsx -> story id probe-badge--renders');
} else if (where === 'inside') {
  writeFileSync(root('apps/web/src/Added.stories.tsx'), `import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../../packages/ui/Badge';

const meta = { title: 'Probe/Added', component: Badge, args: { label: 'new' } } satisfies Meta<typeof Badge>;
export default meta;
export const Renders: StoryObj<typeof meta> = {};
`);
  console.log('created apps/web/src/Added.stories.tsx -> story id probe-added--renders');
} else {
  console.error('usage: node scripts/add-story.mjs outside|inside');
  process.exit(1);
}
