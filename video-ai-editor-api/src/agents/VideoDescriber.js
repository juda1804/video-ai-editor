const { getGenerativeModel } = require('../services/vertexService');
const { agenteVentasWhatsappPrompt } = require('./AgentsPrompt');
const logger = require('../logger');

const model = 'gemini-1.5-flash-002';
const generationConfig = {
  'maxOutputTokens': 8192,
  'temperature': 1,
  'topP': 0.95,
};
const safetySettings = [
  {
    'category': 'HARM_CATEGORY_HATE_SPEECH',
    'threshold': 'OFF',
  },
  {
    'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
    'threshold': 'OFF',
  },
  {
    'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    'threshold': 'OFF',
  },
  {
    'category': 'HARM_CATEGORY_HARASSMENT',
    'threshold': 'OFF',
  }
];

const generativeModel = getGenerativeModel(model, generationConfig, safetySettings);

const getBucketVideo = (videoUri) => {
    return {
        fileData: {
            mimeType: 'video/mp4',
            fileUri: videoUri
        }
    };
};

function cleanJsonString(jsonString) {
    const cleanedString = jsonString.replace(/```json\n|\n```/g, '');
    try {
        return JSON.parse(cleanedString);
    } catch (error) {
        logger.error('Error parsing JSON string:', error);
        throw error;
    }
  }

async function generateVideoDescription(videoUri = "gs://draft-videos/tapete-bebe-agua.mp4") {
  const video = getBucketVideo(videoUri);
  const req = {
    contents: [
      {role: 'user', parts: [agenteVentasWhatsappPrompt, video]}
    ],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  for await (const item of streamingResp.stream) {
    logger.debug('stream chunk: ' + JSON.stringify(item) + '\n');
  }
  const transformedItem = await streamingResp.response;

  const content = cleanJsonString(transformedItem.candidates[0].content.parts[0].text);
  logger.info('Video descrito', content);
  return content;
}

module.exports = {
  generateVideoDescription
};

