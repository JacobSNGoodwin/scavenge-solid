import { StartClient, mount } from '@solidjs/start/client';

// These imports must be imported in entry-client.tsx and not in src/app.tsx
import '@unocss/reset/tailwind-compat.css';
import 'virtual:uno.css';

mount(() => <StartClient />, document.getElementById('app'));
