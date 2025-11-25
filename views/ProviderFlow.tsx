
import React, { useState, useRef } from 'react';
import { Lock, Unlock, MessageCircle, Wallet, Handshake, ChevronRight, Upload, History, ArrowDownCircle, FileText, MapPin, Clock, Monitor, Briefcase, Phone, User, Calendar, DollarSign, Filter, Trash2, Plus, X, Download, File, Loader2 } from 'lucide-react';
import { UserData, Lead, JobPost, UserDocument } from '../types';
import { Button, Input, Badge, TextArea, Modal } from '../components/UIComponents';
import { COLORS } from '../constants';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
        <div className="pb-24 w-full max-w-7xl mx-auto">
            <div className="p-6 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Trabajo</h1>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('LOCKED')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'LOCKED' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Nuevas ({leads.filter(l => !unlockedIds.includes(l.id)).length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('UNLOCKED')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'UNLOCKED' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Desbloqueadas
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayLeads.map(lead => (
                        <div key={lead.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full">
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${!unlockedIds.includes(lead.id) ? 'bg-blue-600' : 'bg-emerald-500'}`} />
                            <div className="pl-2 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <Badge color="blue">{lead.category}</Badge>
                                        <h3 className="font-bold text-gray-900 text-lg mt-2">{lead.clientName}</h3>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100 flex items-center gap-1">
                                        <Clock size={10} /> {lead.date}
                                    </span>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4 flex-1">
                                    <p className="text-sm text-gray-700 italic leading-relaxed">"{lead.message}"</p>
                                </div>
                                
                                <div className="mt-auto">
                                    {!unlockedIds.includes(lead.id) ? (
                                        <div>
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3 bg-red-50 p-2 rounded-lg">
                                                <span className="flex items-center gap-1 font-medium text-red-600"><Lock size={12}/> Bloqueado</span>
                                                <span className="font-bold text-red-600">-3 Bs</span>
                                            </div>
                                            <Button fullWidth variant="primary" onClick={() => onUnlock(lead.id)} icon={Unlock} className="text-sm h-12 shadow-blue-200">
                                                Desbloquear
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            fullWidth 
                                            variant="secondary" 
                                            onClick={() => onViewLead(lead)} 
                                            className="h-12 bg-emerald-600 hover:bg-emerald-700 border-none shadow-emerald-200"
                                        >
                                            Ver Perfil y Contactar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {displayLeads.length === 0 && (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="text-gray-300" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Está tranquilo por aquí</h3>
                        <p className="text-base font-medium text-gray-500">No tienes solicitudes en esta sección.</p>
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
        <div className="min-h-full bg-white pb-24 w-full max-w-4xl mx-auto">
            <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-500 lg:rounded-b-[40px]">
                 <div className="absolute top-6 left-6">
                     <button onClick={onBack} className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 flex items-center gap-2 font-bold transition-all">
                        <ChevronRight className="rotate-180" size={20}/> Volver
                     </button>
                 </div>
                 <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                     <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gray-200 overflow-hidden">
                         {lead.avatar ? <img src={lead.avatar} className="w-full h-full object-cover" /> : <User size={40} className="m-auto mt-8 text-gray-400"/>}
                     </div>
                 </div>
            </div>
            
            <div className="pt-20 px-6 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-gray-900 mb-1">{lead.clientName}</h1>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-8 font-medium">
                    <MapPin size={16} className="text-blue-500"/> {lead.location || 'Ubicación no especificada'}
                </div>

                {/* Contact Actions */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <button onClick={handleCall} className="flex flex-col items-center justify-center gap-2 p-5 bg-blue-50 text-blue-600 rounded-3xl border border-blue-100 hover:bg-blue-100 hover:-translate-y-1 transition-all shadow-sm">
                         <div className="bg-white p-3 rounded-full shadow-sm"><Phone size={24}/></div>
                         <span className="text-xs font-bold uppercase tracking-wider">Llamar</span>
                    </button>
                    <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center gap-2 p-5 bg-green-50 text-green-600 rounded-3xl border border-green-100 hover:bg-green-100 hover:-translate-y-1 transition-all shadow-sm">
                         <div className="bg-white p-3 rounded-full shadow-sm"><MessageCircle size={24}/></div>
                         <span className="text-xs font-bold uppercase tracking-wider">WhatsApp</span>
                    </button>
                    <button onClick={() => setShowMsgModal(true)} className="flex flex-col items-center justify-center gap-2 p-5 bg-gray-50 text-gray-600 rounded-3xl border border-gray-100 hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-sm">
                         <div className="bg-white p-3 rounded-full shadow-sm"><MessageCircle size={24}/></div>
                         <span className="text-xs font-bold uppercase tracking-wider">Mensaje</span>
                    </button>
                </div>

                <div className="text-left bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20} /></div>
                        Detalles de Solicitud
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl italic border border-gray-100">"{lead.message}"</p>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                             <span className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Presupuesto</span>
                             <span className="text-lg font-black text-green-900">{lead.budget || 'N/A'}</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                             <span className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Categoría</span>
                             <span className="text-lg font-black text-blue-900">{lead.category}</span>
                        </div>
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
        <div className="pb-24 w-full bg-gray-100 min-h-screen">
            {/* Distinct Header Style for Wall */}
            <div className="p-8 bg-gray-900 text-white mb-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-yellow-400">
                         <Monitor size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">MURO DE EMPLEOS</h1>
                        <p className="text-sm text-gray-400 font-medium">Oportunidades públicas de clientes</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                 {/* Masonry-like Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                            {/* Yellow sticky note accent */}
                            <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
                                <Badge color="gray">{post.category}</Badge>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1 font-bold uppercase tracking-wide"><Clock size={12} /> {post.date}</span>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 text-xl leading-tight mb-3">{post.title}</h3>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed flex-1">{post.description}</p>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                        <MapPin size={16} className="text-gray-400" />
                                        {post.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                        <Wallet size={16} className="text-gray-400" />
                                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{post.budget}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                     <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
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
                </div>

                <div className="p-10 text-center">
                    <p className="text-sm text-gray-400">Estas solicitudes son públicas y visibles para todos los trabajadores.</p>
                </div>
            </div>
        </div>
    );
};

export const WalletView: React.FC<{ userData: UserData, onRecharge: (amount: number) => void }> = ({ userData, onRecharge }) => {
    return (
        <div className="p-6 pb-24 w-full max-w-5xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Billetera</h1>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Balance Card */}
                <div className="bg-gray-900 rounded-[32px] p-10 text-center shadow-2xl shadow-gray-400 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative z-10 w-full">
                        <div className="bg-white p-4 rounded-3xl w-48 h-48 mx-auto mb-8 shadow-xl">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AdminRecharge" alt="QR Admin" className="w-full h-full" />
                        </div>
                        <p className="text-gray-400 text-sm font-bold tracking-[0.2em] mb-4 uppercase">Saldo Disponible</p>
                        <p className="text-6xl font-black text-white tracking-tighter mb-4">Bs. {userData.walletBalance.toFixed(2)}</p>
                        <p className="text-gray-500 text-xs max-w-xs mx-auto">Escanea este QR para recargar tu cuenta con el Administrador.</p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gray-800 rounded-full opacity-50 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-900 rounded-full opacity-50 blur-[100px]"></div>
                </div>

                {/* Actions & History */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-200 shadow-sm">
                         <h3 className="font-bold text-gray-900 text-xl mb-2">Recargar Saldo</h3>
                         <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                             Si ya realizaste la transferencia al QR o a la cuenta <strong>Banco Unión 12345678</strong>, sube tu comprobante aquí para que el administrador lo valide.
                         </p>
                         <Button fullWidth icon={Upload} onClick={() => onRecharge(50)} className="h-14 bg-gray-900 text-white hover:bg-black shadow-xl shadow-gray-200">Subir Comprobante</Button>
                    </div>

                    <button className="w-full bg-white p-6 rounded-[24px] border border-gray-200 flex flex-row items-center justify-between hover:border-blue-300 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-100 transition-colors"><History size={24} /></div>
                            <div className="text-left">
                                <span className="block text-base font-bold text-gray-900">Historial de Transacciones</span>
                                <span className="text-xs text-gray-500">Ver todos los movimientos</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MyServicesPanel: React.FC<{ userData: UserData, onNavigate: (v: string) => void, onUpdateUserData: (data: Partial<UserData>) => void }> = ({ userData, onNavigate, onUpdateUserData }) => {
    
    // DOCUMENT MANAGEMENT STATE
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const docInputRef = useRef<HTMLInputElement>(null);

    const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingDoc(true);
        try {
            const uniqueName = `documents/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, uniqueName);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            const newDoc: UserDocument = {
                id: Math.random().toString(),
                name: file.name,
                url: downloadURL,
                date: new Date().toLocaleDateString(),
                type: file.type.includes('pdf') ? 'CV' : 'OTHER'
            };

            const updatedDocs = [...(userData.documents || []), newDoc];
            onUpdateUserData({ documents: updatedDocs });
            alert("Documento subido correctamente.");
        } catch (error) {
            console.error("Upload error", error);
            alert("Error al subir el documento.");
        } finally {
            setUploadingDoc(false);
        }
    };

    const handleDeleteDocument = (docId: string) => {
        if(confirm("¿Estás seguro de eliminar este documento?")) {
            const updatedDocs = (userData.documents || []).filter(d => d.id !== docId);
            onUpdateUserData({ documents: updatedDocs });
        }
    };

    return (
        <div className="p-6 pb-24 w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Panel</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 rounded-[32px] p-8 mb-6 shadow-xl shadow-gray-200 relative overflow-hidden h-64 flex flex-col justify-between">
                        <div className="relative z-10">
                            <p className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-2">Saldo Actual</p>
                            <p className="text-white text-5xl font-black">Bs. {userData.walletBalance.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => onNavigate('WALLET')}
                          className="relative z-10 bg-white/10 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2 w-fit backdrop-blur-sm"
                        >
                            <Wallet size={16} />
                            Gestionar Billetera
                        </button>
                        <Wallet size={160} className="absolute -right-8 -bottom-10 text-white opacity-5" />
                    </div>
                </div>

                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                    <button onClick={() => setShowDocsModal(true)} className="w-full bg-white border border-gray-100 p-6 rounded-[24px] flex flex-col gap-4 hover:border-purple-200 hover:shadow-lg transition-all group h-full justify-between">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl w-fit group-hover:bg-purple-100 transition-colors"><FileText size={32} /></div>
                        <div className="text-left">
                            <p className="font-bold text-gray-900 text-lg">Gestión de Documentos</p>
                            <p className="text-sm text-gray-500">Curriculum, Certificados y Títulos</p>
                        </div>
                    </button>

                    <button onClick={() => onNavigate('JOB_CLOSING')} className="w-full bg-white border border-gray-100 p-6 rounded-[24px] flex flex-col gap-4 hover:border-blue-200 hover:shadow-lg transition-all group h-full justify-between">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:bg-blue-100 transition-colors"><Handshake size={32} /></div>
                        <div className="text-left">
                            <p className="font-bold text-gray-900 text-lg">Simular Cierre</p>
                            <p className="text-sm text-gray-500">Calcular comisión y puntos</p>
                        </div>
                    </button>
                    
                    <button onClick={() => onNavigate('HIRE_MODE')} className="sm:col-span-2 w-full bg-gray-50 border border-gray-200 p-6 rounded-[24px] flex items-center gap-6 hover:bg-gray-100 transition-all mt-2 group">
                        <div className="p-4 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform"><ChevronRight size={24} /></div>
                        <div className="text-left flex-1">
                            <p className="font-bold text-gray-900 text-lg">Contratar Servicios</p>
                            <p className="text-sm text-gray-500">Cambiar a modo Cliente para buscar profesionales</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* DOCUMENT MANAGEMENT MODAL */}
            <Modal isOpen={showDocsModal} onClose={() => setShowDocsModal(false)} title="Mis Documentos">
                <div className="space-y-6">
                    <p className="text-sm text-gray-500">Sube tu Curriculum Vitae, certificados de trabajo o títulos profesionales para generar más confianza.</p>
                    
                    {/* Upload Area */}
                    <input type="file" ref={docInputRef} className="hidden" accept=".pdf,image/*" onChange={handleDocumentUpload} />
                    <button 
                        onClick={() => docInputRef.current?.click()}
                        disabled={uploadingDoc}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-3 text-gray-500 font-bold hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600 transition-all"
                    >
                        {uploadingDoc ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                        {uploadingDoc ? 'Subiendo...' : 'Subir Nuevo Documento'}
                    </button>

                    {/* Documents List */}
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                        {userData.documents && userData.documents.length > 0 ? (
                            userData.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-white rounded-lg border border-gray-200 text-red-500">
                                            <File size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{doc.name}</p>
                                            <p className="text-[10px] text-gray-500">{doc.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Descargar">
                                            <Download size={16} />
                                        </a>
                                        <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                                <p className="text-sm text-gray-400 font-medium">No tienes documentos subidos.</p>
                            </div>
                        )}
                    </div>
                    
                    <Button fullWidth onClick={() => setShowDocsModal(false)}>Cerrar</Button>
                </div>
            </Modal>
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
        <div className="flex flex-col h-screen w-full bg-white">
            <div className="p-6 flex justify-between items-center border-b border-gray-100 max-w-2xl mx-auto w-full">
                <h2 className="text-xl font-bold text-gray-900">Cierre de Trabajo</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><ArrowDownCircle className="rotate-180" size={20} /></button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center p-8 text-center max-w-xl mx-auto w-full">
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Ingresa Monto Total</h3>
                        <p className="text-gray-400 text-sm mb-12">Monto cobrado al cliente</p>
                        
                        <div className="relative mb-12">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-300 lg:left-10">Bs.</span>
                            <input 
                                type="number" 
                                className="w-full text-7xl font-black text-center text-gray-900 placeholder:text-gray-100 outline-none bg-transparent" 
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {numericAmount > 0 && (
                             <div className="bg-gray-50 p-6 rounded-3xl mb-10 text-left space-y-4 border border-gray-100 shadow-sm">
                                 <div className="flex justify-between text-sm text-gray-500">
                                     <span>Total Servicio:</span>
                                     <span>Bs. {numericAmount.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-sm text-red-500 font-bold">
                                     <span>Comisión App (5%):</span>
                                     <span>- Bs. {commission.toFixed(2)}</span>
                                 </div>
                                 <div className="border-t border-gray-200 pt-4 flex justify-between font-black text-gray-900 text-xl">
                                     <span>Recibes Neto:</span>
                                     <span>Bs. {netReceive.toFixed(2)}</span>
                                 </div>
                             </div>
                        )}
                        <Button fullWidth onClick={() => setStep(2)} disabled={numericAmount <= 0} className="h-16 text-xl bg-gray-900 text-white shadow-xl shadow-gray-300 hover:bg-black">Solicitar Confirmación</Button>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in">
                        <h3 className="text-3xl font-bold text-gray-900 mb-8">Cliente: Confirma Pago</h3>
                        <div className="bg-gray-900 text-white p-10 rounded-[40px] mb-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="font-bold text-yellow-400 text-2xl mb-4 tracking-wide">¡GANA PUNTOS!</p>
                                <p className="text-lg opacity-90 leading-relaxed max-w-xs mx-auto">
                                    Si confirmas el pago de <span className="font-bold text-white text-2xl">Bs. {amount}</span>, 
                                    se te acreditarán:
                                </p>
                                <div className="mt-8 bg-white/10 p-6 rounded-3xl inline-block border border-white/10 backdrop-blur-sm">
                                    <span className="font-black text-yellow-400 text-6xl">{Math.floor(Number(amount)/10)}</span>
                                    <span className="block text-xs font-bold uppercase tracking-[0.3em] mt-2">Puntos</span>
                                </div>
                            </div>
                        </div>
                        <Button fullWidth className="bg-emerald-500 hover:bg-emerald-600 border-none h-16 text-xl shadow-emerald-200 text-white" onClick={() => onSuccess(Math.floor(Number(amount)/10))}>
                            Confirmar y Ganar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
