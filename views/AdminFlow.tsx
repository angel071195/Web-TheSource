
import React, { useState } from 'react';
import { AdminData } from '../types';
import { Button, Badge, Input } from '../components/UIComponents';
import { ArrowLeft, Check, X, AlertTriangle, Users, CreditCard, PieChart, DollarSign, BarChart3, UserCheck, Search } from 'lucide-react';

interface AdminDashboardProps {
    adminData: AdminData;
    onBack: () => void;
    onApproveRecharge: (id: string) => void;
    onManualRecharge: (worker: string, amount: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminData, onBack, onApproveRecharge, onManualRecharge }) => {
    const [tab, setTab] = useState('finances');
    const [manualWorker, setManualWorker] = useState('');
    const [manualAmount, setManualAmount] = useState('');

    const mockClients = [
        { id: 'c1', name: 'Maria Rodriguez', phone: '70012345' },
        { id: 'c2', name: 'Juan Perez', phone: '70099999' },
    ];
    const mockWorkers = [
        { id: 'w1', name: 'Carlos Mamani', phone: '60012345', profession: 'Electricista' },
        { id: 'w2', name: 'Ana Flores', phone: '60054321', profession: 'Limpieza' },
    ];

    const tabs = [
        { id: 'finances', label: 'Finanzas', icon: DollarSign },
        { id: 'statistics', label: 'Estadísticas', icon: BarChart3 },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'payments', label: 'Pagos', icon: CreditCard },
    ];

    const handleManualSubmit = () => {
        if(manualWorker && manualAmount) {
            onManualRecharge(manualWorker, parseFloat(manualAmount));
            setManualWorker('');
            setManualAmount('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto w-full">
            {/* Aesthetic Header */}
            <div className="px-6 py-5 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-all border border-gray-200 shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase">Administrator Panel</h1>
                <div className="w-10"></div>
            </div>

            {/* Tabs - Fixed Grid */}
            <div className="p-4 grid grid-cols-4 gap-2 bg-white border-b border-gray-100">
                {tabs.map(t => (
                    <button 
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all ${
                            tab === t.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <t.icon size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-6 pb-24">
                {tab === 'finances' && (
                    <div className="space-y-6 animate-in fade-in">
                         <div className="bg-gray-900 text-white p-8 rounded-3xl text-center shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                             <p className="text-gray-400 text-xs font-bold tracking-wider mb-2">INGRESOS TOTALES (5%)</p>
                             <p className="text-5xl font-black">Bs. {adminData.revenue}</p>
                         </div>

                         <div>
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                 <Users size={18} /> Solicitudes de Recarga
                             </h3>
                             {adminData.pendingRecharges.length > 0 ? adminData.pendingRecharges.map(tx => (
                                <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{tx.workerName}</p>
                                            <p className="text-xs text-gray-500">{tx.date} • Comprobante #{tx.id.substring(0,4)}</p>
                                        </div>
                                        <Badge color="blue">Bs. {tx.amount}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onApproveRecharge(tx.id)}
                                            className="flex-1 bg-green-50 text-green-700 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-green-100 transition-colors"
                                        >
                                            <Check size={14} /> Aprobar
                                        </button>
                                        <button className="flex-1 bg-red-50 text-red-700 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-red-100 transition-colors">
                                            <X size={14} /> Rechazar
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-100 rounded-xl border border-dashed border-gray-200">No hay solicitudes pendientes.</p>
                            )}
                         </div>

                         <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                 <CreditCard size={18} /> Recarga Manual
                             </h3>
                             <p className="text-xs text-gray-500 mb-4">Cargar saldo a un trabajador manualmente.</p>
                             <div className="space-y-3">
                                 <Input 
                                    label="Nombre del Trabajador" 
                                    placeholder="Ej. Juan Perez" 
                                    value={manualWorker}
                                    onChange={e => setManualWorker(e.target.value)}
                                    className="mb-0"
                                 />
                                 <Input 
                                    label="Monto a Cargar (Bs)" 
                                    type="number" 
                                    placeholder="0" 
                                    value={manualAmount}
                                    onChange={e => setManualAmount(e.target.value)}
                                    className="mb-0"
                                 />
                                 <Button fullWidth onClick={handleManualSubmit} disabled={!manualWorker || !manualAmount}>
                                     Realizar Recarga
                                 </Button>
                             </div>
                         </div>
                    </div>
                )}

                {tab === 'statistics' && (
                    <div className="space-y-4 animate-in fade-in">
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><PieChart size={20}/> Resumen Mensual</h3>
                             <div className="space-y-4">
                                 <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span>Servicios Completados</span>
                                         <span className="font-bold">145</span>
                                     </div>
                                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-blue-500 w-[70%]"></div>
                                     </div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span>Nuevos Usuarios</span>
                                         <span className="font-bold">32</span>
                                     </div>
                                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-green-500 w-[40%]"></div>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         <h3 className="font-bold text-gray-900 mt-4">Auditoría de Riesgo</h3>
                         {adminData.jobAudits.map(j => (
                            <div key={j.id} className={`bg-white p-4 rounded-2xl border ${j.warning ? 'border-red-200 bg-red-50/50' : 'border-gray-100'} shadow-sm`}>
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-gray-900">{j.service}</h3>
                                    <span className="text-emerald-600 font-bold">Bs. {j.amount}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Cliente: {j.client}</p>
                                {j.warning && (
                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-xs font-bold">
                                        <AlertTriangle size={12} /> Posible Fraude Detectado
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'users' && (
                    <div className="space-y-6 animate-in fade-in">
                         <div className="flex gap-2 mb-2">
                             <Input placeholder="Buscar usuario..." icon={Search} className="mb-0 flex-1" />
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><UserCheck size={18} /> Trabajadores ({mockWorkers.length})</h3>
                             <div className="space-y-2">
                                 {mockWorkers.map(w => (
                                     <div key={w.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                         <div>
                                             <p className="font-bold text-sm">{w.name}</p>
                                             <p className="text-xs text-gray-500">{w.profession}</p>
                                         </div>
                                         <div className="text-right">
                                             <p className="text-xs text-gray-400">{w.phone}</p>
                                             <span className="text-[10px] text-green-600 font-bold">Activo</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Users size={18} /> Clientes ({mockClients.length})</h3>
                             <div className="space-y-2">
                                 {mockClients.map(c => (
                                     <div key={c.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                         <div>
                                             <p className="font-bold text-sm">{c.name}</p>
                                         </div>
                                         <p className="text-xs text-gray-400">{c.phone}</p>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                )}

                {tab === 'payments' && (
                    <div className="animate-in fade-in">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={20}/> Información de Pago Admin</h2>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
                            <p className="text-sm text-gray-500 mb-4">Actualiza los métodos de pago donde los trabajadores recargan su billetera.</p>
                            
                            <div className="space-y-4">
                                <Input label="Cuenta Banco Unión" defaultValue="123456789" />
                                <Input label="Cuenta Tigo Money" defaultValue="70012345" />
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                                    <p className="text-gray-400 text-sm font-bold">QR de Cobro Actual</p>
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AdminWallet" className="w-32 h-32 mx-auto mt-4 opacity-50" alt="QR" />
                                    <Button variant="outline" className="mt-4">Cambiar QR</Button>
                                </div>
                                <Button fullWidth>Guardar Cambios</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
