import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress ResizeObserver loop limit exceeded errors
const isResizeObserverError = (msg: string) => 
  msg === 'ResizeObserver loop completed with undelivered notifications.' || 
  msg === 'ResizeObserver loop limit exceeded';

window.addEventListener('error', (e) => {
  if (isResizeObserverError(e.message)) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Also handle cases where it might be reported as a string via window.onerror
const originalOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (typeof message === 'string' && isResizeObserverError(message)) {
    return true; // Suppress the error
  }
  if (originalOnError) {
    return originalOnError(message, source, lineno, colno, error);
  }
  return false;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
