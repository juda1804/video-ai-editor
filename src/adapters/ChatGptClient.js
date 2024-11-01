const axios = require('axios');

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

console.log('API_KEY:', API_KEY); 

const ChatGPT = {
  generateResponse: (model, messages, temperature = 0.7, maxTokens = 400) => {
    return new Promise((resolve, reject) => {
      axios.post(
        API_URL,
        {
          model,
          messages,
          temperature,
          max_tokens: maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      .then(response => {
        const { choices, usage } = response.data;
        const result = choices[0].message.content;
        
        console.log(`Response generated successfully
          Model used: ${model}
          Prompt tokens: ${usage.prompt_tokens}
          Completion tokens: ${usage.completion_tokens}
          Total tokens: ${usage.total_tokens}
          Temperature: ${temperature}
          Max tokens: ${maxTokens}`);

        resolve(result);
      })
      .catch(error => {
        console.error('Error generating response:', error);
        reject(error);
      });
    });
  }
};

module.exports = ChatGPT;
