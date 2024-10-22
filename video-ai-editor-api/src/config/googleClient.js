const { Storage } = require('@google-cloud/storage');

const fs = require('fs');
require('dotenv').config();
const logger = require('../logger')('googleClient');

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
    throw new Error(`Error reading credentials file: ${error.message}`);
  }
}

logger.info('Initializing Google Cloud Storage client');

const credentials = readCredentials();
if (credentials) {
  logger.info('Credentials loaded successfully');
  logger.debug(`Credentials content: ${JSON.stringify(credentials, null, 2)}`);
}

const googleStorage = new Storage({
  credentials: credentials
});

module.exports = { googleStorage };