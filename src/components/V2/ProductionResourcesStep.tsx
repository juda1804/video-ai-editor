import React, { useState, useRef, forwardRef } from 'react';
import {
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { FormState } from './types';
import { useValidation } from '../../hooks/useValidation';
import { 
  required, 
  isUrl, 
  isSocialMediaUrl 
} from '../../utils/validators';

interface ProductionResourcesStepProps {
  formState: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
}

export const ProductionResourcesStep = forwardRef<
  { validateStep: () => boolean },
  ProductionResourcesStepProps
>(({ formState, onFormChange }, ref) => {
  const [newSocialLink, setNewSocialLink] = useState('');
  const [editingLink, setEditingLink] = useState<{ id: number; url: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validationRules = {
    socialLink: [
      {
        validate: (value: string) => {
          if (!value) return true;
          try {
            new URL(value);
            const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/@[\w.-]+\/?/;
            const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[\w.-]+\/?/;
            return tiktokRegex.test(value) || instagramRegex.test(value);
          } catch {
            return false;
          }
        },
        message: 'Solo se permiten links válidos de TikTok o Instagram'
      }
    ]
  };

  const {
    validate,
    touch,
    getFieldError,
    isFieldValid,
    resetValidation
  } = useValidation(validationRules);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 10) {
      alert('Solo puedes subir un máximo de 10 videos');
      return;
    }
    onFormChange({ 
      videos: [...(formState.videos || []), ...files].slice(0, 10)
    });
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = (formState.videos || []).filter((_, i) => i !== index);
    onFormChange({ videos: updatedVideos });
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.trim() && isFieldValid('socialLink')) {
      const updatedLinks = [
        ...(formState.socialLinks || []),
        { id: Date.now(), url: newSocialLink.trim() }
      ];
      onFormChange({ socialLinks: updatedLinks });
      setNewSocialLink('');
      resetValidation();
    }
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSocialLink(value);
    validate('socialLink', value);
  };

  const handleEditLink = (link: { id: number; url: string }) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingLink && validate('socialLink', editingLink.url)) {
      const updatedLinks = (formState.socialLinks || []).map(link =>
        link.id === editingLink.id ? editingLink : link
      );
      onFormChange({ socialLinks: updatedLinks });
      setIsDialogOpen(false);
      setEditingLink(null);
    }
  };

  const handleDeleteLink = (id: number) => {
    const updatedLinks = (formState.socialLinks || []).filter(link => link.id !== id);
    onFormChange({ socialLinks: updatedLinks });
  };

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Columna izquierda: Subida de videos */}
      <Grid item xs={12} md={6}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 2,
            fontWeight: 500 
          }}
        >
          Videos para producción
        </Typography>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="video/*"
          multiple
          style={{ display: 'none' }}
        />
        <Button
          fullWidth
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
          startIcon={<CloudUploadIcon />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            mb: 2,
            '&:hover': {
              borderColor: '#833ab4',
              background: 'rgba(131, 58, 180, 0.1)',
            }
          }}
        >
          Subir Videos (Máx. 10)
        </Button>

        <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', p: 2 }}>
          <List>
            {(formState.videos || []).map((video, index) => (
              <ListItem 
                key={index}
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemText 
                  primary={video.name}
                  sx={{ color: 'white' }}
                />
                <IconButton 
                  edge="end" 
                  onClick={() => handleRemoveVideo(index)}
                  sx={{ color: '#fd1d1d' }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Columna derecha: Links de redes sociales */}
      <Grid item xs={12} md={6}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 2,
            fontWeight: 500 
          }}
        >
          Links de Redes Sociales
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            value={newSocialLink}
            onChange={handleSocialLinkChange}
            onBlur={() => touch('socialLink')}
            placeholder="Ingresa el link de TikTok o Instagram (opcional)"
            error={!!getFieldError('socialLink')}
            helperText={getFieldError('socialLink')}
            sx={{
              mb: 1,
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
                '&.Mui-error fieldset': {
                  borderColor: '#fd1d1d',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
              '& .MuiFormHelperText-root': {
                color: '#fd1d1d',
              },
            }}
            InputProps={{
              endAdornment: (
                <Box 
                  component="span" 
                  sx={{ 
                    display: 'flex', 
                    gap: 1,
                    opacity: 0.7,
                    '& svg': {
                      fontSize: '1.2rem'
                    }
                  }}
                >
                  <img 
                    src="/tiktok-icon.png" 
                    alt="TikTok" 
                    style={{ width: '20px', height: '20px' }}
                  />
                  <img 
                    src="/instagram-icon.png" 
                    alt="Instagram" 
                    style={{ width: '20px', height: '20px' }}
                  />
                </Box>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddSocialLink}
            startIcon={<AddIcon />}
            disabled={!isFieldValid('socialLink')}
            sx={{
              background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #fd1d1d 30%, #833ab4 90%)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Agregar Link
          </Button>
        </Box>

        <Paper 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            maxHeight: '50vh',
            overflow: 'auto'
          }}
        >
          <List>
            {(formState.socialLinks || []).map((link) => (
              <ListItem 
                key={link.id}
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemText 
                  primary={link.url}
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
                    onClick={() => handleEditLink(link)}
                    sx={{ color: '#833ab4', mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteLink(link.id)}
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

      {/* Diálogo para editar link con las mismas validaciones */}
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
        <DialogTitle>Editar Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editingLink?.url || ''}
            onChange={(e) => {
              setEditingLink(prev => prev ? { ...prev, url: e.target.value } : null);
              touch('socialLink');
            }}
            error={!!getFieldError('socialLink')}
            helperText={getFieldError('socialLink')}
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
                '&.Mui-error fieldset': {
                  borderColor: '#fd1d1d',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#fd1d1d',
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
            disabled={!!getFieldError('socialLink')}
            sx={{
              background: 'linear-gradient(45deg, #833ab4 30%, #fd1d1d 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #fd1d1d 30%, #833ab4 90%)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.3)',
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