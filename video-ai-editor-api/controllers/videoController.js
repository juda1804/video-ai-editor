// videoController.js
const { generateVideoDescription } = require('../agents/VideoDescriber'); // Cambiado a vertexService
const logger = require('../logger');
const { uploadVideoToGCS } = require('../services/videoService');

async function analyzeVideoHandler(req, res) {
  logger.info('Analizando video');
  const { videoUri } = req.body;

  if (!videoUri) {
    return res.status(400).json({ error: 'videoUri es requerido.' });
  }

  try {
    const analysisResult = await generateVideoDescription(videoUri);

    logger.info('Video analizado', analysisResult);
    res.json({ success: true, data: analysisResult });
  } catch (error) {
    logger.error('Error al analizar video', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

const uploadVideoHandler = async (req, res) => {
  try {
    console.log('Request received in uploadVideoHandler');
    console.log('req.file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const gcsUri = await uploadVideoToGCS(req.file);
    res.json({ gcsUri });
  } catch (error) {
    console.error('Error in uploadVideoHandler:', error);
    logger.error('Error in uploadVideoHandler', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

module.exports = { analyzeVideoHandler, uploadVideoHandler };
