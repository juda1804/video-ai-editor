const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const cors = require('cors');  // Importar CORS
const app = express();

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors());

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

// Función para convertir videos a MP4 con una resolución y formato consistentes
function convertToMp4(videoPath, outputPath, callback) {
  ffmpeg(videoPath)
    .outputOptions([
      '-c:v libx264',         // Convertir video a H.264
      '-c:a aac',             // Convertir audio a AAC
      '-strict -2',           // Usar encoder AAC
      '-vf scale=1280:720',   // Cambiar la resolución a 720p
      '-r 30',                // Establecer el frame rate a 30 fps
      '-preset veryfast',     // Usar preset rápido para conversión rápida
      '-movflags +faststart'  // Mejora la capacidad de streaming del archivo resultante
    ])
    .on('end', () => {
      console.log(`Archivo convertido a MP4: ${outputPath}`);
      callback(null, outputPath);
    })
    .on('error', (err) => {
      console.error(`Error al convertir el archivo: ${err.message}`);
      callback(err, null);
    })
    .save(outputPath);
}

// Función para concatenar videos directamente sin archivo de lista
function concatVideosDirectly(videoPaths, outputVideoPath, callback) {
  const ffmpegCommand = ffmpeg();

  // Añadir cada archivo de video como entrada
  videoPaths.forEach(videoPath => {
    ffmpegCommand.input(videoPath);
  });

  // Concatenar los videos
  ffmpegCommand
    .outputOptions([
      '-filter_complex concat=n=' + videoPaths.length + ':v=1:a=1', // Concatenar video y audio
      '-c:v libx264',        // Asegurar que el codec de video sea H.264
      '-c:a aac',            // Asegurar que el codec de audio sea AAC
      '-strict -2',          // Usar el encoder AAC
      '-movflags +faststart' // Mejora la capacidad de streaming del archivo resultante
    ])
    .on('start', (commandLine) => {
      console.log(`FFmpeg ejecutando comando: ${commandLine}`);
    })
    .on('end', () => {
      console.log('Videos unidos exitosamente');
      callback(null, outputVideoPath);
    })
    .on('error', (err) => {
      console.error('Error al unir los videos: ' + err.message);
      callback(err, null);
    })
    .save(outputVideoPath);
}

// Ruta para subir y unir videos
app.post('/upload', (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).send('Error al subir los archivos: ' + err.message);
    }

    if (req.files && req.files.length > 0) {
      const videoPaths = [];

      // Convertir todos los videos a MP4 con el mismo formato antes de unirlos
      for (const file of req.files) {
        const convertedVideoPath = path.join(uploadsFolderPath, `converted-${Date.now()}.mp4`);
        await new Promise((resolve, reject) => {
          convertToMp4(file.path, convertedVideoPath, (err, outputPath) => {
            if (err) return reject(err);
            videoPaths.push(outputPath);
            resolve();
          });
        });
      }

      // Nombre del archivo de salida
      const outputVideoPath = path.join(__dirname, 'uploads', 'merged-video.mp4');

      // Unir los videos directamente
      concatVideosDirectly(videoPaths, outputVideoPath, (mergeError, mergedVideo) => {
        if (mergeError) {
          return res.status(500).send('Error al unir los videos: ' + mergeError.message);
        }

        // Enviar el video final al cliente
        res.download(mergedVideo);
      });
    } else {
      res.status(400).send('Sube al menos un video para analizar.');
    }
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});