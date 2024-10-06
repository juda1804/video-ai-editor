import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import MultiFileUploadComponent from './carga-ordenes/MultiFileUploadComponent';
import VideoMerger from './VideoMerger';
import ProductInfoBanner from './carga-ordenes/ProductInfoBanner';

const DefaultPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Batch de videos
        </Typography>
        <MultiFileUploadComponent />
        <ProductInfoBanner/>
      </Paper>
    </Container>
  );
};

export default DefaultPage;