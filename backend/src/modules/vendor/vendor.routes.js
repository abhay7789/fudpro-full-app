const express = require('express');
const router = express.Router();
const vendorController = require('./vendor.controller');
const protect = require('../../shared/middleware/auth.middleware');
const authorize = require('../../shared/middleware/rbac.middleware');

const customerController = require('../user/customer.controller');

// All vendor routes require authentication and VENDOR role
router.use(protect, authorize(['VENDOR']));

/**
 * @openapi
 * /api/v1/vendors/profile:
 *   get:
 *     tags:
 *       - Vendors
 *     summary: Get vendor profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     tags:
 *       - Vendors
 *     summary: Update vendor profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/vendors/menu:
 *   get:
 *     tags:
 *       - Vendors
 *     summary: Get vendor menu items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     tags:
 *       - Vendors
 *     summary: Add new menu item
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 * 
 * /api/v1/vendors/menu/{id}:
 *   put:
 *     tags:
 *       - Vendors
 *     summary: Update a menu item
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
 *         description: Updated
 *   delete:
 *     tags:
 *       - Vendors
 *     summary: Delete a menu item
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
 *         description: Deleted
 * 
 * /api/v1/vendors/categories:
 *   get:
 *     tags:
 *       - Vendors
 *     summary: Get all categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/profile', vendorController.getProfile);
router.put('/profile', vendorController.updateProfile);
router.get('/menu', vendorController.getMenu);
router.post('/menu', vendorController.addMenuItem);
router.put('/menu/:id', vendorController.updateMenuItem);
router.delete('/menu/:id', vendorController.deleteMenuItem);
router.get('/categories', customerController.getCategories);

module.exports = router;
