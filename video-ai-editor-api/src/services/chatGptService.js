const { agenteAnalizadorDeOpcionesPrompt } = require('../agents/AgentsPrompt.js');
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

const analizeVideoOptionsByProduct = async (analysis, model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 400) => {
    try {
      const analysisString = JSON.stringify(analysis);
      // Pendiente organizar el prompt para que sea mas facil de leer (Estructurarlo mucho más facil)
      // El promt debe venir de parte del cliente
      const copy = '¿Sabías que la cabeza de tu bebé puede aplanarse si siempre duerme del mismo lado? Este problema es más común de lo que imaginas, pero puede prevenirse fácilmente. Dale a tu bebé el tiempo boca abajo que necesita para fortalecer su cuello y evitar la cabeza plana con el tapete Aqua Magia. ¡Disponible en Glow Store!';
      const prompt = agenteAnalizadorDeOpcionesPrompt.text.replace('{analysis}', analysisString).replace('{copy}', copy);

      const messages = [{ role: 'user', content: prompt }];
      const response = await generateResponse(model, messages, temperature, maxTokens);
      return response;
    } catch (error) {
        logger.error('Error in chatGptService.ask:', error);
        throw error;
    }
}

module.exports = {analizeVideoOptionsByProduct};