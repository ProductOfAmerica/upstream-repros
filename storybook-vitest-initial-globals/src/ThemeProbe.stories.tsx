import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ThemeProbe } from './ThemeProbe';

const meta = {
  title: 'Probe/ThemeProbe',
  component: ThemeProbe,
  args: { theme: '' },
  render: (_args, { globals }) => <ThemeProbe theme={globals.theme} />,
} satisfies Meta<typeof ThemeProbe>;
export default meta;

type Story = StoryObj<typeof meta>;

// Logs the theme it ran with, so the CLI output shows the value each project pins.
export const Renders: Story = {
  play: async ({ canvas, globals }) => {
    console.log(`ThemeProbe ran with theme=${globals.theme}`);
    await expect(canvas.getByText(`Active theme: ${globals.theme}`)).toBeVisible();
  },
};
