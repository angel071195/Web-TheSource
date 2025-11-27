import React from 'react';
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
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Library, CreditCard, Settings, Wallet as WalletIcon, Tags } from 'lucide-react';

// Sidebar Component specifically for Layout usage
const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
      active ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-dark-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const MainLayout: React.FC = () => {
  const { user } = useApp();
  const [currentView, setCurrentView] = React.useState('dashboard');

  if (!user) return <Login />;

  const renderContent = () => {
    if (user.role === UserRole.ADMIN) {
      switch (currentView) {
        case 'dashboard': return <AdminDashboard />;
        case 'inventory': return <Inventory />;
        case 'admin-wallet': return <AdminWallet />;
        default: return <AdminDashboard />;
      }
    } else {
      switch (currentView) {
        case 'market': return <Marketplace />;
        case 'subs': return <MySubscriptions />;
        case 'wallet': return <Wallet />;
        default: return <Marketplace />;
      }
    }
  };

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
                <SidebarItem 
                  icon={LayoutDashboard} 
                  label="Dashboard" 
                  active={currentView === 'dashboard'} 
                  onClick={() => setCurrentView('dashboard')} 
                />
                <SidebarItem 
                  icon={Tags} 
                  label="Precios / Inventario" 
                  active={currentView === 'inventory'} 
                  onClick={() => setCurrentView('inventory')} 
                />
                <SidebarItem 
                  icon={WalletIcon} 
                  label="Billetera Admin" 
                  active={currentView === 'admin-wallet'} 
                  onClick={() => setCurrentView('admin-wallet')} 
                />
              </>
            ) : (
              <>
                <SidebarItem 
                  icon={ShoppingBag} 
                  label="Catálogo" 
                  active={currentView === 'market'} 
                  onClick={() => setCurrentView('market')} 
                />
                <SidebarItem 
                  icon={Library} 
                  label="Mis Suscripciones" 
                  active={currentView === 'subs'} 
                  onClick={() => setCurrentView('subs')} 
                />
                <SidebarItem 
                  icon={CreditCard} 
                  label="Billetera" 
                  active={currentView === 'wallet'} 
                  onClick={() => setCurrentView('wallet')} 
                />
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
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Chatbot only for users */}
      {user.role === UserRole.USER && <Chatbot />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <MainLayout />
      </Router>
    </AppProvider>
  );
};

export default App;