
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users as UsersIcon, Search, Circle } from 'lucide-react';

const Users: React.FC = () => {
  const { allUsers, userBalances } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <UsersIcon className="text-brand-500" />
        Gestión de Usuarios
      </h1>
      
      <div className="bg-dark-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
         <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <h2 className="text-lg font-bold text-white">Usuarios Registrados ({allUsers.length})</h2>
                <p className="text-sm text-gray-400">Lista completa de clientes y sus credenciales.</p>
             </div>
             <div className="relative">
                 <Search className="absolute left-3 top-2.5 text-gray-500 h-4 w-4" />
                 <input 
                    type="text" 
                    placeholder="Buscar usuario..." 
                    className="pl-9 pr-4 py-2 bg-dark-900 border border-gray-600 rounded-lg text-sm text-white focus:border-brand-500 outline-none w-64"
                 />
             </div>
         </div>

         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-400">
                 <thead className="bg-dark-900 text-gray-200 uppercase">
                     <tr>
                         <th className="px-6 py-4">Estado</th>
                         <th className="px-6 py-4">Usuario / Email</th>
                         <th className="px-6 py-4">Contraseña</th>
                         <th className="px-6 py-4 text-right">Saldo Billetera</th>
                         <th className="px-6 py-4">Fecha Registro</th>
                     </tr>
                 </thead>
                 <tbody>
                     {allUsers.map(u => (
                         <tr key={u.id} className="border-b border-gray-700 hover:bg-dark-700/50 transition-colors">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                     <Circle size={10} className={`fill-current ${u.isOnline ? 'text-green-500' : 'text-gray-600'}`} />
                                     <span className={u.isOnline ? 'text-green-400 font-bold' : 'text-gray-500'}>
                                         {u.isOnline ? 'Online' : 'Offline'}
                                     </span>
                                 </div>
                             </td>
                             <td className="px-6 py-4">
                                 <div className="font-bold text-white">{u.name}</div>
                                 <div className="text-xs text-gray-500">{u.email}</div>
                             </td>
                             <td className="px-6 py-4 font-mono text-gray-300">
                                 {u.password || '---'}
                             </td>
                             <td className="px-6 py-4 text-right font-bold text-green-400 font-mono">
                                 {(userBalances[u.email] || u.balance).toFixed(2)} Bs
                             </td>
                             <td className="px-6 py-4 text-xs">
                                 {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : 'N/A'}
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default Users;
