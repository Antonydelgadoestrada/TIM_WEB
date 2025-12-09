import { create } from 'zustand';

export const useCajaStore = create((set, get) => ({
  cajaActiva: null,
  
  setCajaActiva: (caja) => set({ cajaActiva: caja }),
  
  clearCaja: () => set({ cajaActiva: null }),
  
  isCajaAbierta: () => {
    const { cajaActiva } = get();
    return cajaActiva && cajaActiva.estado === 'ABIERTA';
  },
}));
