import { create } from 'zustand';

export const useVentaStore = create((set, get) => ({
  carrito: [],
  
  agregarProducto: (producto) => {
    const { carrito } = get();
    const existe = carrito.find(item => item.productoId === producto.id);
    
    if (existe) {
      set({
        carrito: carrito.map(item =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ),
      });
    } else {
      set({
        carrito: [
          ...carrito,
          {
            productoId: producto.id,
            nombre: producto.nombre,
            precio: parseFloat(producto.precioVenta),
            cantidad: 1,
            stock: producto.stock,
          },
        ],
      });
    }
  },
  
  quitarProducto: (productoId) => {
    set({
      carrito: get().carrito.filter(item => item.productoId !== productoId),
    });
  },
  
  actualizarCantidad: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().quitarProducto(productoId);
      return;
    }
    
    set({
      carrito: get().carrito.map(item =>
        item.productoId === productoId ? { ...item, cantidad } : item
      ),
    });
  },
  
  limpiarCarrito: () => set({ carrito: [] }),
  
  obtenerTotal: () => {
    return get().carrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  },
}));
