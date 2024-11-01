require('dotenv').config();
const OpenAI = require('openai');

const API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY
});

const ChatGPT = {
  generateResponse: async (model, messages, temperature = 0.7, maxTokens = 400) => {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      });

      const result = completion.choices[0].message.content;
      
      console.log(`Response generated successfully
        Model used: ${model}
        Prompt tokens: ${completion.usage.prompt_tokens}
        Completion tokens: ${completion.usage.completion_tokens}
        Total tokens: ${completion.usage.total_tokens}
        Temperature: ${temperature}
        Max tokens: ${maxTokens}`);

      return result;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
};

module.exports = { ChatGPT };