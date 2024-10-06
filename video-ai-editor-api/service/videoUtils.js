const path = require('path');
const fs = require('fs');
const os = require('os'); // Import the os module
const ffmpeg = require('fluent-ffmpeg');// Función para unir múltiples videos

const uploadsFolderPath = path.join(__dirname, '../uploads'); // Define the uploads folder path

function mergeVideos(videoBuffers, outputVideoPath, uploadsFolderPath, callback) {
    const ffmpegCommand = ffmpeg();

    videoBuffers.forEach((buffer, index) => {
        const tempFilePath = path.join(os.tmpdir(), `temp-video-${index}.mp4`);
        fs.writeFileSync(tempFilePath, buffer);
        ffmpegCommand.input(tempFilePath);
    });

    try {
        ffmpegCommand
            .outputOptions([
                '-c:v libx264',  // Usar codec H.264 para video
                '-c:a aac',      // Usar codec AAC para audio
                '-preset ultrafast',  // Usar preset ultrafast para codificación más rápida
                '-crf 23',       // Calidad constante, balance entre calidad y tamaño
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
    } catch (error) {
        logger.error('Error al unir los videos: ' + error.message);
        callback(error, null);
    }
}

module.exports = {
    mergeVideos
};