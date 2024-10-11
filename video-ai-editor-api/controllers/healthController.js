// controllers/healthController.js
const client = require('../config/googleClient');

async function healthCheckHandler(req, res) {
  try {
    // URI del video de prueba en GCS
    const inputUri = 'gs://draft-videos/tapete-bebe-agua.mp4'; // Reemplaza con tu URI real

    const request = {
      inputUri: inputUri,
      features: ['LABEL_DETECTION'],
    };

    // Intentar realizar la llamada a la API
    await client.annotateVideo(request);

    res.status(200).json({
      success: true,
      message: 'Las credenciales son válidas y tienen permiso para acceder a la API de Video Intelligence.',
    });
  } catch (error) {
    let statusCode = 500;
    let message = 'Error al acceder a la API de Video Intelligence.';

    if (error.code === 7) {
      // PERMISSION_DENIED
      statusCode = 403;
      message = 'Permiso denegado. Las credenciales no tienen acceso a la API de Video Intelligence.';
    } else if (error.code === 16) {
      // UNAUTHENTICATED
      statusCode = 401;
      message = 'No autenticado. Las credenciales son inválidas o han expirado.';
    }

    res.status(statusCode).json({
      success: false,
      message: message,
      error: error.message,
    });
  }
}

module.exports = { healthCheckHandler };
