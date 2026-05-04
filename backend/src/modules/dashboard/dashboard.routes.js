const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const protect = require('../../shared/middleware/auth.middleware');
const authorize = require('../../shared/middleware/rbac.middleware');

// Protected routes
router.use(protect);

/**
 * @openapi
 * /api/v1/dashboard/admin:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get admin dashboard data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/dashboard/superadmin:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get superadmin dashboard data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/admin', authorize(['ADMIN', 'SUPER_ADMIN']), dashboardController.getAdminDashboard);
router.get('/superadmin', authorize(['SUPER_ADMIN']), dashboardController.getSuperAdminDashboard);

module.exports = router;
