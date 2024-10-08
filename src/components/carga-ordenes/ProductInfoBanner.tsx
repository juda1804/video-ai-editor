import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Paper, Container, CircularProgress } from '@mui/material';
import ChatGPT from '../../service/ChatGPTIntegration';

interface ProductInfoBannerProps {
  setSalesAngles: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProductInfoBanner: React.FC<ProductInfoBannerProps> = ({ setSalesAngles }) => {
  const [productDescription, setProductDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Variables para controlar las solicitudes
  let lastRequestTime = 0;
  const REQUEST_LIMIT_INTERVAL = 60000; // Limitar a 60 segundos

  const handleGenerateAngles = async () => {
    if (!productDescription) {
      setErrorMessage('Por favor, ingresa una descripción del producto.');
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastRequestTime < REQUEST_LIMIT_INTERVAL) {
      setErrorMessage('Por favor, espera antes de hacer otra solicitud.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      lastRequestTime = currentTime; // Actualizar el tiempo de la última solicitud
      const angles = await ChatGPT.generateSalesAngles(productDescription);
      setSalesAngles(angles); // Pasar los ángulos de venta generados al componente padre
    } catch (error) {
      setErrorMessage('Hubo un error al generar los ángulos de venta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Agregar Información del Producto
        </Typography>

        <TextField
          label="Descripción del Producto"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          sx={{ marginBottom: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGenerateAngles}
          disabled={isLoading}
          sx={{ marginBottom: 3 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generar Ángulos de Venta'}
        </Button>

        {errorMessage && (
          <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ProductInfoBanner;