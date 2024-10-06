const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

// Configurar la ruta de FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Función para extraer el audio de un video
function extractAudio(videoPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputAudioPath)
      .audioCodec('pcm_s16le') // Formato WAV sin compresión
      .on('end', () => {
        console.log(`Audio extraído correctamente a: ${outputAudioPath}`);
        resolve(outputAudioPath);
      })
      .on('error', (err) => {
        console.error('Error al extraer el audio:', err);
        reject(err);
      })
      .run();
  });
}

// Servicio para extraer audio
function extractAudioService(inputVideoFile, outputAudioFile) {
  const videoFile = path.resolve(__dirname, inputVideoFile);
  const outputAudioPath = path.resolve(__dirname, outputAudioFile);

  return extractAudio(videoFile, outputAudioPath)
    .then(() => {
      console.log('Extracción completada');
      return outputAudioPath;
    })
    .catch((err) => {
      console.error('Error:', err);
      throw err; 
    });
}

module.exports = extractAudioService;