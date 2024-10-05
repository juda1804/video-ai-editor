import React, { useState, useRef } from 'react';
import { Button, Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const VideoMerger: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResponseMessage('');
    setDownloadUrl(null);

    if (selectedFiles.length === 0) {
      setResponseMessage('Por favor selecciona al menos un video.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('videos', file);
    });

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir los videos.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      setResponseMessage(`Error: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Unir Videos
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <input
          type="file"
          id="video-input"
          multiple
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <Button
          variant="contained"
          onClick={() => fileInputRef.current?.click()}
          sx={{ mb: 2 }}
        >
          Selecciona tus videos (hasta 10)
        </Button>
        <List>
          {selectedFiles.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Video ${index + 1}: ${file.name}`} />
            </ListItem>
          ))}
        </List>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isUploading}
          sx={{ mt: 2 }}
        >
          {isUploading ? 'Subiendo...' : 'Subir y Unir Videos'}
        </Button>
      </Box>
      {responseMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {responseMessage}
        </Typography>
      )}
      {downloadUrl && (
        <Button
          href={downloadUrl}
          download="merged-video.mp4"
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
        >
          Descargar Video Combinado
        </Button>
      )}
    </Container>
  );
};

export default VideoMerger;
