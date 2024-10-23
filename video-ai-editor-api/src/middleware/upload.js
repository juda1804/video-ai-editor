
const multer = require('multer');
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 } // Limita el tamaño del archivo a 50MB
  });

module.exports = upload;