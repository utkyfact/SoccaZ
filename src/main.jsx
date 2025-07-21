import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { CookieProvider } from './context/CookieContext.jsx';

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