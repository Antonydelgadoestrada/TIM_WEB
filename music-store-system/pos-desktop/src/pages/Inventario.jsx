import { useEffect, useState } from 'react';
import { Package, Plus, Minus, History, X, Check, Trash2, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

export default function Inventario() {
  const { usuario } = useAuthStore();
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState('menu');
  const [listaMovimientos, setListaMovimientos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [motivoGeneral, setMotivoGeneral] = useState('');
  const [cantidad, setCantidad] = useState('');

  const esAdmin = usuario?.rol === 'ADMIN';

  useEffect(() => {
    cargarProductos();
    if (vista === 'historial') {
      cargarMovimientos();
    }
  }, [vista]);

  const cargarProductos = async () => {
    try {
      const { data } = await apiClient.get('/productos');
      setProductos(data.filter(p => p.activo));
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  const cargarMovimientos = async () => {
    try {
      const { data } = await apiClient.get('/inventario/movimientos');
      setMovimientos(data);
    } catch (error) {
      toast.error('Error al cargar movimientos');
    }
  };

  const abrirModalAgregar = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
    setCantidad('');
  };

  const agregarALista = () => {
    if (!cantidad || parseInt(cantidad) <= 0) {
      toast.error('Ingresa una cantidad válida');
      return;
    }

    const yaExiste = listaMovimientos.find(m => m.producto.id === productoSeleccionado.id);
    if (yaExiste) {
      toast.error('Este producto ya está en la lista');
      return;
    }

    setListaMovimientos([
      ...listaMovimientos,
      {
        producto: productoSeleccionado,
        cantidad: parseInt(cantidad),
      }
    ]);

    toast.success('Producto agregado a la lista');
    cerrarModal();
  };

  const eliminarDeLista = (productoId) => {
    setListaMovimientos(listaMovimientos.filter(m => m.producto.id !== productoId));
  };

  const confirmarMovimientos = async () => {
    if (listaMovimientos.length === 0) {
      toast.error('Agrega al menos un producto');
      return;
    }

    if (!motivoGeneral.trim()) {
      toast.error('Ingresa el motivo general del movimiento');
      return;
    }

    try {
      const tipo = vista === 'entrada' ? 'ENTRADA' : 'SALIDA';
      
      for (const item of listaMovimientos) {
        await apiClient.post('/inventario/movimientos', {
          productoId: item.producto.id,
          tipo: tipo,
          cantidad: item.cantidad,
          motivo: motivoGeneral,
        });
      }

      toast.success(`${tipo} confirmada correctamente`);
      setListaMovimientos([]);
      setMotivoGeneral('');
      setVista('menu');
      cargarProductos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al confirmar movimientos');
    }
  };

  const cancelarMovimientos = () => {
    if (listaMovimientos.length > 0) {
      if (!window.confirm('¿Descartar todos los productos agregados?')) return;
    }
    setListaMovimientos([]);
    setMotivoGeneral('');
    setVista('menu');
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (vista === 'menu') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => esAdmin ? setVista('entrada') : toast.error('Solo admin')}
            className="card hover:shadow-lg transition-all p-8 text-center cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"
          >
            <Plus className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Entrada de Mercadería</h3>
            <p className="text-green-700">Registrar productos que ingresan al inventario</p>
          </button>

          <button
            onClick={() => esAdmin ? setVista('salida') : toast.error('Solo admin')}
            className="card hover:shadow-lg transition-all p-8 text-center cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
          >
            <Minus className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Salida de Mercadería</h3>
            <p className="text-red-700">Registrar productos que salen del inventario</p>
          </button>

          <button
            onClick={() => setVista('historial')}
            className="card hover:shadow-lg transition-all p-8 text-center cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
          >
            <History className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-900 mb-2">Historial</h3>
            <p className="text-blue-700">Ver todos los movimientos registrados</p>
          </button>
        </div>
      </div>
    );
  }

  if (vista === 'entrada' || vista === 'salida') {
    const tipo = vista === 'entrada' ? 'ENTRADA' : 'SALIDA';

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{tipo} de Mercadería</h1>
          <button onClick={cancelarMovimientos} className="btn-secondary">
            ← Volver
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Seleccionar Productos</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 input-field"
                />
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-2">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{producto.nombre}</p>
                      <p className="text-sm text-gray-500">{producto.codigo} | Stock: {producto.stock}</p>
                    </div>
                    <button
                      onClick={() => abrirModalAgregar(producto)}
                      className={`px-3 py-2 text-white rounded flex items-center gap-2 ${
                        vista === 'entrada' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      disabled={listaMovimientos.some(m => m.producto.id === producto.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-lg mb-4">
                Productos en {tipo} ({listaMovimientos.length})
              </h3>

              {listaMovimientos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>No hay productos agregados</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
                    {listaMovimientos.map((item) => (
                      <div key={item.producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.producto.nombre}</p>
                          <p className="text-sm text-gray-500">{item.producto.codigo}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-lg ${
                            vista === 'entrada' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {vista === 'entrada' ? '+' : '-'}{item.cantidad}
                          </span>
                          <button
                            onClick={() => eliminarDeLista(item.producto.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Motivo General *</label>
                    <textarea
                      value={motivoGeneral}
                      onChange={(e) => setMotivoGeneral(e.target.value)}
                      className="input-field mb-4"
                      rows="3"
                      placeholder={`Describe el motivo de esta ${vista}...`}
                    />

                    <button
                      onClick={confirmarMovimientos}
                      className={`w-full flex items-center justify-center gap-2 py-3 text-white rounded font-medium ${
                        vista === 'entrada'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                      CONFIRMAR {tipo} ({listaMovimientos.length} productos)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Agregar Cantidad */}
        {showModal && productoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{productoSeleccionado.nombre}</h2>
                  <button onClick={cerrarModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-100 rounded">
                  <p className="text-sm text-gray-600">Stock Actual</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {productoSeleccionado.stock}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Código: {productoSeleccionado.codigo}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cantidad *</label>
                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      className="input-field"
                      placeholder="Ingresa la cantidad"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button onClick={cerrarModal} className="btn-secondary">
                      Cancelar
                    </button>
                    <button onClick={agregarALista} className="btn-primary">
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historial de Movimientos</h1>
        <button onClick={() => setVista('menu')} className="btn-secondary">
          ← Volver
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Producto</th>
                <th className="text-center p-3">Tipo</th>
                <th className="text-right p-3">Cantidad</th>
                <th className="text-left p-3">Motivo</th>
                <th className="text-left p-3">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {new Date(mov.fecha).toLocaleString('es', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{mov.producto.nombre}</p>
                      <p className="text-sm text-gray-500">{mov.producto.codigo}</p>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mov.tipo === 'ENTRADA'
                        ? 'bg-green-100 text-green-800'
                        : mov.tipo === 'SALIDA'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {mov.tipo}
                    </span>
                  </td>
                  <td className={`p-3 text-right font-bold ${
                    mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.cantidad}
                  </td>
                  <td className="p-3">{mov.motivo}</td>
                  <td className="p-3">{mov.usuario?.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
