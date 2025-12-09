import { useState, useEffect } from 'react';
import { Receipt, Eye, Search, Filter, X, Calendar, User, DollarSign } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

export default function HistorialVentas() {
  const { usuario } = useAuthStore();
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    usuarioId: '',
    metodoPago: '',
    busqueda: '',
  });
  const [showFiltros, setShowFiltros] = useState(false);

  const esAdmin = usuario?.rol === 'ADMIN';

  useEffect(() => {
    if (esAdmin) {
      cargarDatos();
    }
  }, [esAdmin]);

  useEffect(() => {
    if (esAdmin) {
      cargarVentas();
    }
  }, [filtros, esAdmin]);

  const cargarDatos = async () => {
    try {
      const { data } = await apiClient.get('/usuarios');
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const cargarVentas = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.fechaInicio) params.append('fechaDesde', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaHasta', filtros.fechaFin);
      if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
      if (filtros.metodoPago) params.append('metodoPago', filtros.metodoPago);

      const { data } = await apiClient.get(`/ventas?${params}`);
      setVentas(data);
    } catch (error) {
      toast.error('Error al cargar ventas');
    }
  };

  const verDetalle = async (ventaId) => {
    try {
      const { data } = await apiClient.get(`/ventas/${ventaId}`);
      setVentaSeleccionada(data);
      setShowDetalle(true);
    } catch (error) {
      toast.error('Error al cargar detalle de venta');
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      usuarioId: '',
      metodoPago: '',
      busqueda: '',
    });
  };

  const calcularTotal = (items) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  if (!esAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Solo los administradores pueden ver el historial de ventas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Receipt className="w-8 h-8" />
          Historial de Ventas
        </h1>
        <button
          onClick={() => setShowFiltros(!showFiltros)}
          className="btn-secondary flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          {showFiltros ? 'Ocultar' : 'Mostrar'} Filtros
        </button>
      </div>

      {/* Panel de Filtros */}
      {showFiltros && (
        <div className="card bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fecha Fin</label>
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vendedor</label>
              <select
                value={filtros.usuarioId}
                onChange={(e) => setFiltros({ ...filtros, usuarioId: e.target.value })}
                className="input-field"
              >
                <option value="">Todos</option>
                {usuarios.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Método de Pago</label>
              <select
                value={filtros.metodoPago}
                onChange={(e) => setFiltros({ ...filtros, metodoPago: e.target.value })}
                className="input-field"
              >
                <option value="">Todos</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cliente, producto..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button onClick={limpiarFiltros} className="btn-secondary w-full">
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Ventas</p>
              <p className="text-2xl font-bold text-blue-900">{ventas.length}</p>
            </div>
            <Receipt className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-900">
                ${ventas.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Ticket Promedio</p>
              <p className="text-2xl font-bold text-purple-900">
                ${ventas.length > 0 ? (ventas.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0) / ventas.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3">Vendedor</th>
                <th className="text-left p-3">Método Pago</th>
                <th className="text-right p-3">Total</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    No se encontraron ventas
                  </td>
                </tr>
              ) : (
                ventas.map((venta) => (
                  <tr key={venta.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(venta.fechaVenta).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-gray-500">
                          {new Date(venta.fechaVenta).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{venta.clienteNombre || 'Cliente General'}</div>
                      {venta.clienteTelefono && (
                        <div className="text-sm text-gray-500">{venta.clienteTelefono}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{venta.usuario?.nombre || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          venta.metodoPago === 'EFECTIVO'
                            ? 'bg-green-100 text-green-800'
                            : venta.metodoPago === 'TARJETA'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {venta.metodoPago}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold">
                      ${parseFloat(venta.total || 0).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => verDetalle(venta.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver detalle"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {showDetalle && ventaSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDetalle(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowDetalle(false);
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Detalle de Venta</h2>
                <button
                  onClick={() => setShowDetalle(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Información General */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-medium">
                    {new Date(ventaSeleccionada.fechaVenta).toLocaleString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vendedor</p>
                  <p className="font-medium">{ventaSeleccionada.usuario?.nombre || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-medium">{ventaSeleccionada.clienteNombre || 'Cliente General'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{ventaSeleccionada.clienteTelefono || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método de Pago</p>
                  <p className="font-medium">{ventaSeleccionada.metodoPago}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-lg text-primary-600">
                    ${parseFloat(ventaSeleccionada.total || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="font-bold text-lg mb-3">Productos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Producto</th>
                        <th className="text-center p-2">Cantidad</th>
                        <th className="text-right p-2">Precio</th>
                        <th className="text-right p-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventaSeleccionada.detalles?.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.producto?.nombre || 'N/A'}</td>
                          <td className="p-2 text-center">{item.cantidad}</td>
                          <td className="p-2 text-right">${parseFloat(item.precioUnitario || 0).toFixed(2)}</td>
                          <td className="p-2 text-right font-medium">
                            ${parseFloat(item.subtotal || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td colSpan="3" className="p-2 text-right">
                          TOTAL:
                        </td>
                        <td className="p-2 text-right text-lg text-primary-600">
                          ${parseFloat(ventaSeleccionada.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <button onClick={() => setShowDetalle(false)} className="btn-secondary w-full">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
