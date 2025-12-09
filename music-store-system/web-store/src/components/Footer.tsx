import { Music, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-8 h-8" />
              <h3 className="text-xl font-bold">Music Store</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Tu tienda de confianza para instrumentos musicales y equipos de audio profesional.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-400 hover:text-white text-sm">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Categorías</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Guitarras</li>
              <li>Bajos</li>
              <li>Baterías</li>
              <li>Amplificadores</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@musicstore.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Dirección de la tienda</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Music Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
