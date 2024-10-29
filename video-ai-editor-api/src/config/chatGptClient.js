const OpenAI = require('openai');

const chatGPT = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {chatGPT};