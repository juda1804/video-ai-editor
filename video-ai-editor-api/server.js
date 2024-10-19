const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const cors = require('cors');
const os = require('os');
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');

// Configuración del logger
const logger = require('./src/logger')('server');

// Inicializar el cliente de Google Cloud Video Intelligence
const videoClient = new VideoIntelligenceServiceClient({
  keyFilename: path.join(__dirname, 'config', 'google-cloud-credentials.json')
});

const app = express();

app.use(cors({
  origin: 'http://localhost:3002', // Reemplaza con la URL de tu frontend
  credentials: true,
}));

// Asegurarse de que la carpeta 'uploads' existe
const uploadsFolderPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolderPath)) {
  fs.mkdirSync(uploadsFolderPath);
}

// Configuración de almacenamiento de Multer en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Limitar tamaño de archivo a 50MB
}).array('videos', 10);

// Función para analizar las escenas clave utilizando Google Cloud Video Intelligence
async function analyzeVideoForKeyScenes(videoBuffer) {
  const request = {
    inputContent: videoBuffer.toString('base64'),
    features: [
      'SHOT_CHANGE_DETECTION',
      'OBJECT_TRACKING',
      'LABEL_DETECTION',
      'SPEECH_TRANSCRIPTION',
      'EXPLICIT_CONTENT_DETECTION'
    ],
    videoContext: {
      speechTranscriptionConfig: {
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      },
      labelDetectionConfig: {
        labelDetectionMode: 'SHOT_MODE'
      }
    }
  };

  const [operation] = await videoClient.annotateVideo(request);
  logger.info('Analizando el video con Google Cloud Video Intelligence...');

  const [operationResult] = await operation.promise();

  const shotChanges = operationResult.annotationResults[0].shotAnnotations.map(shot => ({
    startTime: shot.startTimeOffset.seconds || 0,
    endTime: shot.endTimeOffset.seconds || 0
  }));

  return { shotChanges };
}

// Función para unir videos con un copy específico
async function mergeVideoWithCopy(videoBuffer, salesCopy, outputVideoPath, callback) {
  const ffmpegCommand = ffmpeg();
  const tempFilePath = path.join(os.tmpdir(), `temp-video.mp4`);
  fs.writeFileSync(tempFilePath, videoBuffer);

  const { shotChanges } = await analyzeVideoForKeyScenes(videoBuffer);

  if (shotChanges.length === 0) {
    const durationPerCut = 20; // 20 segundos por versión del video
    ffmpegCommand.input(tempFilePath).inputOptions([`-ss 0`, `-t ${durationPerCut}`]);
  } else {
    shotChanges.forEach(shot => {
      ffmpegCommand.input(tempFilePath)
        .inputOptions([`-ss ${shot.startTime}`, `-to ${shot.endTime}`])
        .outputOptions(`-vf "drawtext=text='${salesCopy}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-th-10"`);
    });
  }

  ffmpegCommand
    .outputOptions([
      '-c:v libx264',
      '-c:a aac',
      '-preset ultrafast',
      '-crf 23',
      '-shortest'
    ])
    .on('start', (commandLine) => {
      logger.info(`FFmpeg ejecutando comando: ${commandLine}`);
    })
    .on('end', () => {
      logger.info(`Video con copy "${salesCopy}" generado exitosamente.`);
      fs.unlinkSync(tempFilePath);
      callback(null, outputVideoPath);
    })
    .on('error', (err) => {
      logger.error('Error al unir los videos: ' + err.message);
      callback(err, null);
    })
    .mergeToFile(outputVideoPath, uploadsFolderPath);
}

// Función para generar múltiples versiones del video
async function generateMultipleVideosWithCopies(videoBuffers, salesAngles, callback) {
  const versions = [];

  for (let i = 0; i < salesAngles.length; i++) {
    const outputVideoPath = path.join(uploadsFolderPath, `output_version_${i + 1}.mp4`);
    const copy = salesAngles[i];

    await mergeVideoWithCopy(videoBuffers[0], copy, outputVideoPath, (err, result) => {
      if (err) {
        logger.error('Error procesando el video:', err);
        callback(err, null);
        return;
      }
      versions.push(outputVideoPath);
    });
  }

  callback(null, versions);
}

// Ruta para subir videos y generar múltiples versiones con copys diferentes
app.post('/upload', (req, res) => {
  logger.info('Received upload request');
  upload(req, res, async function (err) {
    if (err) {
      logger.error('Error uploading files:', err);
      return res.status(500).send('Error al subir los archivos: ' + err.message);
    }

    const salesAngles = req.body.salesAngles;

    if (!salesAngles || salesAngles.length === 0) {
      logger.warn('No sales angles received');
      return res.status(400).send('No se recibieron copys de venta.');
    }

    try {
      const videoBuffers = req.files.map(file => file.buffer);

      generateMultipleVideosWithCopies(videoBuffers, salesAngles, (err, versions) => {
        if (err) {
          logger.error('Error procesando videos:', err);
          return res.status(500).send('Error al procesar los videos: ' + err.message);
        }

        res.status(200).json({
          message: 'Videos procesados con éxito',
          versions: versions
        });
      });
    } catch (error) {
      logger.error('Error processing request:', error);
      res.status(500).send('Error al procesar la solicitud: ' + error.message);
    }
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  logger.info('Servidor corriendo en http://localhost:3000');
});