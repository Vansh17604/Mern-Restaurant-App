import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { Provider } from "react-redux";
import {store} from './app/store';
import './i18n';

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
  <StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </StrictMode>
</Provider>
)
