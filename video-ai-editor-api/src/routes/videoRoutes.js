// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { analyzeVideoHandler, uploadVideoHandler, cutVideoHandler } = require('../controllers/videoController');
const upload = require('../middleware/upload');
const { asktoChatGpt} = require('../controllers/chatGptController');

/**
 * @swagger
 * tags:
 *   - name: Video
 *     description: Operaciones relacionadas con análisis de video utilizando Vertex AI.
 */

/**
 * @swagger
 * /video/analyze:
 *   post:
 *     summary: Analiza un video utilizando Vertex AI.
 *     tags:
 *       - Video
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoUri:
 *                 type: string
 *                 description: URI del video en Google Cloud Storage.
 *                 example: gs://draft-videos/tapete-bebe-agua.mp4
 *     responses:
 *       200:
 *         description: Análisis exitoso utilizando Vertex AI.
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

router.post('/upload', upload.array('videos', 10), uploadVideoHandler);

router.get('/ask-chatgpt', asktoChatGpt);

/**
 * @swagger
 * /api/video/cut:
 *   post:
 *     summary: Cut a video
 *     tags: [Video]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bucketUri
 *               - startTime
 *               - endTime
 *             properties:
 *               bucketUri:
 *                 type: string
 *               startTime:
 *                 type: number
 *               endTime:
 *                 type: number
 *     responses:
 *       200:
 *         description: Video cut successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/cut', cutVideoHandler);

module.exports = router;
