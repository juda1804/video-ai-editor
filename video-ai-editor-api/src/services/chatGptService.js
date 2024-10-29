const { chatGPT } = require('../config/chatGptClient.js'); 
const logger = require('../logger')('chatGptService');

  
const generateResponse = async (model, messages, temperature = 0.7, maxTokens = 400) => {
    try {
      const completion = await chatGPT.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      });

      const result = completion.choices[0].message.content;
      
      logger.info(`Response generated successfully
        Model used: ${model}
        Prompt tokens: ${completion.usage.prompt_tokens}
        Completion tokens: ${completion.usage.completion_tokens}
        Total tokens: ${completion.usage.total_tokens}
        Temperature: ${temperature}
        Max tokens: ${maxTokens}`);

      return result;
    } catch (error) {
      logger.error('Error generating response:', error);
      throw error;
    }
}

const askQuestion = async (prompt, model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 400) => {
    try {
      const messages = [{ role: 'user', content: prompt }];
      const response = await generateResponse(model, messages, temperature, maxTokens);
      return response;
    } catch (error) {
        logger.error('Error in chatGptService.ask:', error);
        throw error;
    }
  }


module.exports = {askQuestion};