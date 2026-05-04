const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');

router.use(authMiddleware);

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/orders/{id}/status:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update order status
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
 *         description: Status updated
 */
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
