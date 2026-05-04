const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: Registered successfully
 * 
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     responses:
 *       200:
 *         description: Logged in successfully
 * 
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current logged in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
