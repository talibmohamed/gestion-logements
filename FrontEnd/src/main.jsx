import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './session/store';
import App from './App.jsx';
import './index.css';
import {NextUIProvider} from "@nextui-org/react";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <NextUIProvider>
    <main className="dark text-foreground bg-background">
      <App />
    </main>
    </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
