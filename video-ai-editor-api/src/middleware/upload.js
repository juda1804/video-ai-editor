
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: {
    files: 10, // Máximo 10 archivos
    fileSize: 50 * 1024 * 1024 // 50MB en bytes
  }
});
module.exports = upload;