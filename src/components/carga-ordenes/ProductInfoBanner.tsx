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
  const salesAngles: string[] = [];
  const handleGenerateAngles = async () => {
    if (!productDescription) {
      setErrorMessage('Por favor, ingresa una descripción del producto.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    try {
      const angles = await ChatGPT.generateSalesAngles(productDescription);
      setSalesAngles(angles); // Update sales angles in DefaultPage
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

        {salesAngles.length > 0 && (
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6">Ángulos de Venta Generados:</Typography>
            {salesAngles.map((angle, index) => (
              <Typography key={index} sx={{ marginTop: 1 }}>
                {index + 1}. {angle}
              </Typography>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProductInfoBanner;