const chatGptService = require('../services/chatGptService');

const asktoChatGpt = async (req, res) => {
  try {
    const { question } = req.query;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    const answer = await chatGptService.askQuestion(question);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}

module.exports = {
  asktoChatGpt
};
