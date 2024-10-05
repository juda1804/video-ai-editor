const express = require('express');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Registrar las rutas
app.use('/api/videos', videoRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});