const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const winston = require('winston');
const cors = require('cors');
const os = require('os');
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
const app = express();

// Inicializar el cliente de Google Cloud Video Intelligence
const videoClient = new VideoIntelligenceServiceClient({
  keyFilename: path.join(__dirname, 'config', 'google-cloud-credentials.json') // Asegúrate de tener la ruta correcta del archivo de credenciales
});

app.use(cors({
  origin: 'http://localhost:3002', // Reemplaza con la URL de tu frontend
  credentials: true, 
}));

// Configuración del logger
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

// Configuración de almacenamiento de Multer en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Limitar tamaño de archivo a 50MB
}).array('videos', 10);

// Función para analizar las escenas clave utilizando Google Cloud Video Intelligence
async function analyzeVideoForKeyScenes(videoBuffer, prompt) {
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
        languageCode: 'en-US',  // Ajusta esto al idioma principal del video
        enableAutomaticPunctuation: true,
      },
      labelDetectionConfig: {
        labelDetectionMode: 'SHOT_MODE'
      },
      // Añadir una configuración basada en el prompt
      textDetectionConfig: {
        languageHints: [prompt]
      }
    }
  };

  const [operation] = await videoClient.annotateVideo(request);
  logger.info('Analizando el video con Google Cloud Video Intelligence...');

  const [operationResult] = await operation.promise();
  
  // Extraer cambios de escena
  const shotChanges = operationResult.annotationResults[0].shotAnnotations.map(shot => ({
    startTime: shot.startTimeOffset.seconds || 0,
    endTime: shot.endTimeOffset.seconds || 0
  }));

  // Extraer objetos detectados
  const objectAnnotations = operationResult.annotationResults[0].objectAnnotations.map(object => ({
    entity: object.entity.description,
    startTime: object.segment.startTimeOffset.seconds || 0,
    endTime: object.segment.endTimeOffset.seconds || 0,
  }));

  // Extraer etiquetas detectadas
  const labels = operationResult.annotationResults[0].segmentLabelAnnotations.map(label => ({
    description: label.entity.description,
    segments: label.segments.map(segment => ({
      startTime: segment.segment.startTimeOffset.seconds || 0,
      endTime: segment.segment.endTimeOffset.seconds || 0,
      confidence: segment.confidence,
    }))
  }));

  // Extraer transcripción de voz
  const speechTranscription = operationResult.annotationResults[0].speechTranscriptions.map(transcription => 
    transcription.alternatives[0].transcript
  ).join(' ');

  // Extraer detección de contenido explícito
  const explicitContent = operationResult.annotationResults[0].explicitAnnotation.frames.map(frame => ({
    timeOffset: frame.timeOffset.seconds || 0,
    pornographyLikelihood: frame.pornographyLikelihood,
  }));

  logger.info(`Detectadas ${shotChanges.length} escenas clave, ${objectAnnotations.length} objetos, ${labels.length} etiquetas.`);
  logger.info(`Transcripción de voz y detección de contenido explícito completadas.`);
  logger.info(`Analizando video con el prompt: "${prompt}"`);

  return { shotChanges, objectAnnotations, labels, speechTranscription, explicitContent };
}

// Función para hacer recortes inteligentes basados en eventos clave
async function mergeVideosWithSmartCuts(videoBuffers, outputVideoPath, callback) {
  const ffmpegCommand = ffmpeg();

  // Iterar sobre cada video y sus escenas clave
  for (const [index, buffer] of videoBuffers.entries()) {
    const tempFilePath = path.join(os.tmpdir(), `temp-video-${index}.mp4`);
    fs.writeFileSync(tempFilePath, buffer);
    
    // Obtener las escenas clave de cada video
    const { shotChanges, objectAnnotations } = await analyzeVideoForKeyScenes(buffer);

    // Si no hay suficientes escenas clave, cortar cada 2.68 segundos
    if (shotChanges.length === 0) {
      const durationPerCut = 2.68;
      ffmpegCommand.input(tempFilePath).inputOptions([`-ss 0`, `-t ${durationPerCut}`]);
    } else {
      // Usar las escenas clave detectadas por Google Cloud para hacer los cortes
      shotChanges.forEach(shot => {
        ffmpegCommand.input(tempFilePath)
          .inputOptions([
            `-ss ${shot.startTime}`, // Tiempo de inicio de la escena clave
            `-to ${shot.endTime}`    // Tiempo de fin de la escena clave
          ]);
      });

      // También se pueden usar los objetos detectados para hacer recortes
      objectAnnotations.forEach(object => {
        logger.info(`Objeto detectado: ${object.entity} desde ${object.startTime}s hasta ${object.endTime}s`);
        // Si quisieras recortar en función de objetos, puedes agregar lógica aquí
      });
    }
  }

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
      logger.info('Videos unidos exitosamente.');
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

// Añade esta nueva función para generar el video basado en el prompt
async function generateVideoFromPrompt(prompt) {
  // Aquí iría la lógica para generar el video basado en el prompt
  // Por ahora, simplemente registramos el prompt y devolvemos un mensaje
  logger.info(`Generando video basado en el prompt: ${prompt}`);
  return "Video generado basado en el prompt (simulado)";
}

// Modificar la ruta de upload para incluir el prompt en el análisis
app.post('/upload', (req, res) => {
  logger.info('Received upload request');
  upload(req, res, async function (err) {
    if (err) {
      logger.error('Error uploading files:', err);
      return res.status(500).send('Error al subir los archivos: ' + err.message);
    }

    const prompt = req.body.prompt; // Asume que el prompt se envía en el cuerpo de la solicitud

    if (!prompt) {
      logger.warn('No prompt received');
      return res.status(400).send('Se requiere un prompt para analizar el video.');
    }

    try {
      const videoBuffers = req.files.map(file => file.buffer);
      const outputVideoPath = path.join(uploadsFolderPath, 'output.mp4');

      mergeVideosWithSmartCuts(videoBuffers, outputVideoPath, async (err, result) => {
        if (err) {
          logger.error('Error processing videos:', err);
          return res.status(500).send('Error al procesar los videos: ' + err.message);
        }

        // Analizar el video resultante con el prompt
        const analysisResult = await analyzeVideoForKeyScenes(fs.readFileSync(outputVideoPath), prompt);

        res.status(200).json({
          message: 'Videos procesados y analizados con éxito',
          analysis: analysisResult
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