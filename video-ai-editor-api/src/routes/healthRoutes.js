// routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const { healthCheckHandler } = require('../controllers/healthController');

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Operaciones para verificar el estado del servicio.
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica si las credenciales tienen permiso para acceder a la API de Video Intelligence.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Las credenciales son válidas y tienen permiso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Las credenciales son válidas y tienen permiso para acceder a la API de Video Intelligence."
 *       401:
 *         description: No autenticado. Credenciales inválidas o expiradas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Permiso denegado. Credenciales sin acceso a la API.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', healthCheckHandler);

module.exports = router;
