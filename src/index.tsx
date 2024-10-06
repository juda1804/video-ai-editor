import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Asegúrate de que App.tsx esté exportado como default
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement  // Asegúrate de que el ID 'root' exista en index.html
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si no necesitas medir el rendimiento, puedes omitir esto
reportWebVitals();
