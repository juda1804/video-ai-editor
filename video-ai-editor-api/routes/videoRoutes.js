// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { analyzeVideoHandler } = require('../controllers/videoController');

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

module.exports = router;