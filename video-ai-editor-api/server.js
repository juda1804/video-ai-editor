const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const winston = require('winston');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Replace with your frontend URL
  credentials: true, // If you're using cookies or authentication headers
}));

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// Asegurarse de que la carpeta 'uploads' existe
const uploadsFolderPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolderPath)) {
  fs.mkdirSync(uploadsFolderPath);
}

// Configuración del almacenamiento de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFolderPath); // Carpeta donde se guardarán los videos subidos
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Guardar el archivo con su nombre original y extensión
  }
});

// Configuración de Multer para aceptar múltiples videos
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Limitar a 100 MB por archivo
}).array('videos', 10); // Aceptar hasta 10 archivos con el campo 'videos'

// Función para unir múltiples videos
function mergeVideos(videoPaths, outputVideoPath, callback) {
  const ffmpegCommand = ffmpeg();

  videoPaths.forEach(videoPath => {
    ffmpegCommand.input(videoPath); // Añadir cada video como entrada
  });

  // Configuración de salida del video
  ffmpegCommand
    .on('start', (commandLine) => {
      logger.info(`FFmpeg ejecutando comando: ${commandLine}`);
    })
    .on('end', () => {
      logger.info('Videos unidos exitosamente');
      callback(null, outputVideoPath);
    })
    .on('error', (err) => {
      logger.error('Error al unir los videos: ' + err.message);
      callback(err, null);
    })
    .mergeToFile(outputVideoPath, uploadsFolderPath); // Guardar el archivo final en la carpeta uploads
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
      const videoPaths = req.files.map(file => file.path);
      const outputVideoPath = path.join(__dirname, 'uploads', 'edited-video.mp4'); // Nombre cambiado a 'edited-video.mp4'

      logger.info('Starting video merge');
      // Unir videos
      mergeVideos(videoPaths, outputVideoPath, (mergeError, mergedVideo) => {
        if (mergeError) {
          logger.error('Error merging videos:', mergeError);
          return res.status(500).send('Error al unir los videos: ' + mergeError.message);
        }

        logger.info('Video merge completed, sending response');
        // Enviar el video final al cliente
        
        res.download(mergedVideo, 'merged-video.mp4');
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