
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import { Copy, CheckCircle, AlertTriangle, Clock, AlertCircle, MessageSquare } from 'lucide-react';

const MySubscriptions: React.FC = () => {
  const { user, subscriptions, reportIssue } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate progress
  const getProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();
    const total = endDate - startDate;
    const elapsed = now - startDate;
    const percent = (elapsed / total) * 100;
    return Math.min(Math.max(percent, 0), 100);
  };

  const getDaysRemaining = (end: string) => {
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();
    const diff = endDate - now;
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  // STRICTLY FILTER SUBSCRIPTIONS BY CURRENT USER
  const mySubscriptions = subscriptions.filter(sub => sub.buyerEmail === user?.email);

  if (mySubscriptions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <AlertCircle className="h-16 w-16 mb-4 text-gray-600" />
            <h2 className="text-xl font-bold text-white">No tienes suscripciones activas</h2>
            <p className="mt-2">Visita el mercado para adquirir tu primer servicio.</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Mis Suscripciones</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mySubscriptions.map((sub) => {
          const isPending = sub.status === 'PENDING';
          const progress = getProgress(sub.purchaseDate, sub.expiryDate);
          const daysLeft = getDaysRemaining(sub.expiryDate);
          const isExpired = daysLeft === 0;

          return (
            <div key={sub.id} className={`bg-dark-800 rounded-2xl p-6 border ${isExpired ? 'border-red-900/50 opacity-75' : isPending ? 'border-yellow-600/50' : 'border-gray-700'} shadow-xl relative overflow-hidden`}>
              
              {/* Status Badge */}
              <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-xs font-bold ${
                  sub.status === 'REPORTED' ? 'bg-yellow-500/20 text-yellow-400' :
                  isPending ? 'bg-orange-500/20 text-orange-400' :
                  isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {sub.status === 'REPORTED' ? 'EN REVISIÓN' : 
                 isPending ? 'PROCESANDO' :
                 isExpired ? 'VENCIDA' : 'ACTIVA'}
              </div>

              <div className="flex items-start gap-4 mb-6">
                <img src={sub.logoUrl} alt={sub.serviceName} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-white">{sub.serviceName}</h3>
                  {sub.profileName && (
                      <span className="text-sm text-brand-400 font-mono bg-brand-900/30 px-2 py-0.5 rounded">
                          {sub.profileName}
                      </span>
                  )}
                  {sub.pin && <span className="ml-2 text-xs text-gray-400">PIN: {sub.pin}</span>}
                </div>
              </div>

              {/* Message from Admin */}
              {sub.adminMessage && (
                <div className="mb-4 bg-blue-900/20 border border-blue-900/50 rounded-lg p-3 flex gap-2 items-start">
                   <MessageSquare size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                   <div>
                      <p className="text-xs text-blue-300 font-bold mb-0.5">Mensaje del Administrador:</p>
                      <p className="text-sm text-gray-300">{sub.adminMessage}</p>
                   </div>
                </div>
              )}

              {/* Credentials Area / Pending State */}
              {isPending ? (
                  <div className="bg-dark-900/50 rounded-lg p-6 mb-6 border border-gray-700/50 flex flex-col items-center justify-center text-center">
                      <Clock className="h-8 w-8 text-orange-400 mb-2 animate-pulse" />
                      <h4 className="text-white font-bold mb-1">Tu pedido está en proceso</h4>
                      <p className="text-xs text-gray-400">El administrador te enviará tus credenciales en breve.</p>
                  </div>
              ) : (
                  <div className="bg-dark-900/50 rounded-lg p-4 mb-6 border border-gray-700 space-y-3">
                     <div className="flex items-center justify-between">
                         <div className="overflow-hidden">
                             <p className="text-xs text-gray-500 uppercase mb-1">Usuario / Correo</p>
                             <p className="text-sm text-white font-mono truncate">{sub.email}</p>
                         </div>
                         <button onClick={() => handleCopy(sub.email, `email-${sub.id}`)} className="text-gray-400 hover:text-white p-1">
                            {copiedId === `email-${sub.id}` ? <CheckCircle size={18} className="text-green-400"/> : <Copy size={18}/>}
                         </button>
                     </div>
                     <div className="h-px bg-gray-700/50"></div>
                     <div className="flex items-center justify-between">
                         <div className="overflow-hidden">
                             <p className="text-xs text-gray-500 uppercase mb-1">Contraseña</p>
                             <p className="text-sm text-white font-mono truncate filter blur-[2px] hover:blur-0 transition-all duration-300 cursor-pointer">{sub.password}</p>
                         </div>
                         <button onClick={() => handleCopy(sub.password || '', `pass-${sub.id}`)} className="text-gray-400 hover:text-white p-1">
                            {copiedId === `pass-${sub.id}` ? <CheckCircle size={18} className="text-green-400"/> : <Copy size={18}/>}
                         </button>
                     </div>
                  </div>
              )}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                   <span className="text-gray-400">Expira en {daysLeft} días</span>
                   <span className="text-gray-500">{new Date(sub.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${daysLeft < 3 ? 'bg-red-500' : 'bg-brand-500'}`} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                    variant="secondary" 
                    className="flex-1 text-xs"
                    onClick={() => window.open('https://netflix.com', '_blank')} // Mock link
                    disabled={isPending}
                >
                    Ir al sitio
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1 text-xs border-red-900/30 text-red-400 hover:bg-red-900/20"
                    onClick={() => reportIssue(sub.id)}
                    disabled={sub.status === 'REPORTED' || isExpired || isPending}
                >
                    <AlertTriangle size={14} className="mr-2" />
                    {sub.status === 'REPORTED' ? 'Reportado' : 'Reportar Fallo'}
                </Button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MySubscriptions;
