import { useEffect, useState } from 'react';
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';
import apiClient from '../services/api';
import { useCajaStore } from '../store/cajaStore';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cajaActiva, setCajaActiva } = useCajaStore();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [statsRes, cajaRes] = await Promise.all([
        apiClient.get('/reportes/dashboard'),
        apiClient.get('/cajas/activa'),
      ]);
      
      setStats(statsRes.data);
      setCajaActiva(cajaRes.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {!cajaActiva && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            ⚠️ No hay caja abierta. Dirígete a "Cajas" para abrir una caja antes de realizar ventas.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Ventas Hoy"
          value={`$${stats?.ventasHoy?.total?.toFixed(2) || 0}`}
          subtitle={`${stats?.ventasHoy?.cantidad || 0} transacciones`}
          color="green"
        />
        
        <StatCard
          icon={TrendingUp}
          title="Ventas del Mes"
          value={`$${stats?.ventasMes?.total?.toFixed(2) || 0}`}
          subtitle={`${stats?.ventasMes?.cantidad || 0} transacciones`}
          color="blue"
        />
        
        <StatCard
          icon={Package}
          title="Productos"
          value={stats?.inventario?.totalProductos || 0}
          subtitle={`Valor: $${stats?.inventario?.valorTotal?.toFixed(2) || 0}`}
          color="purple"
        />
        
        <StatCard
          icon={AlertTriangle}
          title="Stock Bajo"
          value={stats?.inventario?.productosStockBajo || 0}
          subtitle="Productos críticos"
          color="red"
        />
      </div>

      {cajaActiva && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Caja Activa</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Turno</p>
              <p className="text-lg font-bold">#{cajaActiva.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monto Inicial</p>
              <p className="text-lg font-bold">${parseFloat(cajaActiva.montoInicial).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Apertura</p>
              <p className="text-lg font-bold">
                {new Date(cajaActiva.fechaApertura).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ventas</p>
              <p className="text-lg font-bold">{cajaActiva.ventas?.length || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  const colors = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
