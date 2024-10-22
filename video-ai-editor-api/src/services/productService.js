const client = require('../config/googleClient');
const { v4: uuidv4 } = require('uuid');
const { uploadFileToGCS } = require('./googleStorage');
const logger = require('../logger')('productService');    

const uploadVomitoDeMercadoToGCS = async (file) => {
    try {
      const bucket = client.googleStorage.bucket(process.env.GCP_VOMITO_MERCADO_BUCKET_NAME);
      const fileName = `${uuidv4()}.txt`;

      logger.info(`Uploading vomito de mercado to GCS: ${fileName}`);
      return await uploadFileToGCS(file, bucket, fileName);
    } catch (error) {
      console.error('Error in uploadVomitoDeMercadoToGCS:', error);
      throw new Error('Failed to upload vomito de mercado to Google Cloud Storage');
    }
  };

module.exports = { uploadVomitoDeMercadoToGCS };