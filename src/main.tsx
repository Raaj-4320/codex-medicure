import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logEvent } from './utils/logger';

console.log('[APP][START] Bootstrapping React application');
logEvent('SYSTEM.FLOW', {
  panel: 'APP',
  page: 'BOOTSTRAP',
  requiredData: ['firebase', 'auth', 'router'],
  apiCalls: [],
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  const clickable = target?.closest('button,a,[role=\"button\"]') as HTMLElement | null;
  if (!clickable) return;

  logEvent('UI.BUTTON_CLICK', {
    tag: clickable.tagName,
    text: clickable.textContent?.trim()?.slice(0, 80) || '',
    id: clickable.id || null,
    className: clickable.className || null,
    path: window.location.pathname,
  });
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
