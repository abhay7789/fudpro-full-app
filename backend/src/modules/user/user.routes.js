const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');

router.use(authMiddleware);

// Profile
/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 * 
 * /api/v1/users/profile/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password updated
 */
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/profile/password', userController.changePassword);

// Address
/**
 * @openapi
 * /api/v1/users/address:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     tags:
 *       - Users
 *     summary: Add new address
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Address added
 * 
 * /api/v1/users/address/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update an address
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
 *         description: Address updated
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete an address
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
 *         description: Address deleted
 */
router.get('/address', userController.getAddresses);
router.post('/address', userController.addAddress);
router.put('/address/:id', userController.updateAddress);
router.delete('/address/:id', userController.deleteAddress);

module.exports = router;
