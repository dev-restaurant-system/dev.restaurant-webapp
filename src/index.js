import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // lobal styles
import App from './App.jsx'; // The main App component

// --- Service Worker Registration Logic ---
// This function will register the service worker, which is essential for PWA features.
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(err => {
          console.error('ServiceWorker registration failed: ', err);
        });
    });
  }
};

// --- React App Rendering ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Call the function to register the service worker
registerServiceWorker();
