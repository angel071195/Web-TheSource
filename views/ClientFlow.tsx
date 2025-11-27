
import React, { useState, useRef } from 'react';
import { Search, MapPin, Star, Calculator, Share2, Flag, MessageCircle, ChevronRight, CreditCard, HelpCircle, FileText, Filter, User, ArrowLeft, ShieldCheck, Mail, Grid, List, Briefcase, Phone, Camera, Lock, Loader2, Crosshair, Navigation, Check, Gift, Snowflake } from 'lucide-react';
import { Button, Input, Modal, Badge, TextArea, Snowfall } from '../components/UIComponents';
import { CATEGORIES, AVATARS } from '../constants';
import { Provider, UserData, ViewState } from '../types';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface HomeProps {
  userData: UserData;
  providers: Provider[];
  onSelectProvider: (p: Provider) => void;
  onToggleSearch: () => void;
  onNavigate: (view: ViewState) => void;
}

export const HomeView: React.FC<HomeProps> = ({ userData, providers, onSelectProvider, onToggleSearch, onNavigate }) => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 flex justify-between items-start bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 lg:bg-transparent lg:border-none lg:static">
         <div>
            <div className="flex items-center gap-1 mb-1">
               <span className="text-xs font-bold text-gray-400">MI PERFIL</span>
            </div>
            <div className="flex items-center gap-1 mb-3">
               <MapPin size={14} className="text-red-500" />
               <span className="text-sm font-bold text-gray-800">{userData.location || 'Seleccionar Ubicación'}</span>
            </div>
            <div className="lg:hidden">
                <h1 className="text-xl font-black tracking-tighter flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                    THE SOURCE
                    <Gift size={16} className="text-red-600" />
                </h1>
                <p className="text-[10px] font-bold text-red-600 tracking-widest uppercase">Holiday Edition</p>
            </div>
         </div>
         <button onClick={onToggleSearch} className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
            <Search size={20} className="text-gray-600" />
         </button>
      </div>

      <div className="p-6">
          {/* Christmas Banner */}
          <div className="mb-8 p-8 bg-gradient-to-br from-red-700 to-red-900 rounded-[32px] relative overflow-hidden shadow-xl shadow-red-200 flex flex-col justify-center min-h-[180px]">
             <Snowfall />
             <div className="relative z-10 max-w-md text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Gift className="text-yellow-400 animate-bounce" size={24} />
                    <h3 className="font-bold text-2xl">Regala soluciones</h3>
                </div>
                <p className="text-red-100 text-sm mb-6">Esta Navidad, encuentra al experto ideal para que todo brille en tu hogar.</p>
                <button onClick={() => onNavigate('REQUEST_SERVICE')} className="bg-white text-red-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-lg">Publicar Solicitud</button>
             </div>
             <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12">
                 <Snowflake size={200} className="text-white" />
             </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
             <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
                <button onClick={() => onNavigate('SEARCH')} className="text-red-600 text-sm font-bold hover:underline">Ver todas</button>
             </div>
             
             <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 xl:grid-cols-8">
                {CATEGORIES.map((cat, i) => (
                   <button key={cat.id} onClick={() => onNavigate('SEARCH')} className="flex flex-col items-center gap-3 min-w-[80px] group transition-all">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-105 group-hover:shadow-md ${i === 0 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-500 group-hover:border-red-300'}`}>
                         {cat.icon}
                      </div>
                      <span className={`text-xs font-bold ${i===0 ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-800'}`}>{cat.label.split(' ')[0]}</span>
                   </button>
                ))}
             </div>
          </div>

          {/* Providers Grid */}
          <div>
             <h2 className="text-xl font-bold text-gray-900 mb-6">Recomendados para ti</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {providers.map(p => (
                   <div 
                     key={p.id} 
                     onClick={() => onSelectProvider(p)}
                     className="bg-white p-4 rounded-[24px] flex md:flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 group relative overflow-hidden"
                   >
                      {/* Gold border accent for holiday */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="w-24 h-24 md:w-full md:h-48 rounded-2xl overflow-hidden bg-gray-100 relative">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                              <Star size={12} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-bold">{p.rating}</span>
                          </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                         <div className="flex justify-between items-start mb-1">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                                <p className="text-xs text-gray-500 font-medium">{p.professions[0]}</p>
                            </div>
                            {p.isVerified && <Badge color="gold">✓</Badge>}
                         </div>
                         
                         <div className="mt-auto pt-3 flex items-center gap-2">
                            <Badge color="green">Bs. {p.price}</Badge>
                            {p.issuesInvoice && <Badge color="gray">Factura</Badge>}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};

export const SearchView: React.FC<{ providers: Provider[], onSelectProvider: (p: Provider) => void }> = ({ providers, onSelectProvider }) => {
    return (
        <div className="p-6 w-full max-w-7xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Buscar</h1>
            
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 max-w-3xl">
                <div className="flex gap-3">
                    <Input placeholder="Buscar servicio, profesional o categoría..." icon={Search} className="flex-1 mb-0 border-none bg-gray-50" />
                    <button className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-colors shadow-lg shadow-gray-300">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar (Desktop) */}
                <div className="hidden lg:block space-y-6">
                    <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-3">Categorías</h3>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.slice(0, 8).map(cat => (
                                <button key={cat.id} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-3">Rango de Precio</h3>
                        <div className="h-1 bg-gray-200 rounded-full mb-2"></div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Bs. 0</span>
                            <span>Bs. 500+</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Resultados ({providers.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {providers.map(p => (
                            <div key={p.id} onClick={() => onSelectProvider(p)} className="flex md:flex-col items-center md:items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 transition-all group">
                                <img src={p.image} className="w-16 h-16 md:w-full md:h-48 rounded-xl object-cover" alt={p.name} />
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{p.name}</h4>
                                            <p className="text-xs text-gray-500">{p.professions[0]}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold">{p.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 flex justify-between items-center pt-3 border-t border-gray-50">
                                        <span className="block font-bold text-blue-600 text-sm">Bs. {p.price}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">{p.unit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RequestServiceView: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const [invoiceRequired, setInvoiceRequired] = useState(false);

    return (
        <div className="p-6 w-full min-h-screen flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicar Solicitud</h1>
                <p className="text-gray-500 mb-8">Describe lo que necesitas y recibe propuestas de profesionales.</p>
                
                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="¿Qué profesional buscas?" placeholder="Ej. Electricista" icon={User} />
                        <Input label="¿Para cuándo?" placeholder="Ej. Hoy, Mañana por la tarde" className="flex-1" />
                    </div>
                    
                    <TextArea label="Detalles del trabajo" placeholder="Describe lo que necesitas reparar o instalar con el mayor detalle posible..." className="min-h-[150px]" />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Presupuesto Estimado (Bs)" placeholder="Opcional" className="flex-1" type="number" />
                        <Input label="Teléfono de contacto" placeholder="700..." type="tel" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200"><FileText size={20} className="text-gray-600"/></div>
                            <div>
                                <span className="block font-bold text-gray-900 text-sm">¿Requiere Factura?</span>
                                <span className="text-xs text-gray-500">Se mostrará en la solicitud</span>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={invoiceRequired} onChange={e => setInvoiceRequired(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <Button fullWidth onClick={onSubmit} className="h-14 text-lg mt-4 bg-gray-900 hover:bg-black">
                        Publicar Solicitud
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const ProfileDetail: React.FC<{ provider: Provider, onBack: () => void, onSendRequest: (msg: string) => void }> = ({ provider, onBack, onSendRequest }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [simAmount, setSimAmount] = useState('');

  const calculatePoints = () => {
      const num = parseFloat(simAmount);
      return isNaN(num) ? 0 : Math.floor(num / 10);
  };

  const handleShareWhatsApp = () => {
    const text = `Hola, te recomiendo a ${provider.name} (${provider.professions[0]}) en The Source App.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const submitReport = () => {
    alert("Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.");
    setShowReportModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full pb-24 lg:pb-0">
       <div className="max-w-6xl mx-auto lg:p-8 lg:flex lg:gap-8 lg:items-start">
           
           {/* Left Column / Mobile Header */}
           <div className="lg:w-1/3 lg:sticky lg:top-24">
               <div className="relative h-72 lg:h-auto lg:rounded-[32px] lg:overflow-hidden lg:shadow-2xl">
                  <img src={provider.image} className="w-full h-full object-cover lg:aspect-[3/4]" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:from-black/60" />
                  
                  {/* Mobile Back Button */}
                  <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 lg:hidden">
                     <ChevronRight className="rotate-180" size={24} />
                  </button>
                  
                  {/* Desktop Back Button */}
                  <button onClick={onBack} className="hidden lg:flex absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white hover:bg-black/60 items-center gap-2 text-sm font-bold">
                     <ArrowLeft size={16} /> Volver
                  </button>

                  <div className="absolute top-6 right-6 flex gap-3">
                     <button onClick={() => setShowReportModal(true)} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors">
                        <Flag size={20} />
                     </button>
                     <button onClick={handleShareWhatsApp} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-green-500 transition-colors">
                        <Share2 size={20} />
                     </button>
                  </div>
                  
                  <div className="absolute bottom-6 left-6">
                     <h1 className="text-3xl font-bold text-white mb-2">{provider.name}</h1>
                     <div className="flex flex-wrap gap-2">
                        {provider.professions.map(p => <Badge key={p} color="gray">{p}</Badge>)}
                     </div>
                  </div>
               </div>
           </div>

           {/* Right Column / Details */}
           <div className="flex-1">
                <div className="p-6 -mt-6 rounded-t-3xl bg-gray-50 relative z-10 space-y-6 lg:mt-0 lg:p-0">
                    
                    {/* Action Buttons Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => provider.cvUrl ? alert(`Abriendo documento: ${provider.cvUrl}`) : alert("El usuario no ha hecho público sus documentos.")}
                            className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
                        >
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
                                <FileText size={24} />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-gray-900">Ver Credenciales</p>
                                <p className="text-xs text-gray-500">Documentación Verificada</p>
                            </div>
                        </button>

                        <button onClick={() => setShowSimModal(true)} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                <Calculator size={24} />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-gray-900">Simular Puntos</p>
                                <p className="text-xs text-gray-500">Calcula tu ganancia</p>
                            </div>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                             <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">Tarifas</h3>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                                    {provider.tariffs.map((t, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                                        <span className="font-medium text-gray-700">{t.service}</span>
                                        <span className="font-bold text-blue-600 text-lg">Bs. {t.price}</span>
                                    </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                        
                        <div>
                             <h3 className="font-bold text-gray-900 mb-3 text-lg">Sobre mí</h3>
                             <p className="text-gray-600 text-sm leading-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[160px]">{provider.bio}</p>
                        </div>
                    </div>
                </div>
           </div>
       </div>

       <div className="fixed bottom-6 left-0 right-0 p-4 bg-transparent max-w-md mx-auto z-30 lg:hidden">
          <Button fullWidth icon={MessageCircle} onClick={() => setShowRequestModal(true)} className="shadow-2xl shadow-blue-500/30">SOLICITAR SERVICIO</Button>
       </div>
       
       {/* Desktop Floating Action Button */}
       <div className="hidden lg:block fixed bottom-10 right-10 z-30">
          <Button icon={MessageCircle} onClick={() => setShowRequestModal(true)} className="h-16 px-8 rounded-full text-lg shadow-2xl shadow-blue-500/30 bg-gray-900 hover:bg-black">SOLICITAR SERVICIO</Button>
       </div>

       <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Solicitar Contacto" position="center">
           <p className="text-gray-500 text-sm mb-4">Describe tu problema. El profesional desbloqueará el chat si está interesado.</p>
           <TextArea placeholder="Hola, necesito ayuda con..." value={msg} onChange={e => setMsg(e.target.value)} />
           <Button fullWidth onClick={() => { onSendRequest(msg); setShowRequestModal(false); }}>Enviar Solicitud</Button>
       </Modal>

       <Modal isOpen={showSimModal} onClose={() => setShowSimModal(false)} title="Simulador de Puntos">
           <div className="flex flex-col items-center">
              <Calculator size={48} className="text-emerald-500 mb-4" />
              <p className="text-center text-gray-500 mb-6">Gana 1 punto por cada 10 Bs gastados en servicios.</p>
              <div className="w-full bg-gray-100 rounded-2xl p-4 mb-6">
                 <p className="text-xs text-gray-500 font-bold mb-1">MONTO SERVICIO (Bs)</p>
                 <input type="number" className="w-full bg-transparent text-3xl font-black text-center outline-none" placeholder="0" value={simAmount} onChange={e => setSimAmount(e.target.value)} />
              </div>
              {calculatePoints() > 0 && (
                 <div className="bg-blue-50 p-6 rounded-2xl w-full text-center mb-6">
                    <p className="text-blue-600 font-bold mb-1">Ganarás:</p>
                    <p className="text-4xl font-black text-blue-600">{calculatePoints()} Puntos</p>
                    <p className="text-xs text-blue-400 mt-2">Usalos para pagar futuros servicios</p>
                 </div>
              )}
              <Button fullWidth onClick={() => setShowSimModal(false)}>Entendido</Button>
           </div>
       </Modal>

       <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Reportar Usuario">
           <div className="space-y-4">
              <p className="text-sm text-gray-500">Por favor, selecciona el motivo de tu reporte. Esto nos ayuda a mantener segura la comunidad.</p>
              <select className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none">
                  <option>Comportamiento inapropiado</option>
                  <option>Perfil falso</option>
                  <option>Estafa o Fraude</option>
                  <option>Otro</option>
              </select>
              <TextArea placeholder="Describe los detalles (opcional)..." className="min-h-[80px]" />
              <div className="flex gap-3">
                  <Button variant="outline" fullWidth onClick={() => setShowReportModal(false)}>Cancelar</Button>
                  <Button fullWidth onClick={submitReport} className="bg-red-600 hover:bg-red-700 border-none">Enviar Reporte</Button>
              </div>
           </div>
       </Modal>
    </div>
  );
};

interface ClientProfileViewProps {
    profile: UserData;
    onNavigate: (v: ViewState) => void;
    onUpdateProfile: (data: Partial<UserData>) => void;
    isAdmin: boolean;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({ profile, onNavigate, onUpdateProfile, isAdmin }) => {
    const [showSimModal, setShowSimModal] = useState(false);
    const [simAmount, setSimAmount] = useState('');
    
    // EDIT PROFILE STATE
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState<Partial<UserData>>({});
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const [locationCoords, setLocationCoords] = useState<{latitude: number, longitude: number} | null>(null);
    const [gettingLocation, setGettingLocation] = useState(false);

    const calculatePoints = () => {
      const num = parseFloat(simAmount);
      return isNaN(num) ? 0 : Math.floor(num / 10); // 10 Bs = 1 Point
    };

    const handleEditOpen = () => {
        setEditData({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            image: profile.image,
            bio: profile.bio
        });
        // Mock previous coordinates or load from profile if extended in types
        // setLocationCoords({ latitude: profile.latitude, longitude: profile.longitude })
        setShowEditModal(true);
    };

    const handleGetLocation = () => {
        setGettingLocation(true);
        if (!navigator.geolocation) {
            alert("Geolocalización no soportada.");
            setGettingLocation(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocationCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                setGettingLocation(false);
            },
            (err) => {
                console.error(err);
                alert("Error al obtener ubicación.");
                setGettingLocation(false);
            }
        );
    };

    const handleSaveProfile = () => {
        // Direct save, no verification required
        onUpdateProfile({ ...editData, ...locationCoords });
        setShowEditModal(false);
        alert("Perfil actualizado correctamente.");
    };

    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPhoto(true);
        try {
             const uniqueName = `profile_photos/${Date.now()}_${file.name}`;
             const storageRef = ref(storage, uniqueName);
             const snapshot = await uploadBytes(storageRef, file);
             const downloadURL = await getDownloadURL(snapshot.ref);
             
             setEditData(prev => ({ ...prev, image: downloadURL }));
        } catch(error) {
             console.error("Upload failed", error);
             alert("Error al subir imagen");
        } finally {
             setUploadingPhoto(false);
        }
    };

    return (
        <div className="p-6 w-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: User Card & Points */}
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mx-auto mb-4 relative group">
                            {profile.image ? <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-black">{profile.name.charAt(0)}</div>}
                            <button onClick={handleEditOpen} className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold">Cambiar</button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                        <p className="text-gray-500 text-sm mb-4">{profile.email || 'Agrega tu correo'}</p>
                        <button onClick={handleEditOpen} className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">Editar Perfil</button>
                    </div>

                    <div className="bg-gray-900 rounded-[32px] p-8 relative overflow-hidden shadow-xl shadow-gray-300">
                        <div className="relative z-10">
                            <p className="text-gray-400 text-[10px] font-bold tracking-wider mb-2">MIS PUNTOS</p>
                            <p className="text-white text-6xl font-black tracking-tight">{profile.loyaltyPoints || 0}</p>
                            <p className="text-gray-400 text-xs mt-4 border-t border-gray-700 pt-4">1 Punto = 1 Bs para futuros pagos.</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 opacity-10 text-white">
                            <Star size={180} />
                        </div>
                        <button onClick={() => setShowSimModal(true)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Simular Puntos">
                            <Calculator size={18} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Right Column: Menu & Promo */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg shadow-blue-200">
                        <div className="relative z-10 max-w-lg">
                            <h3 className="font-bold text-2xl mb-2">¿Ofreces algún servicio?</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">Únete a nuestra comunidad de profesionales. Crea tu perfil, verifica tus documentos y empieza a recibir solicitudes hoy mismo.</p>
                            <button 
                                onClick={() => onNavigate('ONBOARDING_PROVIDER')}
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform"
                            >
                                Crear Perfil de Trabajador
                            </button>
                        </div>
                        <Briefcase className="absolute -right-8 -bottom-8 text-blue-400 opacity-30" size={200} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { icon: CreditCard, label: "Métodos de Pago", action: () => alert("Gestión de tarjetas") },
                            { icon: HelpCircle, label: "Centro de Ayuda", action: () => onNavigate('HELP') },
                            { icon: ShieldCheck, label: "Términos y Privacidad", action: () => onNavigate('TERMS') },
                            { icon: Mail, label: "Soporte", action: () => alert("Soporte") },
                        ].map((item, i) => (
                            <button key={i} onClick={item.action} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <item.icon size={20} className="text-gray-900 group-hover:text-blue-600" />
                                    </div>
                                    <span className="font-bold text-gray-900">{item.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    {/* Admin Button - ONLY VISIBLE TO THE SPECIFIC ADMIN EMAIL */}
                    {isAdmin && (
                        <button onClick={() => onNavigate('ADMIN')} className="w-full flex items-center justify-between p-5 bg-gray-900 rounded-2xl text-white hover:bg-black border border-gray-900 transition-all shadow-xl shadow-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg"><User size={20} className="text-white" /></div>
                                <span className="font-bold">Panel Administrador</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            <Modal isOpen={showSimModal} onClose={() => setShowSimModal(false)} title="Simular Puntos">
                {/* Simulator Content (Same as above) */}
                 <div className="flex flex-col items-center">
                    <Calculator size={48} className="text-emerald-500 mb-4" />
                    <p className="text-center text-gray-500 mb-6">Gana 1 punto por cada 10 Bs gastados.</p>
                    <div className="w-full bg-gray-100 rounded-2xl p-4 mb-6">
                        <p className="text-xs text-gray-500 font-bold mb-1">MONTO GASTO (Bs)</p>
                        <input type="number" className="w-full bg-transparent text-3xl font-black text-center outline-none" placeholder="0" value={simAmount} onChange={e => setSimAmount(e.target.value)} />
                    </div>
                    {calculatePoints() > 0 && (
                        <div className="bg-blue-50 p-6 rounded-2xl w-full text-center mb-6">
                            <p className="text-blue-600 font-bold mb-1">Obtendrás:</p>
                            <p className="text-4xl font-black text-blue-600">{calculatePoints()} Puntos</p>
                        </div>
                    )}
                    <Button fullWidth onClick={() => setShowSimModal(false)}>Entendido</Button>
                </div>
            </Modal>

            {/* EDIT PROFILE MODAL */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Perfil">
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                    <div className="flex flex-col items-center mb-4">
                         {/* Hidden File Input */}
                         <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />

                         <button 
                             onClick={() => profileInputRef.current?.click()}
                             disabled={uploadingPhoto}
                             className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:scale-105 transition-all relative group"
                         >
                             {uploadingPhoto ? (
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                                     <Loader2 className="animate-spin" />
                                 </div>
                             ) : null}
                             {editData.image ? <img src={editData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-3xl font-bold">{editData.name?.charAt(0)}</div>}
                             <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold uppercase">Cambiar Foto</div>
                         </button>
                    </div>

                    <Input label="Nombre Completo" value={editData.name || ''} onChange={e => setEditData({...editData, name: e.target.value})} icon={User} />
                    <Input label="Email" value={editData.email || ''} onChange={e => setEditData({...editData, email: e.target.value})} icon={Mail} />
                    <Input label="Teléfono" value={editData.phone || ''} onChange={e => setEditData({...editData, phone: e.target.value})} icon={Phone} />
                    <Input label="Ubicación" value={editData.location || ''} onChange={e => setEditData({...editData, location: e.target.value})} icon={MapPin} />
                    
                    {/* GPS BUTTON FOR EDIT */}
                    <div className="mb-2">
                        <button 
                            onClick={handleGetLocation}
                            disabled={gettingLocation}
                            className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                                locationCoords 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {gettingLocation ? <Loader2 className="animate-spin" size={18}/> : locationCoords ? <Check size={18}/> : <Crosshair size={18}/>}
                            {gettingLocation ? 'Localizando...' : locationCoords ? 'Ubicación Actualizada' : 'Activar mi Ubicación GPS'}
                        </button>
                    </div>

                    {profile.bio && (
                        <TextArea label="Bio (Sobre tí)" value={editData.bio || ''} onChange={e => setEditData({...editData, bio: e.target.value})} />
                    )}

                    <div className="pt-4 flex gap-3">
                        <Button fullWidth variant="outline" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                        <Button fullWidth onClick={handleSaveProfile} disabled={uploadingPhoto}>Guardar Cambios</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export const TermsContent = () => (
    <div className="text-sm text-gray-600 space-y-4 leading-relaxed pr-2">
        <p className="text-xs text-gray-400 mb-4">Fecha de última actualización: 22 de Noviembre de 2025</p>

        <div>
            <h4 className="font-bold text-gray-900 mb-1">1. RESPONSABILIDAD LEGAL Y MARCO</h4>
            <p>Esta aplicación móvil, denominada "THE SOURCE" (Solutions App), es propiedad y está operada por <span className="font-bold">ANGELO MARIO VILLARROEL DE LA FUENTE</span> (en adelante "LA ADMINISTRACIÓN"), con domicilio legal en Puerto Quijarro, Santa Cruz, Bolivia. El presente Contrato se rige bajo el marco legal de la Ley N° 164 y la Ley N° 453 del Estado Plurinacional de Bolivia.</p>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-1">2. NATURALEZA DE LA PLATAFORMA (NO RELACIÓN LABORAL)</h4>
            <p>THE SOURCE es una plataforma de intermediación tecnológica. <span className="font-bold">EL TRABAJADOR NO ES EMPLEADO NI DEPENDIENTE DE LA ADMINISTRACIÓN.</span> Las partes reconocen que no existe ninguna relación laboral. El Trabajador es un profesional independiente.</p>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-1">3. POLÍTICA DE COMISIONES Y PAGOS</h4>
            <ul className="list-disc pl-4 space-y-1">
                <li><span className="font-bold">Comisión:</span> La App cobra una comisión fija del <span className="font-bold">5%</span> sobre el monto final total de cada servicio exitosamente completado.</li>
                <li><span className="font-bold">Pago:</span> El Trabajador debe mantener un saldo positivo en su Billetera virtual. La comisión del 5% será descontada automáticamente.</li>
                <li><span className="font-bold">Servicios "A Convenir":</span> Es obligatorio registrar el precio final real del servicio en la App.</li>
            </ul>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-1">4. BONOS E INCENTIVOS</h4>
            <p>Como oferta de lanzamiento, los nuevos Trabajadores recibirán un <span className="font-bold">Bono de Bienvenida</span> aleatorio en su billetera virtual para cubrir futuras comisiones. No canjeable por efectivo.</p>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-1">5. SISTEMA DE PUNTOS Y LEALTAD</h4>
            <ul className="list-disc pl-4 space-y-1">
                <li>Por cada <span className="font-bold">10 Bolivianos (Bs)</span> pagados en un servicio finalizado, el Cliente ganará <span className="font-bold">1 Punto de Lealtad</span>.</li>
                <li>Cada Source Point tiene un valor de canje de <span className="font-bold">0.10 Bs</span> para futuros servicios. No canjeables por efectivo.</li>
            </ul>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-1">6. SANCIONES Y POLÍTICA ANTI-FRAUDE</h4>
            <p>Evasión de comisión (declarar montos falsos) se considera fraude. Cualquier intento comprobado resultará en la <span className="font-bold">suspensión inmediata y bloqueo definitivo</span> de la cuenta, perdiendo saldos o puntos.</p>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-1">7. MODIFICACIONES</h4>
            <p>LA ADMINISTRACIÓN se reserva el derecho de modificar estos términos notificando con 15 días de anticipación.</p>
        </div>
    </div>
);

export const TermsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="pb-24 w-full h-full flex flex-col bg-white max-w-4xl mx-auto">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Términos y Condiciones</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <TermsContent />
            </div>
        </div>
    );
};
