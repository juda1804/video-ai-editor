// videoController.js
const { generateVideoDescription } = require('../agents/VideoDescriber'); // Cambiado a vertexService
const logger = require('../logger');

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

module.exports = { analyzeVideoHandler };