// services/videoService.js
const client = require('../config/googleClient');

async function analyzeVideo(params) {
  const { bucketUri, features, languageHints, context } = params;

  const request = {
    inputUri: bucketUri,
    features: features,
    videoContext: context,
  };

  try {
    const [operation] = await client.annotateVideo(request);
    console.log('Operación iniciada. Esperando resultados...');
    const [operationResult] = await operation.promise();
    console.log('Análisis completado.');
    return operationResult.annotationResults[0];
  } catch (error) {
    console.error('Error durante el análisis:', error);
    throw error;
  }
}

module.exports = { analyzeVideo };
