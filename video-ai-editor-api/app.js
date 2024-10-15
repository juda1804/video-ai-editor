// app.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configuración de multer para almacenar archivos en una carpeta local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

const upload = multer({ storage: storage });

// Ruta para manejar las cargas de archivos
app.post('/upload', upload.array('files', 10), (req, res) => {
  try {
    res.status(200).json({ message: 'Archivos subidos con éxito', files: req.files });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir archivos', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});