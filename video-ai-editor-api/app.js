// app.js
const express = require('express');
const app = express();
require('dotenv').config();

const videoRoutes = require('./routes/videoRoutes');

// Importar Swagger
const swaggerUi = require('swagger-ui-express');


// Middlewares
app.use(express.json());

// Rutas
app.use('/api/video', videoRoutes);
app.use('/api/health', healthRoutes);


// Ruta para la documentación Swagger
const swaggerSpec = require('./routes/swagger');
const healthRoutes = require('./routes/healthRoutes');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api/docs`);
});
