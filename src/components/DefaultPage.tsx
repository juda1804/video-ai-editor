import React, { useState } from 'react';
import { Container, Paper, Typography, Stepper, Step, StepLabel, Button, Box, createTheme, ThemeProvider } from '@mui/material';
import MultiFileUploadComponent from './carga-ordenes/MultiFileUploadComponent';
import ProductInfoBanner from './carga-ordenes/ProductInfoBanner';
import TikTokLinkUploadComponent from './TikTokLinkUploadComponent';

const DefaultPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [salesAngles, setSalesAngles] = useState<string[]>([]); // Add state for sales angles
  const [tikTokLinks, setTikTokLinks] = useState<string[]>([]); // Add state for TikTok links

  const steps = ['Información del Producto', 'Subir Videos desde TikTok', 'Editor de videos'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const addTikTokLink = (link: string) => {
    setTikTokLinks((prevLinks) => [...prevLinks, link]);
  };

  return (
    
      <Container 
        maxWidth="md" 
        sx={{ 
          mt: 4, 
          mb: 4, 
          height: '100vh', // Set the height to 100% of the viewport height
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
            <ProductInfoBanner setSalesAngles={setSalesAngles} /> // Pass setSalesAngles as prop
          )}
          {activeStep === 1 && (
            <TikTokLinkUploadComponent addTikTokLink={addTikTokLink} />
          )}
          {activeStep === 2 && (
            <MultiFileUploadComponent salesAngles={salesAngles} /> // Pass salesAngles as prop
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

export default DefaultPage;