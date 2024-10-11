// config/googleClient.js
const VideoIntelligenceServiceClient = require('@google-cloud/video-intelligence').v1.VideoIntelligenceServiceClient;
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const logger = require('../logger');

const readCredentials = () => {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    logger.error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
    return null;
  }

  try {
    const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
    return JSON.parse(credentialsContent);
  } catch (error) {
    logger.error(`Error reading credentials file: ${error.message}`);
    return null;
  }
}

logger.info('Initializing Google Video Intelligence client');

const credentials = readCredentials();
if (credentials) {
  logger.info('Credentials loaded successfully');
  logger.debug(`Credentials content: ${JSON.stringify(credentials, null, 2)}`);
} else {
  logger.warn('Failed to load credentials');
}

const client = new VideoIntelligenceServiceClient({
  credentials: credentials,
});

module.exports = client;
