const { generateVideoDescription } = require('../agents/VideoDescriber');
const { uploadVideoToGCS, cutVideo } = require('../services/videoService');
const logger = require('../logger')('videoController');

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

async function cutVideoHandler(req, res) {
  const { bucketUri, startTime, endTime } = req.body;

  if (!bucketUri || startTime === undefined || endTime === undefined) {
    return res.status(400).json({ error: 'bucketUri, startTime, and endTime are required.' });
  }

  try {
    const outputPath = await cutVideo(bucketUri, startTime, endTime);
    res.json({ success: true, outputPath });
  } catch (error) {
    logger.error('Error cutting video', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { analyzeVideoHandler, uploadVideoHandler, cutVideoHandler };
