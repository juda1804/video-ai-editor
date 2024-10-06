// src/service/ChatGPTIntegration.js

const ChatGPT = {
    generateSalesAngles: async (description) => {
      // Simulamos una llamada a ChatGPT para generar ángulos de venta
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            `¡Mejora tu vida con este increíble producto: ${description}!`,
            `Aprovecha esta oferta única para ${description} y revoluciona tu día a día.`,
            `¿Cansado de lo mismo de siempre? ${description} es lo que necesitas para cambiar.`,
            `${description} está diseñado para ofrecerte la mejor experiencia.`,
          ]);
        }, 1000); // Simulación de un retraso de 1 segundo como si estuviera llamando a una API
      });
    }
  };
  
  export default ChatGPT;
