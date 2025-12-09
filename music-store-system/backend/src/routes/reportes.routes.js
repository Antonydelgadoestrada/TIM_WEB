const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/dashboard', authMiddleware, reportesController.dashboard);
router.get('/ventas', authMiddleware, checkRole('ADMIN'), reportesController.reporteVentas);
router.get('/productos-mas-vendidos', authMiddleware, checkRole('ADMIN'), reportesController.productosMasVendidos);

module.exports = router;
