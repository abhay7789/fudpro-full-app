const express = require('express');
const router = express.Router();
const userManagementController = require('./userManagement.controller');
const protect = require('../../shared/middleware/auth.middleware');
const authorize = require('../../shared/middleware/rbac.middleware');

router.use(protect, authorize(['ADMIN', 'SUPER_ADMIN']));

/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 * 
 * /api/v1/admin/users/{id}/status:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update user status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/users', userManagementController.getAllUsers);
router.post('/users', userManagementController.createUser);
router.patch('/users/:id/status', userManagementController.updateUserStatus);
router.delete('/users/:id', userManagementController.deleteUser);

module.exports = router;
