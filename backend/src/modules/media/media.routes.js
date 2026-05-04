const express = require('express');
const router = express.Router();
const mediaController = require('./media.controller');
const upload = require('../../services/file.service');
const authMiddleware = require('../../shared/middleware/auth.middleware');

/**
 * @openapi
 * /api/v1/media/upload:
 *   post:
 *     tags:
 *       - Media
 *     summary: Upload an image file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Uploaded successfully
 */
router.post('/upload', authMiddleware, upload.single('image'), mediaController.uploadImage);

module.exports = router;
