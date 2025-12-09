const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/', productosController.obtenerProductos);
router.get('/stock-bajo', authMiddleware, productosController.obtenerProductosStockBajo);
router.get('/:id', productosController.obtenerProductoPorId);
router.post('/', authMiddleware, checkRole('ADMIN', 'ALMACEN'), productosController.crearProducto);
router.put('/:id', authMiddleware, checkRole('ADMIN', 'ALMACEN'), productosController.actualizarProducto);
router.delete('/:id', authMiddleware, checkRole('ADMIN'), productosController.eliminarProducto);

module.exports = router;
