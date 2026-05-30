import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'krds-uiux/resources/css/token/krds_tokens.css';
import './styles.css';
import './styles/uiux-parser-completion.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
