import { NavigationMenu } from 'radix-ui';
import { createRoot } from 'react-dom/client';

// ?content=text renders an item whose content has nothing tabbable.
const textOnly = new URLSearchParams(location.search).get('content') === 'text';

function App() {
  return (
    <main>
      <button id="before">Before</button>
      <NavigationMenu.Root aria-label="Main">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger id="trigger">Getting started</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              {textOnly ? (
                <p id="text">No links in this panel.</p>
              ) : (
                <>
                  <NavigationMenu.Link id="link-a" href="#a">Introduction</NavigationMenu.Link>
                  <NavigationMenu.Link id="link-b" href="#b">Installation</NavigationMenu.Link>
                </>
              )}
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <button id="after">After</button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
