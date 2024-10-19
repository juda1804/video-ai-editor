import React, { useState } from 'react';
import { Container, Paper, Typography, Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import MultiFileUploadComponent from './carga-ordenes/MultiFileUploadComponent';
import ProductInfoBanner from './product/ProductInfoBanner';
import TikTokLinkUploadComponent from './TikTokLinkUploadComponent';
import { Product } from '../types';
import { getProductById, saveProduct } from '../service/ProductService';
import { useParams } from 'react-router-dom';

export const DefaultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeStep, setActiveStep] = useState(0);
  const [salesAngles, setSalesAngles] = useState<string[]>([]);
  const [product, setProduct] = useState<Product>({
    name: '',
    price: '',
    description: '',
    copys: [],
    landings: [],
    videoUrls: [],
    tikTokLinks: [],
    angles: []
  });

  const steps = ['Información del Producto', 'Subir Videos desde TikTok', 'Editor de videos'];

  const handleNext = () => {
    saveProduct(product)
    .then(() => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }).catch((error) => {
      console.error('Error al guardar el producto:', error);
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const addTikTokLink = (link: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      tikTokLinks: [...prevProduct.tikTokLinks, link]
    }));
  };

  React.useEffect(() => {
    if (id) {
      getProductById(id).then(setProduct);
    }
  }, [id]);

  return (
      <Container 
        sx={{ 
          mt: 4, 
          mb: 4, 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Batch de videos
          </Typography>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <ProductInfoBanner setProduct={setProduct} />
          )}
          {activeStep === 1 && (
            <TikTokLinkUploadComponent addTikTokLink={addTikTokLink} />
          )}
          {activeStep === 2 && (
            <MultiFileUploadComponent salesAngles={salesAngles} />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Container>
  );
};
