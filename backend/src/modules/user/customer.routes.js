const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');
const protect = require('../../shared/middleware/auth.middleware');
const authorize = require('../../shared/middleware/rbac.middleware');

// Routes accessible by USER
router.use(protect, authorize(['USER']));

/**
 * @openapi
 * /api/v1/customers/vendors:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get nearby active vendors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/customers/vendors/{id}/menu:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get vendor menu items
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
router.get('/vendors', customerController.getVendors);
router.get('/vendors/:id/menu', customerController.getVendorMenu);

module.exports = router;
