
import React, { useState, useEffect } from 'react';
import { AdminData } from '../types';
import { Button, Badge, Input, VerificationCard } from '../components/UIComponents';
import { ArrowLeft, Check, X, AlertTriangle, Users, CreditCard, PieChart, DollarSign, BarChart3, UserCheck, Search, LayoutDashboard, Settings } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

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

    const [clients, setClients] = useState<any[]>([]);
    const [workers, setWorkers] = useState<any[]>([]);

    // FETCH DATA FROM FIRESTORE
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Clients (Users collection)
                const usersSnap = await getDocs(collection(db, "users"));
                const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setClients(usersData);

                // Fetch Workers (solicitudes_servicio collection)
                const workersSnap = await getDocs(collection(db, "solicitudes_servicio"));
                const workersData = workersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWorkers(workersData);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };
        fetchData();
    }, []);

    const tabs = [
        { id: 'finances', label: 'Finanzas', icon: DollarSign, desc: 'Ingresos y Recargas' },
        { id: 'users', label: 'Usuarios', icon: Users, desc: 'Gestión de Perfiles' },
        { id: 'statistics', label: 'Estadísticas', icon: BarChart3, desc: 'Métricas de Uso' },
        { id: 'payments', label: 'Config. Pagos', icon: Settings, desc: 'Métodos de Cobro' },
    ];

    const handleManualSubmit = () => {
        if(manualWorker && manualAmount) {
            onManualRecharge(manualWorker, parseFloat(manualAmount));
            setManualWorker('');
            setManualAmount('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col">
            {/* Header - Responsive */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-blue-600"/>
                                Administrator Panel
                            </h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistema Operativo
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid lg:grid-cols-12 gap-8">
                
                {/* Sidebar Navigation (Desktop) / Top Grid (Mobile) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 grid grid-cols-2 lg:grid-cols-1 gap-2 sticky top-24">
                        {tabs.map(t => (
                            <button 
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                                    tab === t.id 
                                    ? 'bg-gray-900 text-white shadow-md ring-1 ring-gray-900' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${tab === t.id ? 'bg-white/10' : 'bg-gray-100 text-gray-900'}`}>
                                    <t.icon size={20} />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${tab === t.id ? 'text-white' : 'text-gray-900'}`}>{t.label}</p>
                                    <p className={`text-[10px] ${tab === t.id ? 'text-gray-400' : 'text-gray-400'} hidden lg:block`}>{t.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    
                    {tab === 'finances' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                             {/* Revenue Card */}
                             <div className="lg:col-span-2 bg-gray-900 text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                                 <div className="relative z-10 text-center md:text-left">
                                     <p className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">Ingresos Totales (5%)</p>
                                     <p className="text-5xl lg:text-6xl font-black tracking-tighter">Bs. {adminData.revenue.toFixed(2)}</p>
                                     <p className="text-gray-500 text-sm mt-2">Actualizado en tiempo real</p>
                                 </div>
                                 <div className="relative z-10 flex gap-4">
                                     <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                         <p className="text-xs text-gray-400 font-bold mb-1">MES ACTUAL</p>
                                         <p className="text-xl font-bold">+ Bs. 450.00</p>
                                     </div>
                                 </div>
                                 {/* Decor */}
                                 <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
                                 <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
                             </div>

                             {/* Pending Recharges */}
                             <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm h-fit">
                                 <div className="flex justify-between items-center mb-6">
                                     <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={18} /></div>
                                         Solicitudes ({adminData.pendingRecharges.length})
                                     </h3>
                                 </div>
                                 
                                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                     {adminData.pendingRecharges.length > 0 ? adminData.pendingRecharges.map(tx => (
                                        <div key={tx.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-bold text-gray-900">{tx.workerName}</p>
                                                    <p className="text-xs text-gray-500">{tx.date} • ID: {tx.id.substring(0,4)}</p>
                                                </div>
                                                <Badge color="blue">Bs. {tx.amount}</Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => onApproveRecharge(tx.id)}
                                                    className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-green-600 transition-colors shadow-sm shadow-green-200"
                                                >
                                                    <Check size={14} /> Aprobar
                                                </button>
                                                <button className="flex-1 bg-white border border-red-100 text-red-600 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-red-50 transition-colors">
                                                    <X size={14} /> Rechazar
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-10 opacity-50">
                                            <Check size={40} className="mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm text-gray-500">Todo al día</p>
                                        </div>
                                    )}
                                 </div>
                             </div>

                             {/* Manual Recharge */}
                             <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm h-fit">
                                 <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                     <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CreditCard size={18} /></div>
                                     Recarga Manual
                                 </h3>
                                 <div className="space-y-4">
                                     <Input 
                                        label="Nombre del Trabajador" 
                                        placeholder="Buscar usuario..." 
                                        value={manualWorker}
                                        onChange={e => setManualWorker(e.target.value)}
                                        className="mb-0"
                                     />
                                     <div className="relative">
                                         <label className="block text-sm font-semibold text-gray-900 mb-2">Monto (Bs)</label>
                                         <input 
                                            type="number"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                                            placeholder="0.00"
                                            value={manualAmount}
                                            onChange={e => setManualAmount(e.target.value)}
                                         />
                                     </div>
                                     <Button fullWidth onClick={handleManualSubmit} disabled={!manualWorker || !manualAmount} className="bg-purple-600 hover:bg-purple-700 h-12 text-white shadow-purple-200">
                                         Acreditar Saldo
                                     </Button>
                                 </div>
                             </div>
                        </div>
                    )}

                    {tab === 'users' && (
                        <div className="space-y-8 animate-in fade-in">
                             {/* Tools */}
                             <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                                 <div className="relative w-full md:w-96">
                                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                     <input type="text" placeholder="Buscar por nombre, teléfono o ID..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" />
                                 </div>
                                 <div className="flex gap-2">
                                     <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200">Filtros</button>
                                     <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800">Exportar CSV</button>
                                 </div>
                             </div>

                             <div>
                                 <div className="flex items-center gap-3 mb-6">
                                     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><UserCheck size={24} /></div>
                                     <div>
                                         <h3 className="font-bold text-gray-900 text-xl">Trabajadores Verificados</h3>
                                         <p className="text-gray-500 text-sm">Vista previa de credenciales digitales ({workers.length})</p>
                                     </div>
                                 </div>
                                 
                                 {/* Responsive Grid for Cards */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                     {workers.map(w => (
                                         <div key={w.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                                             <VerificationCard 
                                                name={w.name || 'Sin Nombre'} 
                                                profession={w.professions?.[0] || w.customProfession || 'Trabajador'} 
                                                image={w.image || w.idFront} 
                                                memberId={`MBR-${w.id.substring(0,6).toUpperCase()}`} 
                                             />
                                             <div className="mt-3 flex justify-center gap-2">
                                                 <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50">Ver Detalles</button>
                                                 <button className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100">Suspender</button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                     <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                         <Users size={20} className="text-gray-400"/> Lista de Clientes
                                     </h3>
                                     <Badge color="gray">{clients.length} Registrados</Badge>
                                 </div>
                                 <div className="divide-y divide-gray-50">
                                     {clients.map(c => (
                                         <div key={c.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                             <div className="flex items-center gap-4">
                                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center font-bold text-blue-600 overflow-hidden">
                                                     {c.image ? <img src={c.image} className="w-full h-full object-cover"/> : c.name?.charAt(0)}
                                                 </div>
                                                 <div>
                                                     <p className="font-bold text-gray-900 text-sm">{c.name || 'Usuario'}</p>
                                                     <p className="text-xs text-gray-400">ID: {c.id}</p>
                                                 </div>
                                             </div>
                                             <div className="text-right">
                                                 <p className="text-sm font-medium text-gray-900">{c.phone || c.email || 'Sin contacto'}</p>
                                                 <p className="text-xs text-green-500 font-bold">Activo</p>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    )}

                    {tab === 'statistics' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                             <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                                 <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><PieChart size={20}/> Distribución Mensual</h3>
                                 <div className="space-y-6">
                                     <div className="relative pt-1">
                                         <div className="flex mb-2 items-center justify-between">
                                             <div>
                                                 <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                     Servicios Completados
                                                 </span>
                                             </div>
                                             <div className="text-right">
                                                 <span className="text-xs font-semibold inline-block text-blue-600">145</span>
                                             </div>
                                         </div>
                                         <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-50">
                                             <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                         </div>
                                     </div>
                                     <div className="relative pt-1">
                                         <div className="flex mb-2 items-center justify-between">
                                             <div>
                                                 <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                                     Nuevos Usuarios
                                                 </span>
                                             </div>
                                             <div className="text-right">
                                                 <span className="text-xs font-semibold inline-block text-green-600">32</span>
                                             </div>
                                         </div>
                                         <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-50">
                                             <div style={{ width: "45%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><AlertTriangle size={20} className="text-red-500"/> Auditoría de Riesgo</h3>
                                <div className="space-y-3">
                                    {adminData.jobAudits.map(j => (
                                        <div key={j.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${j.warning ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">{j.service}</h3>
                                                <p className="text-xs text-gray-500">{j.client}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-emerald-600 font-bold block">Bs. {j.amount}</span>
                                                {j.warning && <span className="text-[10px] text-red-600 font-bold uppercase tracking-wide">Revisar</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}

                    {tab === 'payments' && (
                        <div className="animate-in fade-in max-w-2xl">
                            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl"><Settings size={24}/> Configuración de Pagos Admin</h2>
                            <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm mb-6">
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    Estos son los datos bancarios que verán los trabajadores al momento de recargar su saldo.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input label="Cuenta Banco Unión" defaultValue="123456789" />
                                        <Input label="Cuenta Tigo Money" defaultValue="70012345" />
                                    </div>
                                    
                                    <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center bg-gray-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer group">
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 group-hover:text-blue-500">QR de Cobro Actual</p>
                                        <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl shadow-sm">
                                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AdminWallet" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" alt="QR" />
                                        </div>
                                        <Button variant="outline" className="mt-6 mx-auto">Subir Nuevo QR</Button>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <Button fullWidth className="bg-gray-900 hover:bg-black h-12">Guardar Cambios</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
