const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Función para descargar el video
async function downloadVideo(videoUrl, outputPath) {
  try {
    // Check if the file already exists
    if (fs.existsSync(outputPath)) {
      console.log('File already exists:', outputPath);
      return;
    }

    // Hacer una solicitud GET para descargar el video
    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream' // Descargar el video como un stream
    });

    // Crear un flujo de escritura para guardar el video
    const writer = fs.createWriteStream(outputPath);

    // Piping el stream de respuesta al archivo local
    response.data.pipe(writer);

    // Track download progress
    const totalLength = response.headers['content-length'];
    let downloadedLength = 0;

    response.data.on('data', (chunk) => {
      downloadedLength += chunk.length;
      console.log(`Downloaded ${(downloadedLength / totalLength * 100).toFixed(2)}%`);
    });

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', (error) => {
        console.error('Error al escribir el archivo:', error.message);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error al descargar el video:', error.message);
    throw error; // Propaga el error para que pueda ser capturado por el .catch
  }
}

// URL del video (el que has proporcionado)
const videoUrl = 'https://v16-webapp-prime.tiktok.com/video/tos/useast2a/tos-useast2a-ve-0068c001-euttp/oUBYRYD4l8vfEHuxtjTsPfVEgKrFQEmzDIQArJ/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=3830&bt=1915&cs=0&ds=6&ft=4fUEKMM88Zmo0Nu9Fb4jVxwW8pWrKsd.&mime_type=video_mp4&qs=0&rc=OTM3OTQ3Zzw5M2Q2Zjc3OUBpajc2d285cjhpdDMzZjczM0A0YWFiL14zXi4xNDIyYTFgYSNmZ2dsMmRjL19gLS1kMWNzcw%3D%3D&btag=e00088000&expire=1728337735&l=202410071548393B6DF8CE1716CC0957F3&ply_type=2&policy=2&signature=0193542af997bcf596afa1c543ada9c2&tk=tt_chain_token';

// Ruta donde se guardará el video
const outputPath = path.resolve(__dirname, 'downloaded-video.mp4');

// Descargar el video
downloadVideo(videoUrl, outputPath)
  .then(() => {
    console.log('Video descargado correctamente:', outputPath);
  })
  .catch((error) => {
    console.error('Error al descargar el video:', error);
  });