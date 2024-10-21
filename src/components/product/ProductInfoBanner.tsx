import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Paper, Container, CircularProgress, List, ListItem } from '@mui/material';
import SalesAngleGenerator from '../../agents/SalesAngleGenerator';
import { Product } from '../../types';

interface ProductInfoBannerProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}

const ProductInfoBanner: React.FC<ProductInfoBannerProps> = ({ product, setProduct }) => {
  const [productName, setProductName] = useState(product.name);
  const [productDescription, setProductDescription] = useState(product.description);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedAngles, setGeneratedAngles] = useState<string[]>(product.angles);

  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      name: productName,
      description: productDescription,
      angles: generatedAngles
    }));
  }, [productName, productDescription, generatedAngles]);

  const handleGenerateAngles = async () => {
    if (!productDescription) {
      setErrorMessage('Por favor, ingresa una descripción del producto.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const angles = await SalesAngleGenerator.generateSalesAngles(productDescription);
      setGeneratedAngles(angles);
    } catch (error) {
      setErrorMessage('Hubo un error al generar los ángulos de venta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4}}>
        <Typography variant="h4" gutterBottom align="center">
          Agregar Información del Producto
        </Typography>

        <TextField
          label="Nombre del Producto"
          variant="outlined"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ marginBottom: 3 }}
        />

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

        {generatedAngles.length > 0 && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ángulos de Venta Generados:
            </Typography>
            <List>
              {generatedAngles.map((angle, index) => (
                <ListItem key={index}>
                  <Typography>{angle}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProductInfoBanner;
