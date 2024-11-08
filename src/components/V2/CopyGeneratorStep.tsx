import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Grid,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormState } from './types';
import { useValidation } from '../../hooks/useValidation';
import { minLength } from '../../utils/validators';
interface CopyGeneratorStepProps {
  formState: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
}

export const CopyGeneratorStep = forwardRef<
  { validateStep: () => boolean },
  CopyGeneratorStepProps
>(({ formState, onFormChange }, ref) => {
  const [newCopy, setNewCopy] = useState('');
  const [editingCopy, setEditingCopy] = useState<{ id: number; text: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const validationRules = {
    copies: [
      {
        validate: (value: any[]) => (value || []).length > 0,
        message: 'Debe crear al menos un copy'
      }
    ],
    newCopy: [
      minLength(10)
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
        copies: formState.copies,
        newCopy
      });
    }
  }));

  const handleAddCopy = () => {
    validate('newCopy', newCopy);
    if (isFieldValid('newCopy') && newCopy.trim()) {
      const updatedCopies = [
        ...(formState.copies || []),
        { id: Date.now(), text: newCopy.trim() }
      ];
      onFormChange({ copies: updatedCopies });
      setNewCopy('');
      validate('copies', updatedCopies);
    }
  };

  const handleEditCopy = (copy: { id: number; text: string }) => {
    setEditingCopy(copy);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingCopy) {
      const updatedCopies = (formState.copies || []).map(copy =>
        copy.id === editingCopy.id ? editingCopy : copy
      );
      onFormChange({ copies: updatedCopies });
      setIsDialogOpen(false);
      setEditingCopy(null);
    }
  };

  const handleDeleteCopy = (id: number) => {
    const updatedCopies = (formState.copies || []).filter(copy => copy.id !== id);
    onFormChange({ copies: updatedCopies });
  };

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Columna izquierda: Crear nuevo copy */}
      <Grid item xs={12} md={6}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 2,
            fontWeight: 500 
          }}
        >
          Crear Nuevo Copy
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={newCopy}
          onChange={(e) => {
            setNewCopy(e.target.value);
            validate('newCopy', e.target.value);
          }}
          onBlur={() => touch('newCopy')}
          placeholder="Escribe tu nuevo copy aquí..."
          sx={{
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
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1,
            },
          }}
          error={!!getFieldError('newCopy')}
          helperText={getFieldError('newCopy')}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddCopy}
          sx={{
            background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #fd1d1d 30%, #833ab4 90%)',
            }
          }}
          disabled={!isFieldValid('newCopy')}
        >
          Agregar Copy
        </Button>
      </Grid>

      {/* Columna derecha: Lista de copies */}
      <Grid item xs={12} md={6}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 2,
            fontWeight: 500 
          }}
        >
          Lista de Copies
          {!!getFieldError('copies') && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#fd1d1d',
                ml: 1
              }}
            >
              ({getFieldError('copies')})
            </Typography>
          )}
        </Typography>
        <Paper 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            maxHeight: '60vh',
            overflow: 'auto'
          }}
        >
          <List>
            {(formState.copies || []).map((copy) => (
              <ListItem 
                key={copy.id}
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemText 
                  primary={copy.text}
                  sx={{ 
                    color: 'white',
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem'
                    }
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleEditCopy(copy)}
                    sx={{ color: '#833ab4', mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteCopy(copy.id)}
                    sx={{ color: '#fd1d1d' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Diálogo para editar copy */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
          }
        }}
      >
        <DialogTitle>Editar Copy</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editingCopy?.text || ''}
            onChange={(e) => setEditingCopy(prev => prev ? { ...prev, text: e.target.value } : null)}
            sx={{
              mt: 2,
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
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsDialogOpen(false)}
            sx={{ color: 'white' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveEdit}
            sx={{
              background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #fd1d1d 30%, #833ab4 90%)',
              }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}); 