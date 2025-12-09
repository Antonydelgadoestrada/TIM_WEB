import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getProductos, getCategorias } from '@/lib/api';
import { Music, Search, Filter } from 'lucide-react';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [busqueda, categoriaFiltro]);

  const cargarCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      const params: any = { activo: true };
      if (busqueda) params.busqueda = busqueda;
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      
      const data = await getProductos(params);
      setProductos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Productos - Music Store</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Todos los Productos</h1>

        {/* Filtros */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
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

        {/* Productos */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="card hover:shadow-xl transition-shadow">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                <Music className="w-16 h-16 text-gray-400" />
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {producto.nombre}
              </h3>

              <p className="text-sm text-gray-600 mb-3">{producto.categoria?.nombre}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  ${parseFloat(producto.precioVenta).toFixed(2)}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  producto.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                </span>
              </div>

              <Link
                href={`/productos/${producto.id}`}
                className="w-full btn-primary block text-center"
              >
                Ver Detalles
              </Link>
            </div>
          ))}
        </div>

        {productos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No se encontraron productos</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
