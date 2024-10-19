const client = require('../config/googleClient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

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
    console.log('File received in uploadVideoToGCS:', file);
    if (!file) {
      throw new Error('No file received');
    }

    console.log('GCP_BUCKET_NAME:', process.env.GCP_BUCKET_NAME);
    const bucket = client.googleStorage.bucket(process.env.GCP_BUCKET_NAME);
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const fileUpload = bucket.file(fileName);

    console.log('Attempting to upload file to GCS');
    // Use createReadStream instead of accessing buffer directly
    const fileStream = require('fs').createReadStream(file.path);
    await new Promise((resolve, reject) => {
      fileStream.pipe(fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      }))
      .on('error', reject)
      .on('finish', resolve);
    });

    console.log('File uploaded successfully');
    return `gs://${process.env.GCP_BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error('Error in uploadVideoToGCS:', error);
    throw new Error('Failed to upload video to Google Cloud Storage');
  }
};

module.exports = { analyzeVideo, uploadVideoToGCS };