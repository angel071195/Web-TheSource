
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Marketplace from './pages/user/Marketplace';
import MySubscriptions from './pages/user/MySubscriptions';
import Wallet from './pages/user/Wallet';
import AdminDashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import AdminWallet from './pages/admin/AdminWallet';
import Chatbot from './components/Chatbot';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Library, CreditCard, Wallet as WalletIcon, Tags } from 'lucide-react';

// Sidebar Component
const SidebarItem = ({ icon: Icon, label, path }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <button 
      onClick={() => navigate(path)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
        active ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-dark-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

const MainLayout: React.FC = () => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-dark-900 border-r border-gray-700 p-4">
          <div className="flex-1">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 mt-2">
              MENÚ PRINCIPAL
            </p>
            
            {user.role === UserRole.ADMIN ? (
              <>
                <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/admin/dashboard" />
                <SidebarItem icon={Tags} label="Precios / Inventario" path="/admin/inventory" />
                <SidebarItem icon={WalletIcon} label="Billetera Admin" path="/admin/wallet" />
              </>
            ) : (
              <>
                <SidebarItem icon={ShoppingBag} label="Catálogo" path="/user/market" />
                <SidebarItem icon={Library} label="Mis Suscripciones" path="/user/subscriptions" />
                <SidebarItem icon={CreditCard} label="Billetera" path="/user/wallet" />
              </>
            )}
          </div>
          
          <div className="p-4 bg-dark-800 rounded-xl border border-gray-700">
            <h4 className="text-xs text-gray-400 font-bold uppercase mb-2">Estado del Sistema</h4>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Operativo
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-dark-900 relative">
          <div className="max-w-7xl mx-auto animate-fade-in">
             <Outlet />
          </div>
        </main>
      </div>

      {/* Chatbot only for users */}
      {user.role === UserRole.USER && <Chatbot />}
    </div>
  );
};

// Wrapper to redirect users based on role
const RoleRedirect: React.FC = () => {
    const { user } = useApp();
    if (!user) return <Navigate to="/login" replace />;
    return user.role === UserRole.ADMIN 
        ? <Navigate to="/admin/dashboard" replace /> 
        : <Navigate to="/user/market" replace />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          
          <Route element={<MainLayout />}>
              <Route path="/" element={<RoleRedirect />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/inventory" element={<Inventory />} />
              <Route path="/admin/wallet" element={<AdminWallet />} />

              {/* User Routes */}
              <Route path="/user/market" element={<Marketplace />} />
              <Route path="/user/subscriptions" element={<MySubscriptions />} />
              <Route path="/user/wallet" element={<Wallet />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

// Helper component to prevent logged-in users from seeing login page
const LoginWrapper = () => {
    const { user } = useApp();
    if (user) {
        return <Navigate to="/" replace />;
    }
    return <Login />;
}

export default App;
