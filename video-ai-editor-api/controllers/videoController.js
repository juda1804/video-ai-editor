// videoController.js
const { generateContentForVideo } = require('../config/vertexService'); // Cambiado a vertexService
async function analyzeVideoHandler(req, res) {
  const { bucketUri } = req.body;

  if (!bucketUri) {
    return res.status(400).json({ error: 'bucketUri es requerido.' });
  }

  try {
    // Llama a la función que interactúa con Vertex AI
    const analysisResult = await generateContentForVideo(bucketUri);
    res.json({ success: true, data: analysisResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { analyzeVideoHandler };