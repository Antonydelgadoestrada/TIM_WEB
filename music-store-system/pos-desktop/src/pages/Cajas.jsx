import { useState } from 'react';
import { useCajaStore } from '../store/cajaStore';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

export default function Cajas() {
  const [montoInicial, setMontoInicial] = useState('');
  const [montoFinal, setMontoFinal] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const { cajaActiva, setCajaActiva, clearCaja } = useCajaStore();

  const abrirCaja = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/cajas/abrir', {
        montoInicial: parseFloat(montoInicial),
      });
      setCajaActiva(data);
      toast.success('Caja abierta correctamente');
      setMontoInicial('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al abrir caja');
    }
  };

  const cerrarCaja = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/cajas/${cajaActiva.id}/cerrar`, {
        montoFinal: parseFloat(montoFinal),
        observaciones,
      });
      toast.success('Caja cerrada correctamente');
      clearCaja();
      setMontoFinal('');
      setObservaciones('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al cerrar caja');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Cajas</h1>

      {!cajaActiva ? (
        <div className="card max-w-md">
          <h2 className="text-xl font-bold mb-4">Abrir Caja</h2>
          <form onSubmit={abrirCaja} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Monto Inicial</label>
              <input
                type="number"
                step="0.01"
                value={montoInicial}
                onChange={(e) => setMontoInicial(e.target.value)}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>
            <button type="submit" className="w-full btn-success">
              Abrir Caja
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Caja Activa</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Turno</p>
                <p className="text-2xl font-bold">#{cajaActiva.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monto Inicial</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${parseFloat(cajaActiva.montoInicial).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hora de Apertura</p>
                <p className="text-lg">
                  {new Date(cajaActiva.fechaApertura).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ventas Realizadas</p>
                <p className="text-2xl font-bold">{cajaActiva.ventas?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Cerrar Caja</h2>
            <form onSubmit={cerrarCaja} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monto Final</label>
                <input
                  type="number"
                  step="0.01"
                  value={montoFinal}
                  onChange={(e) => setMontoFinal(e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Notas adicionales..."
                />
              </div>
              <button type="submit" className="w-full btn-danger">
                Cerrar Caja
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
