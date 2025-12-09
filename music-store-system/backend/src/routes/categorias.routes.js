const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/', categoriasController.obtenerCategorias);
router.post('/', authMiddleware, checkRole('ADMIN'), categoriasController.crearCategoria);
router.put('/:id', authMiddleware, checkRole('ADMIN'), categoriasController.actualizarCategoria);
router.delete('/:id', authMiddleware, checkRole('ADMIN'), categoriasController.eliminarCategoria);

module.exports = router;
