import Link from 'next/link';
import { Music, ShoppingCart, Search, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Music Store</h1>
              <p className="text-xs text-gray-600">Instrumentos Musicales</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-700 hover:text-primary-600 font-medium">
              Productos
            </Link>
            <Link href="/categorias" className="text-gray-700 hover:text-primary-600 font-medium">
              Categorías
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-primary-600 font-medium">
              Contacto
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
