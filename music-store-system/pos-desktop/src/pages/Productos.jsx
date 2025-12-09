import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

export default function Productos() {
  const { usuario } = useAuthStore();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busquedaCategoria, setBusquedaCategoria] = useState('');
  const [showNuevaCategoria, setShowNuevaCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [showNuevoProveedor, setShowNuevoProveedor] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState('');
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoriaId: '',
    proveedorId: '',
    precioCompra: '',
    precioVenta: '',
    stock: '',
    stockMinimo: '',
  });

  const esAdmin = usuario?.rol === 'ADMIN';

  // Función para normalizar texto (sin tildes, minúsculas, sin plural)
  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
      .replace(/s$/i, '') // Eliminar 's' final (plural)
      .trim();
  };

  // Función para capitalizar (Primera letra mayúscula)
  const capitalizarTexto = (texto) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [busqueda, categoriaFiltro]);

  const cargarDatos = async () => {
    try {
      const [categoriasRes, proveedoresRes] = await Promise.all([
        apiClient.get('/categorias'),
        apiClient.get('/proveedores'),
      ]);
      setCategorias(categoriasRes.data);
      setProveedores(proveedoresRes.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    }
  };

  const cargarProductos = async () => {
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append('busqueda', busqueda);
      if (categoriaFiltro) params.append('categoria', categoriaFiltro);
      
      const { data } = await apiClient.get(`/productos?${params}`);
      setProductos(data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  const abrirModal = (producto = null) => {
    if (producto) {
      setEditando(producto);
      setFormData({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        categoriaId: producto.categoriaId,
        proveedorId: producto.proveedorId || '',
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        stock: producto.stock,
        stockMinimo: producto.stockMinimo,
      });
    } else {
      setEditando(null);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoriaId: '',
        proveedorId: '',
        precioCompra: '',
        precioVenta: '',
        stock: '0',
        stockMinimo: '5',
      });
    }
    setBusquedaCategoria('');
    setShowNuevaCategoria(false);
    setShowNuevoProveedor(false);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setBusquedaCategoria('');
    setShowNuevaCategoria(false);
    setNuevaCategoria('');
    setShowNuevoProveedor(false);
    setNuevoProveedor('');
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      toast.error('Ingresa el nombre de la categoría');
      return;
    }

    // Normalizar y capitalizar el nombre
    const nombreCapitalizado = capitalizarTexto(nuevaCategoria.trim());
    const nombreNormalizado = normalizarTexto(nuevaCategoria);

    // Verificar si ya existe (comparando versiones normalizadas)
    const existe = categorias.find(
      cat => normalizarTexto(cat.nombre) === nombreNormalizado
    );
    
    if (existe) {
      toast.error(`Esta categoría ya existe como "${existe.nombre}"`);
      setFormData({ ...formData, categoriaId: existe.id });
      setBusquedaCategoria(existe.nombre);
      setShowNuevaCategoria(false);
      setNuevaCategoria('');
      return;
    }

    try {
      const { data } = await apiClient.post('/categorias', {
        nombre: nombreCapitalizado,
        descripcion: '',
      });
      
      setCategorias([...categorias, data]);
      setFormData({ ...formData, categoriaId: data.id });
      setBusquedaCategoria(data.nombre);
      setShowNuevaCategoria(false);
      setNuevaCategoria('');
      toast.success('Categoría creada correctamente');
    } catch (error) {
      toast.error('Error al crear categoría');
    }
  };

  const crearProveedor = async () => {
    if (!nuevoProveedor.trim()) {
      toast.error('Ingresa el nombre del proveedor');
      return;
    }

    // Normalizar y capitalizar el nombre
    const nombreCapitalizado = capitalizarTexto(nuevoProveedor.trim());
    const nombreNormalizado = normalizarTexto(nuevoProveedor);

    // Verificar si ya existe
    const existe = proveedores.find(
      prov => normalizarTexto(prov.nombre) === nombreNormalizado
    );
    
    if (existe) {
      toast.error(`Este proveedor ya existe como "${existe.nombre}"`);
      setFormData({ ...formData, proveedorId: existe.id });
      setShowNuevoProveedor(false);
      setNuevoProveedor('');
      return;
    }

    try {
      const { data } = await apiClient.post('/proveedores', {
        nombre: nombreCapitalizado,
        descripcion: '',
        telefono: '',
        email: '',
        direccion: '',
      });
      
      setProveedores([...proveedores, data]);
      setFormData({ ...formData, proveedorId: data.id });
      setShowNuevoProveedor(false);
      setNuevoProveedor('');
      toast.success('Proveedor creado. Puedes completar sus datos en Opciones');
    } catch (error) {
      toast.error('Error al crear proveedor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoriaId) {
      toast.error('Debes seleccionar o crear una categoría');
      return;
    }

    try {
      const data = {
        ...formData,
        categoriaId: parseInt(formData.categoriaId),
        proveedorId: formData.proveedorId ? parseInt(formData.proveedorId) : null,
        precioCompra: parseFloat(formData.precioCompra),
        precioVenta: parseFloat(formData.precioVenta),
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo),
      };

      if (editando) {
        await apiClient.put(`/productos/${editando.id}`, data);
        toast.success('Producto actualizado correctamente');
      } else {
        await apiClient.post('/productos', data);
        toast.success('Producto creado correctamente');
      }

      cerrarModal();
      cargarProductos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await apiClient.delete(`/productos/${id}`);
      toast.success('Producto eliminado');
      cargarProductos();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Productos</h1>
        {esAdmin && (
          <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
        )}
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 input-field"
            />
          </div>

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="input-field"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Categoría</th>
                <th className="text-right p-3">Precio Venta</th>
                <th className="text-center p-3">Stock</th>
                <th className="text-center p-3">Estado</th>
                {esAdmin && <th className="text-center p-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{producto.codigo}</td>
                  <td className="p-3 font-medium">{producto.nombre}</td>
                  <td className="p-3">{producto.categoria?.nombre}</td>
                  <td className="p-3 text-right font-bold text-primary-600">
                    ${parseFloat(producto.precioVenta).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      producto.stock > producto.stockMinimo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {producto.stock}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      producto.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {esAdmin && (
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => abrirModal(producto)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editando ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={cerrarModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Código *</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoría *</label>
                  
                  {!showNuevaCategoria ? (
                    <>
                      <select
                        value={formData.categoriaId}
                        onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                        className="input-field mb-2"
                      >
                        <option value="">Seleccionar categoría...</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Botón clickeado, estado actual:', showNuevaCategoria);
                          setShowNuevaCategoria(true);
                          console.log('Estado cambiado a true');
                        }}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                        style={{ pointerEvents: 'auto', zIndex: 10 }}
                      >
                        <Plus className="w-4 h-4" />
                        Crear Nueva Categoría
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 p-4 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">Nueva Categoría</p>
                      <input
                        type="text"
                        placeholder="Nombre de la categoría"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                        className="input-field"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            crearCategoria();
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={crearCategoria}
                          className="btn-primary flex-1"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNuevaCategoria(false);
                            setNuevaCategoria('');
                          }}
                          className="btn-secondary flex-1"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Proveedor</label>
                  
                  {!showNuevoProveedor ? (
                    <>
                      <select
                        value={formData.proveedorId}
                        onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                        className="input-field mb-2"
                      >
                        <option value="">Ninguno</option>
                        {proveedores.map((prov) => (
                          <option key={prov.id} value={prov.id}>
                            {prov.nombre}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowNuevoProveedor(true);
                        }}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Crear Nuevo Proveedor
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 p-4 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">Nuevo Proveedor</p>
                      <input
                        type="text"
                        placeholder="Nombre del proveedor"
                        value={nuevoProveedor}
                        onChange={(e) => setNuevoProveedor(e.target.value)}
                        className="input-field"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            crearProveedor();
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        Podrás agregar teléfono, email y dirección desde Opciones
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={crearProveedor}
                          className="btn-primary flex-1"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNuevoProveedor(false);
                            setNuevoProveedor('');
                          }}
                          className="btn-secondary flex-1"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Precio Compra *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precioCompra}
                      onChange={(e) => setFormData({ ...formData, precioCompra: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Precio Venta *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precioVenta}
                      onChange={(e) => setFormData({ ...formData, precioVenta: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock Inicial *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stock Mínimo *</label>
                    <input
                      type="number"
                      value={formData.stockMinimo}
                      onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={cerrarModal} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editando ? 'Actualizar' : 'Crear'} Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
