import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCajaStore } from '../store/cajaStore';

export default function Header() {
  const { usuario, logout } = useAuthStore();
  const { cajaActiva } = useCajaStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {document.title || 'Music Store POS'}
          </h2>
          {cajaActiva && (
            <p className="text-sm text-green-600 font-medium">
              Caja Abierta - Turno #{cajaActiva.id}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{usuario?.nombre}</p>
              <p className="text-xs text-gray-500">{usuario?.rol}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
