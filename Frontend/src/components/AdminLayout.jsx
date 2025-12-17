import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navigate } from 'react-router-dom';

function AdminLayout() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={isDarkMode ? 'dark-theme' : 'light-theme'} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminNavbar />
      <main style={{ flex: 1, background: isDarkMode ? '#0f0f23' : '#f8f9fa' }}>
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
}

export default AdminLayout;