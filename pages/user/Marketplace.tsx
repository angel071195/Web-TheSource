import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import Button from '../../components/Button';
import { Filter, Zap, ShoppingBag, Clock } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { services, buyService } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [notification, setNotification] = useState<{ msg: string, type: 'success'|'error' } | null>(null);

  const categories = ['ALL', ...Object.values(ServiceCategory)];

  const filteredServices = activeCategory === 'ALL' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const handleBuy = (id: string) => {
    const result = buyService(id);
    setNotification({ msg: result.message, type: result.success ? 'success' : 'error' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Catálogo de Servicios</h1>
        
        {/* Filters */}
        <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              {cat === 'ALL' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in-right border-l-4 ${
            notification.type === 'success' ? 'bg-dark-800 border-green-500 text-green-400' : 'bg-dark-800 border-red-500 text-red-400'
        }`}>
          <p className="font-medium">{notification.msg}</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map(service => {
          const isComingSoon = service.price === 0;
          return (
            <div key={service.id} className="bg-dark-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-500 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
              
              {/* Hot Badge */}
              {service.isHot && !isComingSoon && (
                <div className="absolute top-3 right-3 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Zap size={12} /> FLASH
                </div>
              )}

              {/* Coming Soon Badge */}
              {isComingSoon && (
                  <div className="absolute top-3 right-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Clock size={12} /> PRÓXIMAMENTE
                  </div>
              )}

              {/* Logo & Header */}
              <div className="flex items-center gap-4 mb-4">
                <img src={service.logoUrl} alt={service.name} className={`w-16 h-16 rounded-xl object-cover shadow-lg ${isComingSoon ? 'grayscale opacity-70' : ''}`} />
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight">{service.name}</h3>
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">{service.category}</span>
                </div>
              </div>

              <div className="flex-grow">
                  <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden text-ellipsis">{service.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                      <span>Duración: <span className="text-white">{service.durationDays} días</span></span>
                      {!isComingSoon && (
                          <span className={`${service.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {service.stock > 0 ? `${service.stock} disponibles` : 'Agotado'}
                          </span>
                      )}
                  </div>
              </div>

              {/* Price & Action */}
              <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between">
                  <div>
                      <span className="text-xs text-gray-500 block">Precio</span>
                      {isComingSoon ? (
                          <span className="text-sm font-bold text-yellow-500 italic">Próximamente</span>
                      ) : (
                          <span className="text-2xl font-bold text-white">{service.price.toFixed(2)} Bs</span>
                      )}
                  </div>
                  <Button 
                      onClick={() => handleBuy(service.id)}
                      disabled={service.stock === 0 || isComingSoon}
                      className={`shadow-lg ${service.stock === 0 || isComingSoon ? 'opacity-50' : 'shadow-brand-500/20'}`}
                  >
                      {isComingSoon ? 'No Disponible' : service.stock > 0 ? 'Comprar' : 'Sin Stock'}
                  </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;