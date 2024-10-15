// config/vertexService.js
const axios = require('axios');

// Configuración de la API de Vertex AI
const apiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/us-central1/models/gemini-1.5-flash-002:predict`;
const apiKey = process.env.GCP_API_KEY;

// Función para generar contenido para un video usando Vertex AI
async function generateContentForVideo(videoUri) {
  const requestBody = {
    instances: [
      {
        content: videoUri // Aquí va la URI del video a analizar
      }
    ]
  };

  try {
    // Hacer la solicitud POST a Vertex AI
    const response = await axios.post(`${apiUrl}?key=${apiKey}`, requestBody);
    console.log('Respuesta de Vertex AI:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error llamando a Vertex AI:', error);
    throw error;
  }
}

module.exports = { generateContentForVideo };
