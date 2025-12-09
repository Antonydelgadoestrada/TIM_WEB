import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      login(data.usuario, data.token);
      toast.success(`¡Bienvenido ${data.usuario.nombre}!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <Music className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Music Store POS</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">
            Credenciales de prueba:
          </p>
          <p className="text-xs text-gray-500">
            Admin: admin@music.com / admin123
          </p>
          <p className="text-xs text-gray-500">
            Cajero: cajero@music.com / cajero123
          </p>
        </div>
      </div>
    </div>
  );
}
