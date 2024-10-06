import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/security/Login';
import DefaultPage from './components/DefaultPage';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import MUI components
import './style.css';

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
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider theme={darkTheme}> {/* Wrap the app with ThemeProvider */}
      <Router>
        {isAuthenticated && <Header onLogout={logout} />}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={login} />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DefaultPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// Esta es la parte importante: debes asegurarte de exportarlo como default
export default App;