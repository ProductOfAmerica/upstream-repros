import { Command } from 'cmdk';
import { createRoot } from 'react-dom/client';

const variant = new URLSearchParams(location.search).get('v') ?? 'base';

// Every cmdk variant types "zzz" so the filter matches nothing.
const cmdk = {
  base: (
    <Command label="Test">
      <Command.Input value="zzz" onValueChange={() => {}} />
      <Command.List>
        <Command.Empty>No results.</Command.Empty>
        <Command.Item>Apple</Command.Item>
      </Command.List>
    </Command>
  ),
  'no-empty': (
    <Command label="Test">
      <Command.Input value="zzz" onValueChange={() => {}} />
      <Command.List>
        <Command.Item>Apple</Command.Item>
      </Command.List>
    </Command>
  ),
  group: (
    <Command label="Test">
      <Command.Input value="zzz" onValueChange={() => {}} />
      <Command.List>
        <Command.Empty>No results.</Command.Empty>
        <Command.Group heading="Fruit">
          <Command.Item>Apple</Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  ),
  'has-match': (
    <Command label="Test">
      <Command.Input value="app" onValueChange={() => {}} />
      <Command.List>
        <Command.Empty>No results.</Command.Empty>
        <Command.Item>Apple</Command.Item>
      </Command.List>
    </Command>
  ),
  'empty-outside-list': (
    <Command label="Test">
      <Command.Input value="zzz" onValueChange={() => {}} />
      <Command.List>
        <Command.Item>Apple</Command.Item>
      </Command.List>
      <Command.Empty>No results.</Command.Empty>
    </Command>
  ),
  'empty-only': (
    <Command label="Test">
      <Command.Input value="zzz" onValueChange={() => {}} />
      <Command.List>
        <Command.Empty>No results.</Command.Empty>
      </Command.List>
    </Command>
  ),
};

// Plain-HTML controls that copy cmdk's markup, to separate each node's contribution.
const plain = {
  'plain-empty-listbox': <div role="listbox" aria-label="x" />,
  'plain-sizer': (
    <div role="listbox" aria-label="x">
      <div />
    </div>
  ),
  'plain-sizer-text': (
    <div role="listbox" aria-label="x">
      <div>No results.</div>
    </div>
  ),
  'plain-sizer-presentation': (
    <div role="listbox" aria-label="x">
      <div>
        <div role="presentation">No results.</div>
      </div>
    </div>
  ),
  'plain-presentation-direct': (
    <div role="listbox" aria-label="x">
      <div role="presentation">No results.</div>
    </div>
  ),
};

createRoot(document.getElementById('root')).render(cmdk[variant] ?? plain[variant]);

