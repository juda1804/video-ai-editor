const { analyzeVideo } = require('../services/videoService');

async function analyzeVideoHandler(req, res) {
  const { bucketUri, features, languageHints, context } = req.body;

  // Validar parámetros requeridos
  if (!bucketUri || !features) {
    return res.status(400).json({ error: 'bucketUri y features son requeridos.' });
  }

  // Construir el videoContext si se proporcionan languageHints o context
  const videoContext = context || {};

  if (languageHints) {
    videoContext.speechTranscriptionConfig = {
      languageHints: languageHints,
    };
  }

  try {
    const analysisResult = await analyzeVideo({ bucketUri, features, context: videoContext });
    res.json({ success: true, data: analysisResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { analyzeVideoHandler };
