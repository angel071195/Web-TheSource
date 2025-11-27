import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { MonitorPlay, ShieldCheck, User as UserIcon, ArrowRight, Lock } from 'lucide-react';

const ADMIN_EMAILS = [
  'helder.angello0795@gmail.com', 
  'elderangelo071195@gmail.com'
];

const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [isAdminEmail, setIsAdminEmail] = useState(false);

  useEffect(() => {
    const normalizedEmail = email.trim().toLowerCase();
    setIsAdminEmail(ADMIN_EMAILS.includes(normalizedEmail));
  }, [email]);

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(UserRole.USER, email);
  };

  const handleAdminLogin = () => {
    if (!email.trim()) return;
    login(UserRole.ADMIN, email);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
      {/* Background decoration - Christmas Theme (Red/Green) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        <div className="h-20 w-20 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-900/50 mb-6">
            <MonitorPlay className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-center mb-2">Bienvenido a StreamHub</h1>
        <p className="text-gray-400 text-center mb-8">
          Ingresa tu correo electrónico para acceder.
        </p>

        <div className="w-full bg-dark-800 border border-gray-700 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleClientLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-dark-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email.trim()}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-900/30"
            >
              Ingresar como Cliente
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          {/* Admin Option - Conditionally Rendered */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isAdminEmail ? 'max-h-24 opacity-100 mt-6 pt-6 border-t border-gray-700' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-2">
               <p className="text-xs text-gray-400 text-center mb-2 flex items-center justify-center gap-1">
                 <ShieldCheck size={12} className="text-green-400"/>
                 Acceso Administrativo Detectado
               </p>
               <button
                  onClick={handleAdminLogin}
                  className="w-full flex items-center justify-center px-4 py-2 border border-green-500/30 text-sm font-medium rounded-lg text-green-300 hover:bg-green-900/20 hover:text-white transition-colors"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Acceso Administrador
                </button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-600 z-10">© 2025 StreamHub - Edición Navidad 🎄</p>
    </div>
  );
};

export default Login;