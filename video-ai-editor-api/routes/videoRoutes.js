const { Storage } = require('@google-cloud/storage');
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuración de Google Cloud Storage
const storage = new Storage({
  keyFilename: './bucket-credentials.json'
});

const bucket = storage.bucket('draft-videos');

// Configurar Multer para almacenamiento en memoria
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Function to initialize Google Cloud Storage
function initializeGoogleCloudStorage() {
  const storage = new Storage({
    keyFilename: './video-ai-editor-api/bucket-credentials.json'
  });
  return storage.bucket('draft-videos');
}

// Function to handle file upload to Google Cloud Storage
async function uploadFileToGCS(file, bucket) {
  const fileName = file.originalname;
  const gcsFile = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false
    });

    stream.on('error', reject);
    stream.on('finish', () => resolve(gcsFile));
    stream.end(file.buffer);
  });
}

// Function to make file public and get public URL
async function makeFilePublicAndGetUrl(file, bucketName) {
  await file.makePublic();
  return `https://storage.googleapis.com/${bucketName}/${file.name}`;
}

// Ruta para subir archivos directamente a Google Cloud Storage
router.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    //const bucket = initializeGoogleCloudStorage();
    //const uploadedFile = await uploadFileToGCS(req.file, bucket);
    //const publicUrl = await makeFilePublicAndGetUrl(uploadedFile, 'draft-videos');

    res.status(200).json({ message: 'File uploaded successfully', url: "" });
  } catch (error) {
    console.error('Error in file upload:', error);
    res.status(500).send('An error occurred during file upload');
  }
});

module.exports = router;