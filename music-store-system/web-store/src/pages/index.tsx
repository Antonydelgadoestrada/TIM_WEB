import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getProductos, getCategorias } from '@/lib/api';
import { Music, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [productosData, categoriasData] = await Promise.all([
        getProductos({ activo: true }),
        getCategorias(),
      ]);
      setProductos(productosData.slice(0, 8));
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Music Store - Instrumentos Musicales</title>
        <meta name="description" content="Tienda de instrumentos musicales" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Tu Pasión por la Música Empieza Aquí
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Descubre la mejor selección de instrumentos musicales, equipos de audio y accesorios para músicos profesionales y principiantes.
            </p>
            <Link href="/productos" className="btn-primary inline-flex items-center gap-2">
              Ver Productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Explora por Categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/categorias/${categoria.id}`}
              className="card hover:shadow-xl transition-shadow text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">{categoria.nombre}</h3>
              <p className="text-sm text-gray-600">
                {categoria._count?.productos || 0} productos
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Link href="/productos" className="text-primary-600 font-medium hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <div key={producto.id} className="card hover:shadow-xl transition-shadow">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <Music className="w-16 h-16 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {producto.nombre}
                </h3>

                <p className="text-sm text-gray-600 mb-3">{producto.categoria?.nombre}</p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">
                    ${parseFloat(producto.precioVenta).toFixed(2)}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    producto.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {producto.stock > 0 ? 'Disponible' : 'Agotado'}
                  </span>
                </div>

                <Link
                  href={`/productos/${producto.id}`}
                  className="mt-4 w-full btn-primary block text-center"
                >
                  Ver Detalles
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Calidad Garantizada</h3>
            <p className="text-gray-600">
              Solo trabajamos con las mejores marcas del mercado
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Asesoría Profesional</h3>
            <p className="text-gray-600">
              Nuestro equipo te ayudará a elegir el mejor equipo
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Envío Rápido</h3>
            <p className="text-gray-600">
              Recibe tus productos en tiempo récord
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
