import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { CookieProvider } from './context/CookieContext.jsx';
import { developmentCacheFix, debugPWAStatus } from './utils/cacheManager.js';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <CookieProvider>
            <App />
          </CookieProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>,
)

// Development cache fix - Development mode'da cache sorunlarını çöz
if (import.meta.env.DEV) {
  developmentCacheFix();
}

// Service Worker Registration - Only in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
  });
}