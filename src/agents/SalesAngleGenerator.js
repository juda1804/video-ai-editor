import ChatGPT from '../adapters/ChatGptClient';


const DEFAULT_MODEL = "gpt-3.5-turbo";

const SalesAngleGenerator = {
  generateSalesAngles: async (description) => {
    const messages = [
      { role: "system", content: "Eres un experto en marketing y ventas, y aplicas los principios de 'Breakthrough Advertising' de Eugene Schwartz." },
      { role: "user", content: `Genera 5 copys de venta persuasivos, cada uno de 20 segundos de duración, para el siguiente producto: ${description}. Los copys deben centrarse en deseo masivo, promesa del producto, urgencia, credibilidad y conexión emocional con el cliente.` }
    ];

    try {
      const response = await ChatGPT.generateResponse(DEFAULT_MODEL, messages);
      const salesAngles = response.split('\n').filter(angle => angle.trim() !== '');
      return salesAngles;
    } catch (error) {
      console.error('Error al generar los copys de venta:', error);
      throw error;
    }
  }
};

export default SalesAngleGenerator;