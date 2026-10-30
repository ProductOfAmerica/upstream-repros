import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ThemeProbe } from './ThemeProbe';

const meta = {
  title: 'Probe/ThemeProbe',
  component: ThemeProbe,
  render: (_args, { globals }) => <ThemeProbe theme={globals.theme} />,
} satisfies Meta<typeof ThemeProbe>;
export default meta;

type Story = StoryObj<typeof meta>;

// Passes only if the story renders with theme=dark.
export const ExpectsDark: Story = {
  args: { theme: '' },
  play: async ({ globals }) => {
    await expect(globals.theme).toBe('dark');
  },
};

// Passes under the default globals (theme=light). Control story.
export const ExpectsLight: Story = {
  args: { theme: '' },
  play: async ({ globals }) => {
    await expect(globals.theme).toBe('light');
  },
};
