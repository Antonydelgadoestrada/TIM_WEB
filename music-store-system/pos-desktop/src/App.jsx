import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ventas from './pages/Ventas';
import Productos from './pages/Productos';
import Inventario from './pages/Inventario';
import Cajas from './pages/Cajas';
import Reportes from './pages/Reportes';
import Opciones from './pages/Opciones';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      
      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/cajas" element={<Cajas />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/opciones" element={<Opciones />} />
      </Route>
    </Routes>
  );
}

export default App;
