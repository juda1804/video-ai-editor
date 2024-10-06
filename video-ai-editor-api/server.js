const express = require('express');

const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const os = require('os');

const app = express();

const logger = require('./logger');
const corsMiddleware = require('./cors');

app.use(corsMiddleware);

// Asegurarse de que la carpeta 'uploads' existe
const uploadsFolderPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolderPath)) {
  fs.mkdirSync(uploadsFolderPath);
}

// Cambiar el almacenamiento de Multer para usar memoria en lugar de disco
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Limitar tamaño de archivo a 50MB
}).array('videos', 10);

// Función para unir múltiples videos
const mergeVideos = (videoBuffers, outputVideoPath, callback) => {
  const ffmpegCommand = ffmpeg();

  videoBuffers.forEach((buffer, index) => {
    const tempFilePath = path.join(os.tmpdir(), `temp-video-${index}.mp4`);
    fs.writeFileSync(tempFilePath, buffer);
    ffmpegCommand.input(tempFilePath);
  });

  // Configuración de salida del video
  ffmpegCommand
    .outputOptions([
      '-c:v libx264',  // Usar codec H.264 para video
      '-c:a aac',      // Usar codec AAC para audio
      '-preset ultrafast',  // Usar preset ultrafast para codificación más rápida
      '-crf 23',       // Calidad constante, balance entre calidad y tamaño
      '-shortest'      // Terminar con el video más corto si las duraciones son diferentes
    ])
    .on('start', (commandLine) => {
      logger.info(`FFmpeg ejecutando comando: ${commandLine}`);
    })
    .on('end', () => {
      logger.info('Videos unidos exitosamente');
      // Limpiar archivos temporales
      videoBuffers.forEach((_, index) => {
        fs.unlinkSync(path.join(os.tmpdir(), `temp-video-${index}.mp4`));
      });
      callback(null, outputVideoPath);
    })
    .on('error', (err) => {
      logger.error('Error al unir los videos: ' + err.message);
      callback(err, null);
    })
    .mergeToFile(outputVideoPath, uploadsFolderPath);
}

// Ruta para subir y unir videos
app.post('/upload', (req, res) => {
  logger.info('Received upload request');
  upload(req, res, function (err) {
    if (err) {
      logger.error('Error uploading files:', err);
      return res.status(500).send('Error al subir los archivos: ' + err.message);
    }

    if (req.files && req.files.length > 0) {
      logger.info(`Received ${req.files.length} files`);
      const videoBuffers = req.files.map(file => file.buffer);
      const outputVideoPath = path.join(os.tmpdir(), 'edited-video.mp4');

      logger.info('Starting video merge');
      // Unir videos
      mergeVideos(videoBuffers, outputVideoPath, (mergeError, mergedVideo) => {
        if (mergeError) {
          logger.error('Error merging videos:', mergeError);
          return res.status(500).send('Error al unir los videos: ' + mergeError.message);
        }

        logger.info('Video merge completed, sending response');
        // Enviar el video final al cliente
        res.download(mergedVideo, 'merged-video.mp4', (err) => {
          if (err) {
            logger.error('Error sending merged video:', err);
          }
          // Eliminar el archivo fusionado después de enviarlo
          fs.unlinkSync(mergedVideo);
        });
      });
    } else {
      logger.warn('No files received');
      res.status(400).send('Sube al menos un video para analizar.');
    }
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  logger.info('Servidor corriendo en http://localhost:3000');
});