// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Video Intelligence API',
      version: '1.0.0',
      description: 'Documentación de la API para analizar videos usando Google Video Intelligence.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'http://localhost:3000/api/video',
        description: 'Servidor de desarrollo',
      }
    ],
    components: {
        schemas: {
          ErrorResponse: {
            type: 'object',
            properties: {
              success:
              {
                type: 'boolean',
                example: false,
              },
              message:
              {
                type: 'string',
                example: 'Mensaje de error.',
              },
              error:
              {
                type: 'string',
                example: 'Detalle técnico del error.',
              },
            },
          },
        },
    },
  },
  apis: ['./routes/*.js'], // Change this line
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
