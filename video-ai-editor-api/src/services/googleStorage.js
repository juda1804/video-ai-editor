const client = require('../config/googleClient');
const fs = require('fs');
const logger = require('../logger')('googleStorage');

/**
 * Creates a write stream for uploading a file to Google Cloud Storage
 * @param {Object} fileUpload - GCS file object
 * @param {string} mimetype - File mimetype
 * @returns {WriteStream} - GCS write stream
 */
const createGCSWriteStream = (fileUpload, mimetype) => {
  return fileUpload.createWriteStream({
    metadata: { contentType: mimetype }
  });
};

/**
 * Handles the file upload stream process
 * @param {ReadStream} fileStream - File read stream
 * @param {WriteStream} writeStream - GCS write stream
 * @returns {Promise} - Resolves when upload is complete
 */
const handleFileUploadStream = (fileStream, writeStream) => {
  return new Promise((resolve, reject) => {
    fileStream
      .pipe(writeStream)
      .on('error', reject)
      .on('finish', resolve);
  });
};

/**
 * Uploads a file to Google Cloud Storage
 * @param {string} filePath - Path to the local file
 * @param {Object} bucket - GCS bucket object
 * @param {string} fileName - Desired name for the uploaded file
 * @param {string} mimetype - File mimetype
 * @returns {Promise<string>} - GCS URL of the uploaded file
 */
const uploadFileToGCS = async (filePath, bucket, fileName, mimetype) => {
  try {
    logger.info(`Attempting to upload file: ${filePath} to bucket: ${bucket} as ${fileName}`);

    const fileUpload = bucket.file(fileName);
    const fileStream = fs.createReadStream(filePath);
    const writeStream = createGCSWriteStream(fileUpload, mimetype);

    await handleFileUploadStream(fileStream, writeStream);
    logger.info(`File ${fileName} uploaded successfully.`);

    return `gs://${bucket}/${fileName}`;
  } catch (error) {
    logUploadError(error);
    throw new Error(`Failed to upload file to Google Cloud Storage: ${error.message}`);
  }
};

/**
 * Logs detailed error information for upload failures
 * @param {Error} error - Error object
 */
const logUploadError = (error) => {
  logger.error(`Error in uploadFileToGCS: ${error.message}`, error);
  
  if (error.code) {
    logger.error(`Error code: ${error.code}`);
  }
  
  if (error.errors) {
    error.errors.forEach((err, index) => {
      logger.error(`Detailed error ${index + 1}:`, err);
    });
  }
};

module.exports = { uploadFileToGCS };
