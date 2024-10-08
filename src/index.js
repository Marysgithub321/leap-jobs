import React from 'react';
import ReactDOM from 'react-dom/client'; // Importing ReactDOM for React 18
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Import service worker for PWA

// Create the root element and render the app using React 18's createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker to enable PWA features like offline capability
serviceWorkerRegistration.register();
