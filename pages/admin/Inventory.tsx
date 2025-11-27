import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import Button from '../../components/Button';
import { Plus, Upload, Edit2, Trash, Save, X, Image as ImageIcon } from 'lucide-react';

const Inventory: React.FC = () => {
  const { services, updateServicePrice, addService } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // New Service Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newServiceData, setNewServiceData] = useState({
    name: '',
    category: ServiceCategory.MOVIES,
    description: '',
    stock: 10,
    price: 0, // Default to 0 ("Próximamente")
    logoUrl: '',
    durationDays: 30
  });

  const handleEditClick = (id: string, currentPrice: number) => {
    setEditingId(id);
    setTempPrice(currentPrice.toString());
  };

  const handleSave = (id: string) => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      updateServicePrice(id, newPrice);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempPrice('');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
        ...newServiceData,
        // Ensure price is treated as a number
        price: Number(newServiceData.price)
    });
    setIsModalOpen(false);
    // Reset form
    setNewServiceData({
        name: '',
        category: ServiceCategory.MOVIES,
        description: '',
        stock: 10,
        price: 0,
        logoUrl: '',
        durationDays: 30
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Gestión de Productos</h1>
          <div className="flex gap-3">
              <Button variant="outline"><Upload size={18} className="mr-2"/> Carga Masiva</Button>
              <Button onClick={() => setIsModalOpen(true)}><Plus size={18} className="mr-2"/> Nuevo Servicio</Button>
          </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-dark-900 text-gray-200 uppercase">
                  <tr>
                      <th className="px-6 py-4">Servicio</th>
                      <th className="px-6 py-4">Categoría</th>
                      <th className="px-6 py-4 text-center">Stock</th>
                      <th className="px-6 py-4 text-right">Precio (Bs)</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  {services.map((service) => (
                      <tr key={service.id} className="border-b border-gray-700 hover:bg-dark-700/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                              <img src={service.logoUrl} alt="" className="w-8 h-8 rounded shadow" />
                              <div>
                                <div className="font-medium text-white">{service.name}</div>
                                {service.isHot && <span className="text-[10px] bg-red-500 text-white px-1.5 rounded inline-block mt-1">HOT</span>}
                              </div>
                          </td>
                          <td className="px-6 py-4">{service.category}</td>
                          <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded font-bold text-xs ${
                                  service.stock > 5 ? 'bg-green-500/20 text-green-400' : 
                                  service.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                                  'bg-red-500/20 text-red-400'
                              }`}>
                                  {service.stock} Disp.
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                              {editingId === service.id ? (
                                <div className="flex justify-end items-center gap-2">
                                  <input 
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    className="w-20 bg-dark-900 border border-brand-500 rounded px-2 py-1 text-white text-right focus:outline-none"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                service.price === 0 ? (
                                    <span className="text-yellow-500 font-bold text-xs bg-yellow-900/20 px-2 py-1 rounded border border-yellow-700/50">
                                        PRÓXIMAMENTE
                                    </span>
                                ) : (
                                    <span className="text-white font-mono font-bold">{service.price.toFixed(2)} Bs</span>
                                )
                              )}
                          </td>
                          <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                  {editingId === service.id ? (
                                    <>
                                      <button onClick={() => handleSave(service.id)} className="p-1.5 bg-green-900/30 hover:bg-green-900/50 rounded text-green-400 transition-colors" title="Guardar"><Save size={16}/></button>
                                      <button onClick={handleCancel} className="p-1.5 bg-red-900/30 hover:bg-red-900/50 rounded text-red-400 transition-colors" title="Cancelar"><X size={16}/></button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => handleEditClick(service.id, service.price)} className="p-1.5 hover:bg-brand-900/30 rounded text-brand-400 transition-colors" title="Editar Precio"><Edit2 size={16}/></button>
                                      <button className="p-1.5 hover:bg-gray-600 rounded text-red-400 transition-colors" title="Eliminar"><Trash size={16}/></button>
                                    </>
                                  )}
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* CREATE SERVICE MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-dark-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <Plus className="text-brand-500" />
                          Agregar Nuevo Servicio
                      </h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                          <X size={24} />
                      </button>
                  </div>

                  <form onSubmit={handleCreateService} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Servicio</label>
                          <input 
                              type="text" 
                              required
                              className="w-full bg-dark-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none"
                              value={newServiceData.name}
                              onChange={e => setNewServiceData({...newServiceData, name: e.target.value})}
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                              <select 
                                  className="w-full bg-dark-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none"
                                  value={newServiceData.category}
                                  onChange={e => setNewServiceData({...newServiceData, category: e.target.value as ServiceCategory})}
                              >
                                  {Object.values(ServiceCategory).map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Stock Inicial</label>
                              <input 
                                  type="number" 
                                  required
                                  min="0"
                                  className="w-full bg-dark-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none"
                                  value={newServiceData.stock}
                                  onChange={e => setNewServiceData({...newServiceData, stock: parseInt(e.target.value)})}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">URL del Logo (Imagen)</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <input 
                                type="url" 
                                required
                                placeholder="https://..."
                                className="w-full bg-dark-900 border border-gray-600 rounded-lg pl-9 pr-3 py-2 text-white focus:border-brand-500 outline-none"
                                value={newServiceData.logoUrl}
                                onChange={e => setNewServiceData({...newServiceData, logoUrl: e.target.value})}
                            />
                          </div>
                          {newServiceData.logoUrl && (
                              <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Vista previa:</span>
                                  <img src={newServiceData.logoUrl} alt="Preview" className="w-8 h-8 rounded object-cover" />
                              </div>
                          )}
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                          <textarea 
                              required
                              className="w-full bg-dark-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-brand-500 outline-none h-20 resize-none"
                              value={newServiceData.description}
                              onChange={e => setNewServiceData({...newServiceData, description: e.target.value})}
                          />
                      </div>

                      <div className="bg-brand-900/20 p-3 rounded-lg border border-brand-500/30">
                          <label className="block text-sm font-medium text-brand-300 mb-1">Precio (Bs)</label>
                          <p className="text-xs text-gray-400 mb-2">Si dejas el precio en 0, se mostrará como "Próximamente".</p>
                          <input 
                              type="number" 
                              min="0"
                              step="0.01"
                              className="w-full bg-dark-900 border border-brand-500 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                              value={newServiceData.price}
                              onChange={e => setNewServiceData({...newServiceData, price: parseFloat(e.target.value)})}
                          />
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                          <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                          <Button type="submit">Guardar Servicio</Button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Inventory;