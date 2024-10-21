const client = require('../config/googleClient');
const fs = require('fs');
const logger = require('../logger')('googleStorage');

const uploadFileToGCS = async (filePath, bucket, fileName) => {
  try {
    logger.info(`Attempting to upload file: ${filePath} to bucket: ${bucket.name} as ${fileName}`);

    await bucket.upload(filePath, {
      destination: fileName,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    logger.info(`File ${fileName} uploaded successfully.`);

    const url = `gs://${bucket.name}/${fileName}`;
    return url;
  } catch (error) {
    logger.error(`Error in uploadFileToGCS: ${error.message}`, error);
    if (error.code) {
      logger.error(`Error code: ${error.code}`);
    }
    if (error.errors) {
      error.errors.forEach((err, index) => {
        logger.error(`Detailed error ${index + 1}:`, err);
      });
    }
    throw new Error(`Failed to upload file to Google Cloud Storage: ${error.message}`);
  }
};

module.exports = { uploadFileToGCS };
