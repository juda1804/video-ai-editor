import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Card,
  CardContent,
  CardActions,
  Container,
} from '@mui/material';
import { AttachFile, VideoFile, InsertDriveFile } from '@mui/icons-material';

// Lista de extensiones permitidas
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.mp4', '.avi'];

const MultiFileUploadComponent: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const isFileAllowed = useCallback((file: File) => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return ALLOWED_EXTENSIONS.includes(extension);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const allowedFiles = filesArray.filter(isFileAllowed);
      setSelectedFiles(prevFiles => [...prevFiles, ...allowedFiles]);

      if (allowedFiles.length !== filesArray.length) {
        alert('Algunos archivos no fueron agregados porque no cumplen con las extensiones permitidas.');
      }
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert('Por favor, selecciona archivos para cargar.');
      return;
    }
    
    // Implementar lógica de carga aquí
    selectedFiles.forEach(file => {
      console.log('Subiendo archivo:', file.name);
    });
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'mp4' || extension === 'avi') {
      return <VideoFile />;
    }
    return <InsertDriveFile />;
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={3} sx={{ mt: 4, mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Cargar Múltiples Archivos
          </Typography>
          <Box sx={{ marginY: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<AttachFile />}
              fullWidth
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Agregar Archivos
              <input type="file" multiple hidden onChange={handleFileChange} accept={ALLOWED_EXTENSIONS.join(',')} />
            </Button>
          </Box>
          {selectedFiles.length > 0 && (
            <Paper variant="outlined" sx={{ mt: 2, mb: 2, maxHeight: 200, overflow: 'auto' }}>
              <List>
                {selectedFiles.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getFileIcon(file)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={file.name} 
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`} 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {ALLOWED_EXTENSIONS.map((ext) => (
              <Chip key={ext} label={ext} variant="outlined" size="small" sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            disabled={selectedFiles.length === 0}
            sx={{ 
              borderRadius: 2,
              py: 1.5,
              fontWeight: 'bold',
            }}
          >
            Subir Archivos
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default MultiFileUploadComponent;
