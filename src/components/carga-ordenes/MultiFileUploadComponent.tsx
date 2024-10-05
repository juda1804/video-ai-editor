import React, { useState, useCallback, useRef } from 'react';
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
  createTheme,
  ThemeProvider,
  Alert,
  Collapse,
} from '@mui/material';
import { AttachFile, VideoFile, InsertDriveFile, Clear } from '@mui/icons-material';

const ALLOWED_EXTENSIONS = ['.mp4'];

const MultiFileUploadComponent: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setResponseMessage('Algunos archivos no fueron agregados porque no cumplen con las extensiones permitidas.');
      }
    }
  };

  const uploadAndCombineVideos = async (formData: FormData): Promise<string> => {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir los videos.');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setResponseMessage('Por favor, selecciona archivos para cargar.');
      return;
    }
    
    setIsUploading(true);
    setResponseMessage('');
    setDownloadUrl(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('videos', file);
    });

    try {
      const url = await uploadAndCombineVideos(formData);
      setDownloadUrl(url);
      setResponseMessage('Videos combinados con éxito.');
      setUploadSuccess(true);
    } catch (error) {
      setResponseMessage(`Error: ${(error as Error).message}`);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'mp4' || extension === 'avi') {
      return <VideoFile />;
    }
    return <InsertDriveFile />;
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#FF00FF', // Fucsia
      },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
    },
  });

  const ResponseMessage: React.FC<{ message: string; success: boolean }> = ({ message, success }) => (
    <Collapse in={!!message}>
      <Alert 
        severity={success ? "success" : "error"}
        sx={{ 
          mt: 2, 
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
        }}
      >
        {message}
      </Alert>
    </Collapse>
  );

  const handleClearFields = () => {
    setSelectedFiles([]);
    setResponseMessage('');
    setDownloadUrl(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ mt: 4, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
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
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Agregar Archivos
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileChange}
                  accept={ALLOWED_EXTENSIONS.join(',')}
                  ref={fileInputRef}
                />
              </Button>
            </Box>
            {selectedFiles.length > 0 && (
              <Paper variant="outlined" sx={{ mt: 2, mb: 2, maxHeight: 200, overflow: 'auto', bgcolor: 'background.default' }}>
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
            <ResponseMessage message={responseMessage} success={uploadSuccess} />
          </CardContent>
          <CardActions sx={{ flexDirection: 'column', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              disabled={isUploading || selectedFiles.length === 0}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                fontWeight: 'bold',
              }}
            >
              {isUploading ? 'Subiendo...' : 'Subir y Combinar Videos'}
            </Button>
          </CardActions>
          {uploadSuccess && downloadUrl && (
            <CardActions>
              <Button
                href={downloadUrl}
                download="merged-video.mp4"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Descargar Video Combinado
              </Button>
            </CardActions>
          )}
          {selectedFiles.length > 0 && (
            <CardActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearFields}
                fullWidth
                startIcon={<Clear />}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Limpiar Campos
              </Button>
            </CardActions>
          )}
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default MultiFileUploadComponent;
