import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

const FileUploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('Dropi');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(event.target.value as string);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo para cargar.');
      return;
    }
    
    // You can implement the upload logic here using selectedFile and selectedOption
    console.log('Subiendo archivo:', selectedFile.name);
    console.log('Opción seleccionada:', selectedOption);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid #ccc',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
        marginTop: '20px'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Cargar Archivo
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="select-option-label" shrink>Selecciona una opción</InputLabel>
        <Select
          labelId="select-option-label"
          value={selectedOption}
          onChange={e => handleOptionChange}
        >
          <MenuItem value="Dropi">Dropi</MenuItem>
          <MenuItem value="Effix">Effix</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ marginY: 2 }}>
        <Button variant="contained" component="label" fullWidth>
          Seleccionar Archivo
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {selectedFile && (
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Archivo seleccionado: {selectedFile.name}
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >
        Subir Archivo
      </Button>
    </Box>
  );
};

export default FileUploadComponent;
