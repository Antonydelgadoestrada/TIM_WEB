require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/proveedores', require('./routes/proveedores.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/cajas', require('./routes/cajas.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/inventario', require('./routes/inventario.routes'));
app.use('/api/reportes', require('./routes/reportes.routes'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Music Store API funcionando' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}/api/health`);
});
