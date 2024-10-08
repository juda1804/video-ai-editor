// src/service/ChatGPTIntegration.js
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Verificación de la clave API
console.log('API_KEY:', API_KEY); // Verifica que la clave se está pasando correctamente

const ChatGPT = {
  generateSalesAngles: async (description) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Eres un experto en marketing y ventas, y aplicas los principios de 'Breakthrough Advertising' de Eugene Schwartz." },
            { role: "user", content: `Genera 5 copys de venta persuasivos, cada uno de 20 segundos de duración, para el siguiente producto: ${description}. Los copys deben centrarse en deseo masivo, promesa del producto, urgencia, credibilidad y conexión emocional con el cliente.` }
          ],
          temperature: 0.7,
          max_tokens: 200
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const salesAngles = response.data.choices[0].message.content.split('\n').filter(angle => angle.trim() !== '');
      return salesAngles;
    } catch (error) {
      console.error('Error al generar los copys de venta:', error);
      throw error;
    }
  }
};

export default ChatGPT;