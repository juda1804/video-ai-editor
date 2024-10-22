const client = require('../config/googleClient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { uploadFileToGCS } = require('./googleStorage');

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

const uploadVideoToGCS = async (file) => {
  try {
    const bucket = client.googleStorage.bucket(process.env.GCP_VIDEOS_BUCKET_NAME);
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    return await uploadFileToGCS(file, bucket, fileName);
  } catch (error) {
    console.error('Error in uploadVideoToGCS:', error);
    throw new Error('Failed to upload video to Google Cloud Storage');
  }
};


module.exports = { analyzeVideo, uploadVideoToGCS };