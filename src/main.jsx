import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Apply dark mode by default
if (!localStorage.theme) {
  document.documentElement.classList.add('dark');
  localStorage.theme = 'dark';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);