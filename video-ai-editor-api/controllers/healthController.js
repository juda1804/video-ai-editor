// controllers/healthController.js
const { generateContentForVideo } = require('../config/vertexService');  // Usamos Vertex AI

async function healthCheckHandler(req, res) {
  try {
    // Usar Vertex AI para generar contenido y comprobar si funciona
    const videoUri = 'gs://cloud-samples-data/generative-ai/video/describe_video_content.mp4'; // Video de prueba
    const result = await generateContentForVideo(videoUri);  // Llamar a Vertex AI

    res.status(200).json({
      success: true,
      message: 'El servicio está funcionando correctamente con Vertex AI.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al acceder a Vertex AI.',
      error: error.message,
    });
  }
}

module.exports = { healthCheckHandler };
