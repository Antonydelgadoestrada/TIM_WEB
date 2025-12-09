import { useState, useEffect } from 'react';
import { Tag, Truck, Plus, Edit, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

export default function Opciones() {
  const { usuario } = useAuthStore();
  const [vista, setVista] = useState('menu'); // menu, categorias, proveedores
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalProveedor, setShowModalProveedor] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    telefono: '',
    email: '',
    direccion: '',
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
    // Cerrar modales cuando cambia la vista
    setShowModalCategoria(false);
    setShowModalProveedor(false);
    setEditando(null);
    
    if (vista === 'categorias') {
      cargarCategorias();
    } else if (vista === 'proveedores') {
      cargarProveedores();
    }
  }, [vista]);

  const cargarCategorias = async () => {
    try {
      const { data } = await apiClient.get('/categorias');
      setCategorias(data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    }
  };

  const cargarProveedores = async () => {
    try {
      const { data } = await apiClient.get('/proveedores');
      setProveedores(data);
    } catch (error) {
      toast.error('Error al cargar proveedores');
    }
  };

  const abrirModal = (tipo, item = null) => {
    if (item) {
      setEditando(item);
      if (tipo === 'categoria') {
        setFormData({
          nombre: item.nombre,
          descripcion: item.descripcion || '',
        });
      } else {
        setFormData({
          nombre: item.nombre,
          descripcion: item.descripcion || '',
          telefono: item.telefono || '',
          email: item.email || '',
          direccion: item.direccion || '',
        });
      }
    } else {
      setEditando(null);
      setFormData({
        nombre: '',
        descripcion: '',
        telefono: '',
        email: '',
        direccion: '',
      });
    }
    
    if (tipo === 'categoria') {
      setShowModalCategoria(true);
    } else {
      setShowModalProveedor(true);
    }
  };

  const cerrarModal = () => {
    setShowModalCategoria(false);
    setShowModalProveedor(false);
    setEditando(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (vista === 'categorias') {
        // Normalizar y capitalizar el nombre
        const nombreCapitalizado = capitalizarTexto(formData.nombre.trim());
        const nombreNormalizado = normalizarTexto(formData.nombre);

        // Verificar duplicados (ignorando el item actual si está editando)
        const duplicado = categorias.find(
          cat => cat.id !== editando?.id && normalizarTexto(cat.nombre) === nombreNormalizado
        );
        
        if (duplicado) {
          toast.error(`Esta categoría ya existe como "${duplicado.nombre}"`);
          return;
        }

        const data = {
          nombre: nombreCapitalizado,
          descripcion: formData.descripcion,
        };

        if (editando) {
          await apiClient.put(`/categorias/${editando.id}`, data);
          toast.success('Categoría actualizada');
        } else {
          await apiClient.post('/categorias', data);
          toast.success('Categoría creada');
        }
        cargarCategorias();
      } else {
        // Capitalizar nombre del proveedor también
        const nombreCapitalizado = capitalizarTexto(formData.nombre.trim());
        const nombreNormalizado = normalizarTexto(formData.nombre);

        // Verificar duplicados
        const duplicado = proveedores.find(
          prov => prov.id !== editando?.id && normalizarTexto(prov.nombre) === nombreNormalizado
        );
        
        if (duplicado) {
          toast.error(`Este proveedor ya existe como "${duplicado.nombre}"`);
          return;
        }

        const data = {
          nombre: nombreCapitalizado,
          descripcion: formData.descripcion,
          telefono: formData.telefono,
          email: formData.email,
          direccion: formData.direccion,
        };

        if (editando) {
          await apiClient.put(`/proveedores/${editando.id}`, data);
          toast.success('Proveedor actualizado');
        } else {
          await apiClient.post('/proveedores', data);
          toast.success('Proveedor creado');
        }
        cargarProveedores();
      }
      cerrarModal();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar?')) return;

    try {
      if (vista === 'categorias') {
        await apiClient.delete(`/categorias/${id}`);
        toast.success('Categoría eliminada');
        cargarCategorias();
      } else {
        await apiClient.delete(`/proveedores/${id}`);
        toast.success('Proveedor eliminado');
        cargarProveedores();
      }
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  // Menú principal
  if (vista === 'menu') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Opciones del Sistema</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setVista('categorias')}
            className="card hover:shadow-lg transition-all p-8 text-center cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200"
          >
            <Tag className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-900 mb-2">Categorías</h3>
            <p className="text-purple-700">Gestionar categorías de productos</p>
          </button>

          <button
            onClick={() => setVista('proveedores')}
            className="card hover:shadow-lg transition-all p-8 text-center cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200"
          >
            <Truck className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-orange-900 mb-2">Proveedores</h3>
            <p className="text-orange-700">Gestionar proveedores de mercadería</p>
          </button>
        </div>
      </div>
    );
  }

  // Vista de Categorías
  if (vista === 'categorias') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Categorías</h1>
          <div className="flex gap-3">
            {esAdmin && (
              <button 
                onClick={() => abrirModal('categoria')} 
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nueva Categoría
              </button>
            )}
            <button onClick={() => setVista('menu')} className="btn-secondary">
              ← Volver
            </button>
          </div>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Descripción</th>
                  {esAdmin && <th className="text-center p-3">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{cat.nombre}</td>
                    <td className="p-3">{cat.descripcion || '-'}</td>
                    {esAdmin && (
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => abrirModal('categoria', cat)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminar(cat.id)}
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

        {/* Modal Categorías */}
        {showModalCategoria && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) cerrarModal();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cerrarModal();
            }}
          >
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editando ? 'Editar' : 'Nueva'} Categoría
                  </h2>
                  <button onClick={cerrarModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="input-field"
                      required
                      autoFocus
                    />
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

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn-primary flex-1">
                      {editando ? 'Actualizar' : 'Crear'}
                    </button>
                    <button type="button" onClick={cerrarModal} className="btn-secondary flex-1">
                      Cancelar
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

  // Vista de Proveedores
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Proveedores</h1>
        <div className="flex gap-3">
          {esAdmin && (
            <button onClick={() => abrirModal('proveedor')} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nuevo Proveedor
            </button>
          )}
          <button onClick={() => setVista('menu')} className="btn-secondary">
            ← Volver
          </button>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Teléfono</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Dirección</th>
                {esAdmin && <th className="text-center p-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {proveedores.map((prov) => (
                <tr key={prov.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{prov.nombre}</td>
                  <td className="p-3">{prov.telefono || '-'}</td>
                  <td className="p-3">{prov.email || '-'}</td>
                  <td className="p-3">{prov.direccion || '-'}</td>
                  {esAdmin && (
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => abrirModal('proveedor', prov)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminar(prov.id)}
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

      {/* Modal Proveedores */}
      {showModalProveedor && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') cerrarModal();
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editando ? 'Editar' : 'Nuevo'} Proveedor
                </h2>
                <button onClick={cerrarModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form 
                onSubmit={handleSubmit} 
                className="space-y-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              >
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

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>

                {vista === 'proveedores' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <input
                        type="text"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Dirección</label>
                      <input
                        type="text"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={cerrarModal} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editando ? 'Actualizar' : 'Crear'}
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
