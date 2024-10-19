import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Asegúrate de que App.tsx esté exportado como default
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/index';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement  // Asegúrate de que el ID 'root' exista en index.html
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
