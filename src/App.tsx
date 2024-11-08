import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/security/Login';
import {IncioRapido} from './components/InicioRapido';
import ProductSummary from './components/product/ProductSummary'; 
import PromptGeneratorComponent from './components/chatbox-ia-prompt-generator/PromptGeneratorComponent';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import './style.css';
import { Box } from '@mui/material';
import { InicioRapido as InicioRapidoV2 } from './components/V2/InicioRapido';


// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF00FF', // Fuchsia
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
});

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userContext = localStorage.getItem('userContext');
    if (userContext) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('userContext');
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const currentPath = window.location.pathname;
    const redirectPath = currentPath.startsWith('/v2') ? '/v2' : '/';
    
    return isAuthenticated ? <>{children}</> : <Navigate to={`/login?redirect=${redirectPath}`} />;
  };

  return (
    <ThemeProvider theme={darkTheme}> {/* Wrap the app with ThemeProvider */}
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Router>
        {isAuthenticated && <Header onLogout={logout} />}
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? 
              <Navigate to={new URLSearchParams(window.location.search).get('redirect') || '/'} /> 
              : <Login onLogin={login} />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <IncioRapido/>
            </ProtectedRoute>
          } />
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <IncioRapido/>
            </ProtectedRoute>
          } />
          <Route path="/agents/chatbox/prompt-generator" element={
            <ProtectedRoute>
              <PromptGeneratorComponent />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductSummary username={"test"} /> 
            </ProtectedRoute>
          } />
          <Route path="/v2/*" element={
            <ProtectedRoute>
              <InicioRapidoV2 />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </Box>
    </ThemeProvider>
  );
}

export default App;
