// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import App from './App';
import './index.css';
import './i18n';
import { NotificationProvider } from './Contexts/notificationContext';

const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.add(currentTheme);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
