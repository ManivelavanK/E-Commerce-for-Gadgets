import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Homepage from "../components/Homepage";
import Products from "../components/Products";
import About from "../components/About";
import Contact from "../components/contact";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import Auth from "../components/Auth";
import Orders from "../components/Orders";
import AdminLayout from "../components/AdminLayout";
import AdminLogin from "../components/AdminLogin";
import AdminDashboard from "../components/AdminDashboard";
import AdminProducts from "../components/AdminProducts";
import AdminOffers from "../components/AdminOffers";
import AdminUsers from "../components/AdminUsers";
import { CartProvider } from "../context/CartContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ProductsProvider } from "../context/ProductsContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin-login' || location.pathname.startsWith('/admin');
  
  // Preserve scroll position between page navigations
  const scrollPositions = React.useRef({});
  
  React.useEffect(() => {
    // Save current scroll position before navigation
    const saveScrollPosition = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
    };
    
    // Restore scroll position after navigation
    const savedPosition = scrollPositions.current[location.pathname];
    if (savedPosition !== undefined) {
      setTimeout(() => window.scrollTo(0, savedPosition), 0);
    }
    
    return saveScrollPosition;
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && <Navbar />}
      <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/home" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/login" element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />) : <Auth />} />
            <Route path="/register" element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />) : <Auth />} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductCard /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
      </Routes>
      {!location.pathname.startsWith('/admin') && location.pathname !== '/login' && location.pathname !== '/register' && <Footer />}
    </div>
  );
}

function AppRouter() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppRouter;
