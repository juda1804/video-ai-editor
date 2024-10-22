import React, { useState } from 'react';
import { Container, Paper, Typography, Stepper, Step, StepLabel, Button, Box, Alert } from '@mui/material';
import MultiFileUploadComponent from './carga-ordenes/MultiFileUploadComponent';
import ProductInfoBanner from './product/ProductInfoBanner';
import { Product } from '../types';
import { getProductById, saveDraftProduct, saveProduct, uploadVomitoDeMercado, VomitoDeMercadoResponse } from '../service/ProductService';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError } from '../store/slices/AlertSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust the import according to your store setup
import AditionalResources from './AditionalResources';
import VomitoDeMercado from './product/VomitoDeMercado';
import VideoAnalysis from './product/VideoAnalysis';
import VideoProduction from './product/VideoProduction';

export const IncioRapido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeStep, setActiveStep] = useState(0);
  const [vomitoMercado, setVomitoMercado] = useState<string>("");
  const [product, setProduct] = useState<Product>({
    _id: '',
    name: '',
    price: '',
    description: '',
    landings: [],
    videoUrls: [],
    tikTokLinks: [],
    angles: [], 
    vomitoDeMercadoUrl: '',
    username: ''
  });
  
  const dispatch = useDispatch();

  const error = useSelector((state: RootState) => state.alert.message); 
  const steps = [
    'Vomito de mercado',
    'Informacion adicional del producto', 
    'Recursos para la produccion de videos', 
    'Analisis de videos', 
    'Produccion de videos', 
    'Editor de videos'
  ];

  const validateGeneralStep = (): boolean => {
    return true;
  }

  const validateVomitoDeMercadoStep = (): boolean => {
    return true;
  }
  
  const validationsSteps = new Map([
    [0, validateVomitoDeMercadoStep],
    [1, validateGeneralStep]
  ]);

  const applyVomitoDeMercado = async (): Promise<void> => {
    try{
      const result = await uploadVomitoDeMercado(vomitoMercado);
      const newProduct = {
        ...product,
        username: 'test',
        vomitoDeMercadoUrl: result.bucketUri,
        step: 0
      };

      const productSaved = await saveDraftProduct(newProduct);
      setProduct(productSaved);
      return Promise.resolve();
    } catch(error) {
      dispatch(setError(`Error uploading vomito de mercado: ${error}`));
      return Promise.reject(error);
    }
  }

  const applyGeneralStep = async (): Promise<void> => {
    try{
      const productWithStep = {
        ...product,
      step: 1
    }
      await saveProduct(productWithStep);
      return Promise.resolve();
    } catch(error) {
      dispatch(setError(`Error saving product: ${error}`));
      return Promise.reject(error);
    }
  }

  const applyStep = (activeStep: number): Promise<void> => {
    switch (activeStep) {
      case 0:
        console.log('step 0');
        return applyVomitoDeMercado();
      case 1:
        console.log('step 1');
        return applyGeneralStep();
      case 2:
        console.log('step 2');
        return Promise.resolve();
      case 3:
        console.log('step 3');
        return Promise.resolve();
      case 4:
        console.log('step 4');
        return Promise.resolve();
      case 5:
        console.log('step 5');
        return Promise.resolve();
      case 6:
        console.log('step 6');
        return Promise.resolve();
      default:
        return Promise.resolve();
    }
  }

  const handleNext = () => {
    const isValid = validationsSteps.get(activeStep)?.() || false;

    if (isValid) {
      applyStep(activeStep)
      .then(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })
      .catch((error) => {
        console.error(`Error processing step ${steps[activeStep]}`, error);
        dispatch(setError(`Error processing step ${steps[activeStep]}`));
      });
    }else{
      dispatch(setError(`Ooops, there are some errors. Please check and correct them below `));
    }
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
          height: '90vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Creacion de Batch de videos
          </Typography>
          <Stepper activeStep={activeStep} sx={{ mb: 3, '& .MuiStepIcon-root': { fontSize: '3rem' } }}>
            {steps.map((label, index) => (
              <Step key={label} onClick={() => setActiveStep(index)}>
                <StepLabel 
                  sx={{   
                    '&:hover': {
                      cursor: 'pointer'
                    },
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& .MuiStepLabel-label': { 
                      mt: 1,
                      textAlign: 'center',
                    }
                  }}
                  StepIconProps={{
                    sx: { mb: 1 }
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: '1rem', textAlign: 'center', width: '100%' }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <VomitoDeMercado vomitoMercado={vomitoMercado} setVomitoMercado={setVomitoMercado} />
          )}
          {activeStep === 1 && (
             <ProductInfoBanner product={product} setProduct={setProduct} />
          )}
          {activeStep === 2 && (
            <>
              <AditionalResources addTikTokLink={addTikTokLink} />
              <MultiFileUploadComponent salesAngles={product.angles} />
            </>
          )}
          {activeStep === 3 && (
            <VideoAnalysis/>
          )}
          {activeStep === 4 && (
            <VideoProduction />
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
