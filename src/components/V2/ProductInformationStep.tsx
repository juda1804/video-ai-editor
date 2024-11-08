import React, { forwardRef, useImperativeHandle } from 'react';
import { 
  Grid, 
  Typography, 
  TextField,
  Box 
} from '@mui/material';
import { FormState } from './types';
import { required, minLength, maxLength } from '../../utils/validators';
import { useValidation } from '../../hooks/useValidation';

interface ProductInformationStepProps {
  formState: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
}

export const ProductInformationStep = forwardRef<
  { validateStep: () => boolean },
  ProductInformationStepProps
>(({ formState, onFormChange }, ref) => {
  const validationRules = {
    productName: [
      required(),
      minLength(3),
      maxLength(100)
    ],
    productDescription: [
      required(),
      minLength(10),
      maxLength(500)
    ]
  };

  const {
    validateAll,
    touchAll,
    getFieldError,
    isFieldValid,
    validate,
    touch
  } = useValidation(validationRules);

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      touchAll();
      return validateAll({
        productName: formState.productName,
        productDescription: formState.productDescription
      });
    }
  }));

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 1,
            fontWeight: 500 
          }}
        >
          Nombre del producto
        </Typography>
        <TextField
          fullWidth
          placeholder="Ingresa el nombre del producto"
          value={formState.productName}
          onChange={(e) => {
            onFormChange({ productName: e.target.value });
            validate('productName', e.target.value);
          }}
          onBlur={() => touch('productName')}
          error={!!getFieldError('productName')}
          helperText={getFieldError('productName')}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#833ab4',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1,
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 1,
            fontWeight: 500 
          }}
        >
          Información del producto
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Describe tu producto..."
          value={formState.productDescription}
          onChange={(e) => {
            onFormChange({ productDescription: e.target.value });
            validate('productDescription', e.target.value);
          }}
          onBlur={() => touch('productDescription')}
          error={!!getFieldError('productDescription')}
          helperText={getFieldError('productDescription')}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#833ab4',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1,
            },
          }}
        />
      </Grid>
    </Grid>
  );
}); 