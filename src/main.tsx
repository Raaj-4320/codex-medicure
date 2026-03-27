import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logUI } from './utils/uiLogger.ts';

const debugSignals = {
  apiCalls: 0,
  domMutations: 0,
};

const originalFetch = window.fetch.bind(window);
window.fetch = async (...args) => {
  debugSignals.apiCalls += 1;
  return originalFetch(...args);
};

const originalXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (...args) {
  debugSignals.apiCalls += 1;
  return originalXhrOpen.apply(this, args as [method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null]);
};

const mutationObserver = new MutationObserver(() => {
  debugSignals.domMutations += 1;
});
mutationObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

document.addEventListener(
  'click',
  (event) => {
    const target = event.target as HTMLElement | null;
    const clickable = target?.closest('button, a, [role="button"]') as HTMLElement | null;
    if (!clickable) return;
    const text = (clickable.innerText || clickable.getAttribute('aria-label') || clickable.id || 'unknown-action').trim();
    logUI('ACTION', {
      component: 'GlobalTracker',
      action: text || 'unknown-action',
      expected: 'click should trigger handler',
      status: 'working',
    });
    const baselineApi = debugSignals.apiCalls;
    const baselineDom = debugSignals.domMutations;
    window.setTimeout(() => {
      const apiChanged = debugSignals.apiCalls > baselineApi;
      const domChanged = debugSignals.domMutations > baselineDom;
      if (!apiChanged && !domChanged) {
        logUI('ACTION', {
          component: 'GlobalTracker',
          action: text || 'unknown-action',
          expected: 'click should produce side effect',
          status: 'not_working',
          reason: 'No side effect detected',
          diagnostics: {
            handlerExecuted: false,
            apiCalled: false,
            stateChanged: false,
            uiUpdated: false,
          },
        });
      }
    }, 500);
  },
  { capture: true },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
