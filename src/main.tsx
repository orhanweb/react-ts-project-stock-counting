// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Provider'ı import edin
import { store } from './Redux/store'; // store'u doğru yoldan import edin
import App from './App';
import './index.css';

const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.add(currentTheme);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
