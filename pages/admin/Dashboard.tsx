
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, ShoppingCart, Activity, Bell, Send, Check } from 'lucide-react';
import Button from '../../components/Button';

const AdminDashboard: React.FC = () => {
  const { transactions, services, subscriptions, fulfillSubscription, allUsers } = useApp();

  // Pending subscriptions (waiting for admin to fill credentials)
  const pendingSubscriptions = subscriptions.filter(s => s.status === 'PENDING');
  
  // Real-time Counts from Context (User DB)
  const activeUsersCount = allUsers.filter(u => u.isOnline).length;
  const registeredUsersCount = allUsers.length;
  
  // State for the fulfillment form
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profileName: '',
    message: ''
  });

  const handleOpenOrder = (subId: string) => {
    setSelectedOrder(subId);
    setFormData({ email: '', password: '', profileName: '', message: 'Servicio activo para 1 dispositivo.' });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    fulfillSubscription(selectedOrder, formData);
    setSelectedOrder(null);
  };

  // Mock Data calculation
  const totalRevenue = transactions.filter(t => t.type === 'SALE').reduce((sum, t) => sum + t.amount, 0);
  const totalSales = transactions.filter(t => t.type === 'SALE').length;
  
  const salesData = [
    { name: 'Lun', ventas: 12 },
    { name: 'Mar', ventas: 19 },
    { name: 'Mie', ventas: 3 },
    { name: 'Jue', ventas: 5 },
    { name: 'Vie', ventas: 25 },
    { name: 'Sab', ventas: 32 },
    { name: 'Dom', ventas: 20 },
  ];

  const revenueData = [
    { name: 'Sem 1', ingresos: 400 },
    { name: 'Sem 2', ingresos: 300 },
    { name: 'Sem 3', ingresos: 550 },
    { name: 'Sem 4', ingresos: 800 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-dark-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
            <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Panel de Control</h1>

      {/* PENDING ORDERS NOTIFICATIONS */}
      <div className="bg-gradient-to-r from-gray-900 to-dark-800 rounded-xl border border-brand-500/50 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
        <div className="p-6">
           <div className="flex items-center gap-3 mb-4">
             <div className="relative">
               <Bell className={`h-6 w-6 ${pendingSubscriptions.length > 0 ? 'text-brand-400 animate-pulse' : 'text-gray-500'}`} />
               {pendingSubscriptions.length > 0 && (
                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
               )}
             </div>
             <h2 className="text-xl font-bold text-white">
                Pedidos Pendientes ({pendingSubscriptions.length})
             </h2>
           </div>

           {pendingSubscriptions.length === 0 ? (
             <p className="text-gray-500 text-sm">No hay pedidos pendientes de envío. ¡Buen trabajo!</p>
           ) : (
             <div className="space-y-4">
                {pendingSubscriptions.map(sub => (
                  <div key={sub.id} className="bg-dark-900/50 rounded-lg p-4 border border-gray-700">
                     {selectedOrder === sub.id ? (
                        /* FULFILLMENT FORM */
                        <form onSubmit={handleSubmitOrder} className="space-y-3 animate-fade-in">
                           <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold text-white">Entregar: {sub.serviceName}</h4>
                             <button type="button" onClick={() => setSelectedOrder(null)} className="text-xs text-gray-400 hover:text-white">Cancelar</button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input 
                                placeholder="Correo de la cuenta" 
                                className="bg-dark-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-brand-500 outline-none"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                required
                              />
                              <input 
                                placeholder="Contraseña" 
                                className="bg-dark-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-brand-500 outline-none"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                required
                              />
                              <input 
                                placeholder="Nombre de Perfil (Opcional)" 
                                className="bg-dark-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-brand-500 outline-none"
                                value={formData.profileName}
                                onChange={e => setFormData({...formData, profileName: e.target.value})}
                              />
                              <input 
                                placeholder="Mensaje para el usuario" 
                                className="bg-dark-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-brand-500 outline-none"
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                              />
                           </div>
                           <div className="flex justify-end pt-2">
                              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                                <Send size={14} className="mr-2"/> Enviar y Activar
                              </Button>
                           </div>
                        </form>
                     ) : (
                        /* ORDER SUMMARY */
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                           <div className="flex items-center gap-4">
                             <img src={sub.logoUrl} alt="" className="w-12 h-12 rounded object-cover" />
                             <div>
                               <p className="font-bold text-white">{sub.serviceName}</p>
                               <p className="text-xs text-gray-400">Comprado: {new Date(sub.purchaseDate).toLocaleString()}</p>
                               <span className="text-xs bg-brand-900/50 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30">Pago Recibido</span>
                             </div>
                           </div>
                           <Button onClick={() => handleOpenOrder(sub.id)}>
                              Gestionar Pedido
                           </Button>
                        </div>
                     )}
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ingresos Totales (Ventas)" value={`${totalRevenue.toFixed(2)} Bs`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Ventas Totales" value={totalSales} icon={ShoppingCart} color="bg-blue-500" />
        {/* Updated Active Users Card */}
        <StatCard title="Usuarios Online" value={activeUsersCount} icon={Users} color="bg-green-500" subtext={`${registeredUsersCount} registrados totales`} />
        <StatCard title="Stock Crítico" value={services.filter(s => s.stock < 3).length} icon={Activity} color="bg-red-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Ventas Diarias</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} 
                    itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="ventas" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Tendencia de Ingresos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                     contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} 
                     itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="ingresos" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
