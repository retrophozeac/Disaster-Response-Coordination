const express = require('express');
const router = express.Router();
const verificationController = require('./verification.controller');

/**
 * @swagger
 * /verify-image:
 *   post:
 *     summary: Verify a disaster image
 *     description: Uses AI to verify the authenticity of a disaster image.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authentic:
 *                   type: boolean
 *                 confidence:
 *                   type: number
 *                 reasoning:
 *                   type: string
 */
router.post('/', verificationController.verifyImage);

module.exports = router;
