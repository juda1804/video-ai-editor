require('dotenv').config();

const {VertexAI} = require('@google-cloud/vertexai');

const project = process.env.GCP_PROJECT_ID || 'default-project-id';
const location = process.env.GCP_LOCATION || 'us-central1';

const vertex_ai = new VertexAI({project, location});

function getGenerativeModel(model, generationConfig, safetySettings) {
  return vertex_ai.preview.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });
}

module.exports = {
  getGenerativeModel
};
