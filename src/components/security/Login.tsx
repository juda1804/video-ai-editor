import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Divider, Card, InputAdornment, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isWhitelisted = (email: string, password: string): boolean => {
    const whitelist = [
      { email: "order-tracker@test.com", password: "123" },
      { email: "admin@example.com", password: "admin123" },
      { email: "user@example.com", password: "user456" },
      // Agrega más usuarios a la lista blanca según sea necesario
    ];

    return whitelist.some(user => user.email === email && user.password === password);
  };

  const validateUser = (email: string, password: string): boolean => {
    return isWhitelisted(email, password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (validateUser(email, password)) {
      const userHash = btoa(email); // Codifica el email en base64
      localStorage.setItem('userContext', userHash);
      onLogin();
    } else {
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  const handleGoogleSignIn = () => {
    // Implementar lógica de inicio de sesión con Google
    console.log('Iniciar sesión con Google');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#f0f2f5'
      }}
    >
      <Card sx={{ 
        maxWidth: 400, 
        width: '100%', 
        padding: 4, 
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Iniciar sesión
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          margin="normal"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
            mt: 2, 
            mb: 3, 
            py: 1.5, 
            textTransform: 'none', 
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: 2,
          }}
        >
          Iniciar sesión
        </Button>
        <Divider sx={{ my: 3 }}>o</Divider>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          sx={{ 
            py: 1.5, 
            textTransform: 'none', 
            fontSize: '1rem',
            borderRadius: 2,
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          Iniciar sesión con Google
        </Button>
      </Card>
    </Box>
  );
};

export default Login;