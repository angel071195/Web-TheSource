
import React, { useState } from 'react';
import { Lock, Unlock, MessageCircle, Wallet, Handshake, ChevronRight, Upload, History, ArrowDownCircle, FileText, MapPin, Clock, Monitor, Briefcase, Phone, User } from 'lucide-react';
import { UserData, Lead, JobPost } from '../types';
import { Button, Input, Badge, TextArea, Modal } from '../components/UIComponents';
import { COLORS } from '../constants';

interface WorkerDashboardProps {
    userData: UserData;
    leads: Lead[];
    onUnlock: (id: string) => void;
    onViewLead: (lead: Lead) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ userData, leads, onUnlock, onViewLead }) => {
    const [activeTab, setActiveTab] = useState<'LOCKED' | 'UNLOCKED'>('LOCKED');

    // Filter logic: Check if lead ID is in the unlocked list
    const unlockedIds = userData.unlockedLeads || [];
    const displayLeads = leads.filter(l => activeTab === 'LOCKED' ? !unlockedIds.includes(l.id) : unlockedIds.includes(l.id));

    return (
        <div className="pb-24 max-w-md mx-auto w-full bg-gray-50 min-h-full">
            <div className="p-6 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Solicitudes</h1>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('LOCKED')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'LOCKED' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Nuevas ({leads.filter(l => !unlockedIds.includes(l.id)).length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('UNLOCKED')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'UNLOCKED' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Desbloqueadas
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {displayLeads.map(lead => (
                    <div key={lead.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${!unlockedIds.includes(lead.id) ? 'bg-blue-600' : 'bg-emerald-500'}`} />
                        <div className="pl-3">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900">{lead.clientName}</h3>
                                    <Badge color="blue">{lead.category}</Badge>
                                </div>
                                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{lead.date}</span>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                                <p className="text-sm text-gray-700 italic line-clamp-2">"{lead.message}"</p>
                            </div>
                            
                            {!unlockedIds.includes(lead.id) ? (
                                <div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1"><Lock size={12}/> Contacto bloqueado</span>
                                        <span className="font-bold text-red-500">-3 Bs</span>
                                    </div>
                                    <Button fullWidth variant="primary" onClick={() => onUnlock(lead.id)} icon={Unlock} className="text-sm h-11">
                                        Desbloquear y Contactar
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    fullWidth 
                                    variant="secondary" 
                                    onClick={() => onViewLead(lead)} 
                                    className="h-11 bg-emerald-600 hover:bg-emerald-700 border-none"
                                >
                                    Ver Perfil y Contactar
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                
                {displayLeads.length === 0 && (
                    <div className="text-center py-12 opacity-50">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="text-gray-300" size={32} />
                        </div>
                        <p className="text-base font-medium text-gray-600">No tienes solicitudes en esta sección.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const LeadDetailView: React.FC<{ lead: Lead, onBack: () => void }> = ({ lead, onBack }) => {
    const [showMsgModal, setShowMsgModal] = useState(false);
    const [msg, setMsg] = useState('');

    const handleWhatsApp = () => {
        const text = `Hola ${lead.clientName}, acepté tu solicitud en The Source App. ¿Cómo puedo ayudarte?`;
        const url = `https://wa.me/591${lead.phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleCall = () => {
        window.open(`tel:${lead.phone}`, '_self');
    };

    return (
        <div className="min-h-full bg-white pb-24">
            <div className="relative h-48 bg-blue-600">
                 <div className="absolute top-4 left-4">
                     <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30">
                        <ChevronRight className="rotate-180" size={24}/>
                     </button>
                 </div>
                 <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                     <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden">
                         {lead.avatar ? <img src={lead.avatar} className="w-full h-full object-cover" /> : <User size={40} className="m-auto mt-8 text-gray-400"/>}
                     </div>
                 </div>
            </div>
            
            <div className="pt-20 px-6 text-center">
                <h1 className="text-2xl font-black text-gray-900 mb-1">{lead.clientName}</h1>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                    <MapPin size={14}/> {lead.location || 'Ubicación no especificada'}
                </div>

                {/* Contact Actions */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <button onClick={handleCall} className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors">
                         <div className="bg-white p-2 rounded-full shadow-sm"><Phone size={20}/></div>
                         <span className="text-xs font-bold">Llamar</span>
                    </button>
                    <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center gap-2 p-3 bg-green-50 text-green-600 rounded-2xl border border-green-100 hover:bg-green-100 transition-colors">
                         <div className="bg-white p-2 rounded-full shadow-sm"><MessageCircle size={20}/></div>
                         <span className="text-xs font-bold">WhatsApp</span>
                    </button>
                    <button onClick={() => setShowMsgModal(true)} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors">
                         <div className="bg-white p-2 rounded-full shadow-sm"><MessageCircle size={20}/></div>
                         <span className="text-xs font-bold">Mensaje</span>
                    </button>
                </div>

                <div className="text-left bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText size={18} /> Detalles de Solicitud
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{lead.message}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presupuesto</span>
                        <Badge color="green">{lead.budget || 'No especificado'}</Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</span>
                        <Badge color="blue">{lead.category}</Badge>
                    </div>
                </div>
            </div>

            <Modal isOpen={showMsgModal} onClose={() => setShowMsgModal(false)} title="Mensaje Interno">
                <TextArea 
                    placeholder="Escribe un mensaje..." 
                    value={msg} 
                    onChange={e => setMsg(e.target.value)} 
                    className="min-h-[120px]"
                />
                <Button fullWidth onClick={() => { alert("Mensaje enviado"); setShowMsgModal(false); }}>Enviar</Button>
            </Modal>
        </div>
    );
};

export const OpportunitiesView: React.FC<{ jobPosts: JobPost[] }> = ({ jobPosts }) => {
    return (
        <div className="pb-24 max-w-md mx-auto w-full bg-gray-100 min-h-full">
            {/* Distinct Header Style for Wall */}
            <div className="p-6 bg-gray-900 sticky top-0 z-10 shadow-md text-white">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-white/10 rounded-lg text-yellow-400">
                         <Monitor size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight">MURO DE EMPLEOS</h1>
                        <p className="text-xs text-gray-400 font-medium">Oportunidades públicas</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {jobPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-xl p-0 shadow-sm border border-gray-200 overflow-hidden">
                        {/* Yellow sticky note accent */}
                        <div className="bg-yellow-50 p-3 border-b border-yellow-100 flex justify-between items-center">
                            <Badge color="gray">{post.category}</Badge>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium"><Clock size={12} /> {post.date}</span>
                        </div>
                        
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{post.title}</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <MapPin size={14} className="text-gray-400" />
                                    {post.location}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <Wallet size={14} className="text-gray-400" />
                                    <span className="font-bold">{post.budget}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                        {post.clientName.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">{post.clientName}</span>
                                 </div>
                                 <button onClick={() => alert("Debes desbloquear el contacto contactando al administrador o enviando una oferta.")} className="text-blue-600 text-xs font-bold hover:underline">
                                     Enviar Oferta
                                 </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="p-6 text-center">
                    <p className="text-xs text-gray-400">Estas solicitudes son públicas.</p>
                </div>
            </div>
        </div>
    );
};

export const WalletView: React.FC<{ userData: UserData, onRecharge: (amount: number) => void }> = ({ userData, onRecharge }) => {
    return (
        <div className="p-6 pb-24 max-w-md mx-auto w-full min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Billetera</h1>
            
            <div className="bg-gray-900 rounded-3xl p-8 mb-8 text-center shadow-xl shadow-gray-300 relative overflow-hidden">
                <div className="relative z-10">
                    {/* QR Display */}
                    <div className="bg-white p-3 rounded-2xl w-32 h-32 mx-auto mb-4 shadow-lg">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AdminRecharge" alt="QR Admin" className="w-full h-full" />
                    </div>
                    <p className="text-gray-400 text-xs font-bold tracking-widest mb-2 uppercase">Saldo Disponible</p>
                    <p className="text-5xl font-black text-white tracking-tight">Bs. {userData.walletBalance.toFixed(2)}</p>
                    <p className="text-gray-500 text-[10px] mt-4 max-w-[200px] mx-auto">Escanea este QR para recargar tu cuenta con el Administrador.</p>
                </div>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-gray-800 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-900 rounded-full opacity-50 blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
                <button className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-row items-center justify-between hover:bg-gray-50 shadow-sm transition-all" onClick={() => alert("Historial de transacciones")}>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><History size={20} /></div>
                        <span className="text-sm font-bold text-gray-700">Historial de Transacciones</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
            </div>

            <h3 className="font-bold text-gray-900 mb-4 ml-1">Recargar Saldo</h3>
            <div className="bg-white rounded-3xl p-6 border border-gray-200 flex flex-col items-center mb-6 shadow-sm">
                 <p className="font-bold text-gray-900 text-lg text-center mb-2">Reportar Pago</p>
                 <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
                     Si ya realizaste la transferencia al QR de arriba o a la cuenta <strong>Banco Unión 12345678</strong>, sube tu comprobante aquí.
                 </p>
                 <Button fullWidth icon={Upload} onClick={() => onRecharge(50)} className="bg-gray-900 text-white">Subir Comprobante</Button>
            </div>
        </div>
    );
};

export const MyServicesPanel: React.FC<{ userData: UserData, onNavigate: (v: string) => void }> = ({ userData, onNavigate }) => {
    return (
        <div className="p-6 pb-24 max-w-md mx-auto w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Panel</h1>
            
            <div className="bg-gray-900 rounded-3xl p-6 mb-6 shadow-lg shadow-gray-200 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-gray-400 text-[10px] font-bold tracking-wider">SALDO ACTUAL</p>
                    <p className="text-white text-4xl font-black my-2">Bs. {userData.walletBalance.toFixed(2)}</p>
                    <button 
                      onClick={() => onNavigate('WALLET')}
                      className="mt-2 bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2 w-fit backdrop-blur-sm"
                    >
                        <Wallet size={14} />
                        Gestionar Billetera
                    </button>
                </div>
                <Wallet size={120} className="absolute -right-4 -bottom-8 text-white opacity-5" />
            </div>

            <div className="space-y-3">
                <button onClick={() => alert("Actualizar Curriculum")} className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-gray-300 hover:shadow-md transition-all group">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors"><FileText size={24} /></div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-900">Curriculum Vitae</p>
                        <p className="text-xs text-gray-500">Actualizar documentos</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                </button>

                <button onClick={() => onNavigate('JOB_CLOSING')} className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all group">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors"><Handshake size={24} /></div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-900">Simular Cierre</p>
                        <p className="text-xs text-gray-500">Calcular comisión y puntos</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                </button>
                
                <button onClick={() => onNavigate('HIRE_MODE')} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-all mt-4">
                    <div className="p-3 bg-white border border-gray-200 text-gray-900 rounded-xl shadow-sm"><ChevronRight size={24} /></div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-900">Contratar Servicios</p>
                        <p className="text-xs text-gray-500">Cambiar a modo Cliente</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export const JobClosingSimulation: React.FC<{ onSuccess: (pts: number) => void, onClose: () => void }> = ({ onSuccess, onClose }) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const numericAmount = parseFloat(amount) || 0;
    const commission = numericAmount * 0.05;
    const netReceive = numericAmount - commission;

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Cierre de Trabajo</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><ArrowDownCircle className="rotate-180" size={20} /></button>
            </div>
            <div className="flex-1 flex flex-col justify-center p-8 text-center">
                {step === 1 ? (
                    <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ingresa Monto Total</h3>
                        <p className="text-gray-400 text-sm mb-8">Monto cobrado al cliente</p>
                        
                        <div className="relative mb-8">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-300">Bs.</span>
                            <input 
                                type="number" 
                                className="w-full text-6xl font-black text-center text-gray-900 placeholder:text-gray-200 outline-none bg-transparent" 
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {numericAmount > 0 && (
                             <div className="bg-gray-50 p-5 rounded-2xl mb-10 text-left space-y-3 border border-gray-100 animate-in slide-in-from-bottom-5">
                                 <div className="flex justify-between text-sm text-gray-500">
                                     <span>Total Servicio:</span>
                                     <span>Bs. {numericAmount.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-sm text-red-500 font-bold">
                                     <span>Comisión App (5%):</span>
                                     <span>- Bs. {commission.toFixed(2)}</span>
                                 </div>
                                 <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-gray-900 text-lg">
                                     <span>Recibes Neto:</span>
                                     <span>Bs. {netReceive.toFixed(2)}</span>
                                 </div>
                             </div>
                        )}
                        <Button fullWidth onClick={() => setStep(2)} disabled={numericAmount <= 0} className="h-14 text-lg">Solicitar Confirmación</Button>
                    </>
                ) : (
                    <div className="animate-in fade-in zoom-in">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Cliente: Confirma Pago</h3>
                        <div className="bg-gray-900 text-white p-8 rounded-[32px] mb-8 shadow-2xl shadow-blue-900/20">
                            <p className="font-bold text-yellow-400 text-xl mb-4 tracking-wide">¡GANA PUNTOS!</p>
                            <p className="text-base opacity-90 leading-relaxed">
                                Si confirmas el pago de <span className="font-bold text-white text-xl">Bs. {amount}</span>, 
                                se te acreditarán:
                            </p>
                            <div className="mt-6 bg-white/10 p-4 rounded-2xl">
                                <span className="font-black text-yellow-400 text-5xl">{Math.floor(Number(amount)/10)}</span>
                                <span className="block text-xs font-bold uppercase tracking-widest mt-1">Puntos</span>
                            </div>
                        </div>
                        <Button fullWidth className="bg-emerald-500 hover:bg-emerald-600 border-none h-14 text-lg shadow-emerald-200" onClick={() => onSuccess(Math.floor(Number(amount)/10))}>
                            Confirmar y Ganar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
