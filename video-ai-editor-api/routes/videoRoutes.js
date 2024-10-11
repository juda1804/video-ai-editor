// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { analyzeVideoHandler } = require('../controllers/videoController');

/**
 * @swagger
 * tags:
 *   - name: Video
 *     description: Operaciones relacionadas con análisis de video.
 */

/**
 * @swagger
 * /video/analyze:
 *   post:
 *     summary: Analiza un video utilizando Google Video Intelligence API.
 *     tags:
 *       - Video
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bucketUri:
 *                 type: string
 *                 description: URI del video en Google Cloud Storage.
 *                 example: gs://tu-bucket/tu-video.mp4
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de características para analizar.
 *                 example: ["LABEL_DETECTION", "SPEECH_TRANSCRIPTION"]
 *               languageHints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Pistas de idioma para la transcripción.
 *                 example: ["es-ES"]
 *               context:
 *                 type: object
 *                 description: Configuración adicional para el análisis.
 *                 properties:
 *                   labelDetectionConfig:
 *                     type: object
 *                     properties:
 *                       labelDetectionMode:
 *                         type: string
 *                         example: "SHOT_AND_FRAME_MODE"
 *                       stationaryCamera:
 *                         type: boolean
 *                         example: false
 *                       model:
 *                         type: string
 *                         example: "builtin/latest"
 *     responses:
 *       200:
 *         description: Análisis exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalysisResult'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/analyze', analyzeVideoHandler);

module.exports = router;
