const express = require('express');

require('dotenv').config();

// Ruta para la documentación Swagger
const swaggerSpec = require('./routes/swagger');
const healthRoutes = require('./routes/healthRoutes');
const videoRoutes = require('./routes/videoRoutes');
const productRoutes = require('./routes/productRoutes');
const chatGptRoutes = require('./routes/chatGptRoutes');
// Importar Swagger
const swaggerUi = require('swagger-ui-express');

const cors = require('cors');

const app = express();

const connectDB = require('./config/db');
connectDB();

// Enable CORS for 
app.use(cors({
  origin: 'http://localhost:3001'
}));

// Middlewares
app.use(express.json());
app.use(express.text());

// Rutas
app.use('/api/video', videoRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/chatgpt', chatGptRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api/docs`);
});