import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Warehouse, 
  CreditCard, 
  BarChart3, 
  Music,
  Settings,
  Users,
  ClipboardList
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const { usuario } = useAuthStore();
  const esAdmin = usuario?.rol === 'ADMIN';

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Ventas', path: '/ventas' },
    { icon: Warehouse, label: 'Inventario', path: '/inventario' },
    { icon: CreditCard, label: 'Cajas', path: '/cajas' },
    { icon: BarChart3, label: 'Reportes', path: '/reportes' },
    { icon: Settings, label: 'Opciones', path: '/opciones' },
  ];

  if (esAdmin) {
    menuItems.push(
      { icon: ClipboardList, label: 'Historial Ventas', path: '/historial-ventas' },
      { icon: Users, label: 'Usuarios', path: '/usuarios' }
    );
  }

  return (
    <div className="w-64 bg-primary-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-primary-800">
        <Music className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold">Music Store</h1>
          <p className="text-xs text-primary-300">Sistema POS</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
