import React, { forwardRef, useImperativeHandle } from 'react';
import { 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Box,
  Button,
  SelectChangeEvent 
} from '@mui/material';
import { FormState } from './types';
import { 
  required, 
  isNumeric, 
  isPositive, 
  maxValue, 
  isInteger, 
  minValue 
} from '../../utils/validators';
import { useValidation } from '../../hooks/useValidation';

interface ConfigurationStepProps {
  formState: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
}

export const ConfigurationStep = forwardRef<
  { validateStep: () => boolean },
  ConfigurationStepProps
>(({ formState, onFormChange }, ref) => {
  const validationRules = {
    videoDuration: [
      required(),
      isNumeric(),
      isPositive(),
      maxValue(300)
    ],
    videoQuantity: [
      required(),
      isNumeric(),
      isInteger(),
      minValue(1),
      maxValue(10)
    ]
  };

  const {
    validateAll,
    touchAll,
    getFieldError,
    isFieldValid,
    resetValidation
  } = useValidation(validationRules);

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      touchAll();
      return validateAll(formState);
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
          Duración del video
        </Typography>
        <FormControl fullWidth variant="outlined" sx={{ 
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
            '&.Mui-focused': {
              color: '#833ab4',
            },
          },
          '& .MuiSelect-icon': {
            color: 'white',
          },
        }}>
          <InputLabel>Selecciona la duración</InputLabel>
          <Select
            value={formState.videoDuration}
            label="Selecciona la duración"
            onChange={(e: SelectChangeEvent) => 
              onFormChange({ videoDuration: e.target.value })}
          >
            <MenuItem value={15}>15 segundos</MenuItem>
            <MenuItem value={30}>30 segundos</MenuItem>
            <MenuItem value={45}>45 segundos</MenuItem>
            <MenuItem value={60}>60 segundos</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          sx={{ color: 'white', mb: 1, fontWeight: 500 }}
        >
          Cantidad de videos
        </Typography>
        <FormControl fullWidth variant="outlined" sx={{ 
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
            '&.Mui-focused': {
              color: '#833ab4',
            },
          },
          '& .MuiSelect-icon': {
            color: 'white',
          },
        }}>
          <InputLabel>Selecciona la cantidad</InputLabel>
          <Select
            value={formState.videoQuantity}
            label="Selecciona la cantidad"
            onChange={(e: SelectChangeEvent) => 
              onFormChange({ videoQuantity: e.target.value })}
          >
            <MenuItem value={1}>1 video</MenuItem>
            <MenuItem value={2}>2 videos</MenuItem>
            <MenuItem value={3}>3 videos</MenuItem>
            <MenuItem value={4}>4 videos</MenuItem>
            <MenuItem value={5}>5 videos</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          sx={{ color: 'white', mb: 1, fontWeight: 500 }}
        >
          Voz (IA)
        </Typography>
        <FormControlLabel
          control={
            <Checkbox 
              checked={formState.useAIVoice}
              onChange={(e) => onFormChange({ useAIVoice: e.target.checked })}
              sx={{
                color: 'white',
                '&.Mui-checked': {
                  color: '#833ab4',
                },
              }}
            />
          }
          label="Usar voz de IA"
          sx={{
            color: 'white',
            '& .MuiFormControlLabel-label': {
              color: 'white',
            },
          }}
        />
        
        {formState.useAIVoice && (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth variant="outlined" sx={{ 
              mb: 2,
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
                '&.Mui-focused': {
                  color: '#833ab4',
                },
              },
              '& .MuiSelect-icon': {
                color: 'white',
              },
            }}>
              <InputLabel>Opciones de voz</InputLabel>
              <Select
                value={formState.voiceOption}
                label="Opciones de voz"
                onChange={(e: SelectChangeEvent) => 
                  onFormChange({ voiceOption: e.target.value })}
              >
                <MenuItem value="male_1">Voz masculina 1</MenuItem>
                <MenuItem value="male_2">Voz masculina 2</MenuItem>
                <MenuItem value="female_1">Voz femenina 1</MenuItem>
                <MenuItem value="female_2">Voz femenina 2</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #fd1d1d 30%, #833ab4 90%)',
                }
              }}
            >
              Crea tu voz
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}); 