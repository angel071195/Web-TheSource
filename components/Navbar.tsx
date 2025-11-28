
import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Wallet, User as UserIcon, ShoppingCart, MonitorPlay, Menu } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const { user, logout, toggleMobileMenu } = useApp();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-700 bg-dark-900/80 backdrop-blur text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
           {/* Hamburger Menu - Visible on Mobile Only */}
           {user && (
             <button onClick={toggleMobileMenu} className="md:hidden text-gray-300 hover:text-white p-1">
               <Menu className="h-6 w-6" />
             </button>
           )}
          
          <div className="flex items-center gap-2">
            <MonitorPlay className="h-8 w-8 text-brand-500" />
            <span className="text-xl font-bold tracking-tight hidden sm:block">StreamHub</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-dark-800 px-3 py-1.5 rounded-full border border-gray-700">
              <Wallet className="h-4 w-4 text-green-400 mr-2" />
              <span className="font-mono font-bold">{user.balance.toFixed(2)} Bs</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-gray-400 mt-1">{user.role}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={logout} title="Cerrar sesión">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
