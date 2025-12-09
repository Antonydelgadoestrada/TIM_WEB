import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      
      login: (usuario, token) => {
        localStorage.setItem('token', token);
        set({ usuario, token, isAuthenticated: true });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ usuario: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
