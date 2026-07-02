const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// ─── Login (Public) ──────────────────────────────────────────────────
router.post('/login', authController.login);

// ─── Verify Token / Get Admin (Protected) ────────────────────────────
router.get('/me', authMiddleware, authController.getMe);

// ─── Change Password (Protected) ─────────────────────────────────────
router.patch('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
