import ChatGPT from '../adapters/ChatGptClient';


const DEFAULT_MODEL = "gpt-3.5-turbo";

const parseSalesAngles = (response) => {
  const match = response.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    const jsonString = match[1];
    console.log('JSON String:', jsonString); // Log the JSON string for debugging
    return JSON.parse(jsonString);
  } else {
    throw new Error('No JSON response found in the expected format.');
  }
};

const SalesAngleGenerator = {
  generateSalesAngles: async (description) => {
    const messages = [
      { role: "system", content: "Eres un experto en marketing y ventas, y aplicas los principios de 'Breakthrough Advertising' de Eugene Schwartz." },
      { role: "system", content: "Devuelve la respuesta en formato JSON. La respuesta debe ser un array de strings, donde cada string representa un copy de venta persuasivo." },
      { role: "user", content: `Genera 5 copys de venta persuasivos, cada uno de 20 segundos de duración, para el siguiente producto: ${description}. Los copys deben centrarse en deseo masivo, promesa del producto, urgencia, credibilidad y conexión emocional con el cliente.` }
    ];

    try {
      const response = await ChatGPT.generateResponse(DEFAULT_MODEL, messages);
      const salesAngles = parseSalesAngles(response);
      return salesAngles;
    } catch (error) {
      console.error('Error al generar los copys de venta:', error);
      throw error;
    }
  }
};

export default SalesAngleGenerator;
