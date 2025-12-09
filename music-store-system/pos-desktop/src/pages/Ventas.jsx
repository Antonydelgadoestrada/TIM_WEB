import { useEffect, useState } from 'react';
import { Search, Plus, Minus, Trash2, DollarSign } from 'lucide-react';
import { useVentaStore } from '../store/ventaStore';
import { useCajaStore } from '../store/cajaStore';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [loading, setLoading] = useState(false);
  
  const { carrito, agregarProducto, quitarProducto, actualizarCantidad, limpiarCarrito, obtenerTotal } = useVentaStore();
  const { cajaActiva } = useCajaStore();

  useEffect(() => {
    cargarProductos();
  }, [busqueda]);

  const cargarProductos = async () => {
    try {
      const { data } = await apiClient.get(`/productos?activo=true&busqueda=${busqueda}`);
      setProductos(data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  const realizarVenta = async () => {
    if (!cajaActiva) {
      toast.error('Debes abrir una caja antes de realizar ventas');
      return;
    }

    if (carrito.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setLoading(true);
    try {
      const ventaData = {
        cajaId: cajaActiva.id,
        productos: carrito.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
        })),
        metodoPago,
      };

      await apiClient.post('/ventas', ventaData);
      toast.success('¡Venta realizada con éxito!');
      limpiarCarrito();
      cargarProductos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al realizar venta');
    } finally {
      setLoading(false);
    }
  };

  const total = obtenerTotal();

  return (
    <div className="h-full flex gap-6">
      {/* Productos */}
      <div className="flex-1 space-y-4">
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {productos.slice(0, 12).map((producto) => (
            <button
              key={producto.id}
              onClick={() => agregarProducto(producto)}
              disabled={producto.stock === 0}
              className="card hover:shadow-lg transition-shadow text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 line-clamp-2">{producto.nombre}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  producto.stock > producto.stockMinimo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Stock: {producto.stock}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{producto.codigo}</p>
              <p className="text-2xl font-bold text-primary-600">
                ${parseFloat(producto.precioVenta).toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-96 space-y-4">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
          
          <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
            {carrito.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Carrito vacío</p>
            ) : (
              carrito.map((item) => (
                <div key={item.productoId} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.nombre}</p>
                    <p className="text-primary-600 font-bold">${item.precio.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => quitarProducto(item.productoId)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="input-field"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="MIXTO">Mixto</option>
              </select>
            </div>

            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Total:</span>
                <span className="text-3xl font-bold text-primary-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={realizarVenta}
              disabled={loading || carrito.length === 0 || !cajaActiva}
              className="w-full btn-success flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <DollarSign className="w-5 h-5" />
              {loading ? 'Procesando...' : 'Completar Venta'}
            </button>

            {carrito.length > 0 && (
              <button
                onClick={limpiarCarrito}
                className="w-full btn-secondary mt-2"
              >
                Limpiar Carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
