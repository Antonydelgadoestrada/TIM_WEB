const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.get('/perfil', authMiddleware, authController.perfil);

module.exports = router;
