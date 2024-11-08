import React, { useState } from 'react';
import { Container, Paper, Typography, Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import { ConfigurationStep } from './ConfigurationStep';
import { ProductInformationStep } from './ProductInformationStep';
import { CopyGeneratorStep } from './CopyGeneratorStep';
import { ProductionResourcesStep } from './ProductionResourcesStep';
import { CombinedVideosStep } from './CombinedVideosStep';
import { FormState } from './types';

export const InicioRapido: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    videoDuration: '',
    videoQuantity: '',
    useAIVoice: false,
    voiceOption: '',
    productName: '',
    productDescription: '',
  });

  const handleFormChange = (updates: Partial<FormState>) => {
    setFormState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const steps = [
    'Configuración',
    'Información del producto',
    'Generador de copys',
    'Recursos para producción',
    'Videos combinados'
  ];

  const stepComponents = new Map([
    [0, <ConfigurationStep formState={formState} onFormChange={handleFormChange} />],
    [1, <ProductInformationStep formState={formState} onFormChange={handleFormChange} />],
    [2, <CopyGeneratorStep formState={formState} onFormChange={handleFormChange} />],
    [3, <ProductionResourcesStep formState={formState} onFormChange={handleFormChange} />],
    [4, <CombinedVideosStep formState={formState} onFormChange={handleFormChange} />],
  ]);

  const renderStep = () => {
    return stepComponents.get(activeStep) || null;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container 
      maxWidth={false}
      sx={{ 
        p: 0,
        height: '92.9vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#000000',
        color: 'white'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: 0,
        }}
      >
        <Stepper 
          activeStep={activeStep} 
          orientation={window.innerWidth <= 600 ? 'vertical' : 'horizontal'}
          sx={{ 
            mb: 3,
            width: '100%',
            '& .MuiStepIcon-root': { 
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem',
              },
              color: '#833ab4',
              '&.Mui-active': {
                background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              },
              '&.Mui-completed': {
                background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            },
            '& .MuiStepLabel-label': {
              color: 'white',
              marginTop: { xs: '4px', sm: '6px', md: '8px' },
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
              },
              textAlign: { xs: 'left', sm: 'center' },
              whiteSpace: { xs: 'normal', sm: 'nowrap' }
            },
            '& .MuiStepConnector-line': {
              borderColor: '#833ab4',
              borderWidth: { xs: '1px', sm: '1.5px', md: '2px' },
            },
            '& .MuiStep-root': {
              padding: {
                xs: '8px 0',
                sm: '0 8px',
                md: '0 16px',
              },
            },
            '& .MuiStepLabel-iconContainer': {
              padding: { xs: '0 8px', sm: '0' },
            },
            '& .MuiStep-vertical': {
              marginBottom: '16px',
            },
            '& .MuiStepConnector-vertical': {
              marginLeft: '12px',
              minHeight: '24px',
            },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          {steps.map((label, index) => (
            <Step 
              key={label} 
              onClick={() => setActiveStep(index)}
              sx={{
                flex: { xs: '0 0 auto', sm: 1 },
                '&:hover': {
                  cursor: 'pointer',
                }
              }}
            >
              <StepLabel 
                sx={{
                  '& .MuiStepIcon-text': {
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                      md: '1.2rem',
                    },
                    fill: 'white'
                  },
                  flexDirection: { xs: 'row', sm: 'column' },
                  alignItems: { xs: 'center', sm: 'center' },
                }}
              >
                <Typography 
                  variant="caption"
                  sx={{
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.875rem',
                      md: '1rem',
                    },
                    textAlign: { xs: 'left', sm: 'center' },
                    display: 'block',
                    ml: { xs: 1, sm: 0 },
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          my: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2, md: 3 }
        }}>
          {renderStep()}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          pt: { xs: 1, sm: 2 },
          mt: { xs: 1, sm: 2 },
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              mr: 1,
              color: 'white',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                background: 'linear-gradient(45deg, #fd1d1d 30%, #833ab4 90%)',
              }
            }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            sx={{
              background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
              color: 'white',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                background: 'linear-gradient(45deg, #fd1d1d 30%, #833ab4 90%)',
              }
            }}
          >
            Continuar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}; 