import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  IconButton,
  Box
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MovieIcon from '@mui/icons-material/Movie';
import { FormState } from './types';

interface CombinedVideosStepProps {
  formState: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
}

export const CombinedVideosStep = forwardRef<
  { validateStep: () => boolean },
  CombinedVideosStepProps
>(({ formState, onFormChange }, ref) => {
  const [selectedVideo, setSelectedVideo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock de datos de videos (reemplazar con datos reales)
  const videos = [
    { id: 1, title: 'Video 1', duration: '00:30', thumbnail: '/path/to/thumbnail1' },
    { id: 2, title: 'Video 2', duration: '00:45', thumbnail: '/path/to/thumbnail2' },
    { id: 3, title: 'Video 3', duration: '00:15', thumbnail: '/path/to/thumbnail3' },
  ];

  useImperativeHandle(ref, () => ({
    validateStep: () => true // Este paso no requiere validación
  }));

  const handleVideoSelect = (index: number) => {
    setSelectedVideo(index);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Grid container spacing={3} sx={{ mt: 2, height: '100%' }}>
      {/* Columna del Video */}
      <Grid item xs={12} md={8}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 2,
            fontWeight: 500 
          }}
        >
          Vista previa del video
        </Typography>
        <Paper 
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            aspectRatio: '16/9',
            position: 'relative',
            overflow: 'hidden',
            mb: 2
          }}
        >
          {/* Aquí irá el reproductor de video */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2
            }}
          >
            <IconButton
              onClick={togglePlay}
              sx={{
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                }
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Box>
        </Paper>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center'
          }}
        >
          {videos[selectedVideo].title} - {videos[selectedVideo].duration}
        </Typography>
      </Grid>

      {/* Columna de la Lista */}
      <Grid item xs={12} md={4}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'white',
            mb: 2,
            fontWeight: 500 
          }}
        >
          Lista de videos
        </Typography>
        <Paper 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            maxHeight: 'calc(100vh - 300px)',
            overflow: 'auto'
          }}
        >
          <List>
            {videos.map((video, index) => (
              <ListItem 
                key={video.id}
                button
                selected={selectedVideo === index}
                onClick={() => handleVideoSelect(index)}
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:last-child': { borderBottom: 'none' },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(131, 58, 180, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(131, 58, 180, 0.3)',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <MovieIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={video.title}
                  secondary={video.duration}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: 'white',
                    },
                    '& .MuiListItemText-secondary': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(index);
                    setIsPlaying(true);
                  }}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#833ab4',
                    }
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}); 