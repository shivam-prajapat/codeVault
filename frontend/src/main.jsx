import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/authContext.jsx"
import { SocketProvider } from "./context/socketContext.jsx"
import { ToastProvider } from "./context/ToastContext.jsx"
import ProjectRoutes from "./Routes.jsx"
import {BrowserRouter as Router} from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SocketProvider>
      <ToastProvider>
        <Router>
         <ProjectRoutes/>
        </Router>
      </ToastProvider>
    </SocketProvider>
  </AuthProvider>
);
