const client = require('../config/googleClient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { uploadFileToGCS } = require('./googleStorage');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const os = require('os');

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

async function cutVideo(bucketUri, startTime, endTime) {
  try {
    // Download the video from GCS
    const tempInputPath = path.join(os.tmpdir(), `input-${uuidv4()}.mp4`);
    await downloadFromGCS(bucketUri, tempInputPath);

    // Set up output path
    const outputFileName = `output-${uuidv4()}.mp4`;
    const outputPath = path.join('uploads', outputFileName);

    // Ensure the 'uploads' directory exists
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    // Convert milliseconds to seconds
    const startTimeSeconds = startTime / 1000;
    const durationSeconds = (endTime - startTime) / 1000;

    // Cut the video using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .setStartTime(startTimeSeconds)
        .setDuration(durationSeconds)
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // Clean up the temporary input file
    fs.unlinkSync(tempInputPath);

    console.log(`Video cut successfully. Output: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error cutting video:', error);
    throw error;
  }
}

async function downloadFromGCS(bucketUri, localPath) {
  const bucket = client.googleStorage.bucket(bucketUri.split('/')[2]);
  const file = bucket.file(bucketUri.split('/').slice(3).join('/'));

  await new Promise((resolve, reject) => {
    file.createReadStream()
      .pipe(fs.createWriteStream(localPath))
      .on('finish', resolve)
      .on('error', reject);
  });
}

module.exports = { analyzeVideo, uploadVideoToGCS, cutVideo };
