import React, { useState } from 'react';
import { Search, MapPin, Star, Calculator, Share2, Flag, MessageCircle, ChevronRight, CreditCard, HelpCircle, FileText, Filter, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button, Input, Modal, Badge, TextArea } from '../components/UIComponents';
import { CATEGORIES } from '../constants';
import { Provider, UserData, ViewState } from '../types';

interface HomeProps {
  userData: UserData;
  providers: Provider[];
  onSelectProvider: (p: Provider) => void;
  onToggleSearch: () => void;
}

export const HomeView: React.FC<HomeProps> = ({ userData, providers, onSelectProvider, onToggleSearch }) => {
  return (
    <div className="pb-24 w-full">
      {/* Header */}
      <div className="p-6 flex justify-between items-start bg-white sticky top-0 z-10 shadow-sm/50 backdrop-blur-md bg-white/80">
         <div>
            <div className="flex items-center gap-1 mb-1">
               <span className="text-xs font-bold text-gray-400">MI PERFIL</span>
            </div>
            <div className="flex items-center gap-1 mb-3">
               <MapPin size={14} className="text-red-500" />
               <span className="text-sm font-bold text-gray-800">{userData.location || 'Seleccionar Ubicación'}</span>
            </div>
            <h1 className="text-xl font-black text-gray-900">THE SOURCE</h1>
            <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Solutions App</p>
         </div>
         <button onClick={onToggleSearch} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Search size={20} />
         </button>
      </div>

      {/* Banner */}
      <div className="mx-6 mb-8 p-6 bg-gray-900 rounded-3xl relative overflow-hidden shadow-xl shadow-gray-200">
         <div className="relative z-10">
            <h3 className="text-white font-bold text-lg mb-1">¿Buscas algo especial?</h3>
            <p className="text-gray-400 text-xs mb-4">Publica tu solicitud y recibe ofertas de expertos.</p>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100">Publicar Solicitud</button>
         </div>
         <div className="absolute -right-4 -bottom-8 opacity-20">
             <Search size={120} className="text-white" />
         </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
         <h2 className="px-6 text-lg font-bold text-gray-900 mb-4">Categorías</h2>
         <div className="flex overflow-x-auto px-6 gap-4 no-scrollbar pb-2">
            {CATEGORIES.map((cat, i) => (
               <button key={cat.id} className="flex flex-col items-center gap-2 min-w-[72px] group">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-105 ${i === 0 ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500 group-hover:border-gray-300'}`}>
                     {cat.icon}
                  </div>
                  <span className={`text-xs font-medium ${i===0 ? 'text-blue-600' : 'text-gray-500'}`}>{cat.label.split(' ')[0]}</span>
               </button>
            ))}
         </div>
      </div>

      {/* Providers */}
      <div className="px-6">
         <h2 className="text-lg font-bold text-gray-900 mb-4">Recomendados</h2>
         <div className="space-y-4">
            {providers.map(p => (
               <div 
                 key={p.id} 
                 onClick={() => onSelectProvider(p)}
                 className="bg-white p-3 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100"
               >
                  <img src={p.image} alt={p.name} className="w-24 h-28 rounded-xl object-cover bg-gray-100" />
                  <div className="flex-1 py-1">
                     <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900">{p.name}</h3>
                        {p.isVerified && <Badge color="blue">✓</Badge>}
                     </div>
                     <p className="text-xs text-gray-500 mb-2">{p.professions[0]}</p>
                     <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-900">{p.rating}</span>
                        <span className="text-xs text-gray-400">({p.reviews})</span>
                     </div>
                     <div className="flex gap-2">
                        <Badge color="green">Bs. {p.price}</Badge>
                        {p.issuesInvoice && <Badge color="blue">Factura</Badge>}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export const SearchView: React.FC<{ providers: Provider[], onSelectProvider: (p: Provider) => void }> = ({ providers, onSelectProvider }) => {
    return (
        <div className="p-6 pb-24 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Buscar</h1>
            
            <div className="flex gap-2 mb-6">
                <Input placeholder="Buscar servicio..." icon={Search} className="flex-1 mb-0" />
                <button className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"><Filter size={20} /></button>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-sm text-gray-900 mb-3">Categorías Populares</h3>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.slice(0, 6).map(cat => (
                        <button key={cat.id} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-sm text-gray-900 mb-3">Resultados</h3>
                <div className="space-y-3">
                    {providers.map(p => (
                        <div key={p.id} onClick={() => onSelectProvider(p)} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50">
                            <img src={p.image} className="w-16 h-16 rounded-xl object-cover" alt={p.name} />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                                <p className="text-xs text-gray-500">{p.professions[0]}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-bold">{p.rating}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-blue-600 text-sm">Bs. {p.price}</span>
                                <span className="text-[10px] text-gray-400">{p.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const RequestServiceView: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const [invoiceRequired, setInvoiceRequired] = useState(false);

    return (
        <div className="p-6 pb-24 w-full min-h-full bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Publicar Solicitud</h1>
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                <Input label="¿Qué profesional buscas?" placeholder="Ej. Electricista" />
                <TextArea label="Detalles del trabajo" placeholder="Describe lo que necesitas reparar o instalar..." />
                <div className="flex gap-4">
                    <Input label="¿Para cuándo?" placeholder="Ej. Hoy" className="flex-1" />
                    <Input label="Presupuesto (Bs)" placeholder="Opcional" className="flex-1" type="number" />
                </div>
                
                <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-900 text-sm">¿Requiere Factura?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={invoiceRequired} onChange={e => setInvoiceRequired(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <Input label="Teléfono de contacto" placeholder="700..." type="tel" />
                
                <Button fullWidth onClick={onSubmit} className="mt-4">
                    Publicar Ahora
                </Button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Los profesionales verán tu solicitud y te contactarán.</p>
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
      return isNaN(num) ? 0 : Math.floor(num / 10); // Updated Logic: 1 point per 10 Bs
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
    <div className="bg-gray-50 min-h-full w-full pb-24">
       <div className="relative h-72">
          <img src={provider.image} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40">
             <ChevronRight className="rotate-180" size={24} />
          </button>
          <div className="absolute top-6 right-6 flex gap-3">
             <button 
                onClick={() => setShowReportModal(true)}
                className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors"
                title="Reportar Usuario"
             >
                <Flag size={20} />
             </button>
             <button 
                onClick={handleShareWhatsApp}
                className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-green-500 transition-colors"
                title="Compartir en WhatsApp"
             >
                <Share2 size={20} />
             </button>
          </div>
          <div className="absolute bottom-6 left-6">
             <h1 className="text-3xl font-bold text-white mb-2">{provider.name}</h1>
             <div className="flex gap-2">
                {provider.professions.map(p => <Badge key={p} color="gray">{p}</Badge>)}
             </div>
          </div>
       </div>

       <div className="p-6 -mt-6 rounded-t-3xl bg-gray-50 relative z-10 space-y-6">
          
          {/* Credentials Button */}
          <button 
             onClick={() => provider.cvUrl ? alert(`Abriendo documento: ${provider.cvUrl}`) : alert("El usuario no ha hecho público sus documentos.")}
             className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                 <FileText size={24} />
             </div>
             <div className="text-left flex-1">
                 <p className="font-bold text-gray-900">Ver Credenciales / CV</p>
                 <p className="text-xs text-gray-500">Documentación Verificada</p>
             </div>
             <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button onClick={() => setShowSimModal(true)} className="w-full bg-emerald-50 p-4 rounded-2xl flex items-center justify-between border border-emerald-100 hover:bg-emerald-100 transition-colors">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Calculator size={24} /></div>
                <div className="text-left">
                   <p className="font-bold text-emerald-900">Simular Puntos</p>
                   <p className="text-xs text-emerald-600">Calcula cuánto ganarías</p>
                </div>
             </div>
             <ChevronRight size={20} className="text-emerald-400" />
          </button>

          <div>
             <h3 className="font-bold text-gray-900 mb-3">Tarifas</h3>
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                {provider.tariffs.map((t, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                      <span className="font-medium text-gray-700">{t.service}</span>
                      <span className="font-bold text-blue-600">Bs. {t.price}</span>
                   </div>
                ))}
             </div>
          </div>

          <div>
             <h3 className="font-bold text-gray-900 mb-3">Sobre mí</h3>
             <p className="text-gray-500 text-sm leading-relaxed bg-white p-4 rounded-2xl shadow-sm border border-gray-100">{provider.bio}</p>
          </div>
       </div>

       <div className="fixed bottom-6 left-0 right-0 p-4 bg-transparent max-w-[360px] mx-auto z-30">
          <Button fullWidth icon={MessageCircle} onClick={() => setShowRequestModal(true)}>SOLICITAR SERVICIO</Button>
       </div>

       <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Solicitar Contacto" position="bottom">
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

export const ClientProfileView: React.FC<{ profile: UserData, onNavigate: (v: ViewState) => void }> = ({ profile, onNavigate }) => {
    const [showSimModal, setShowSimModal] = useState(false);
    const [simAmount, setSimAmount] = useState('');
    
    const calculatePoints = () => {
      const num = parseFloat(simAmount);
      return isNaN(num) ? 0 : Math.floor(num / 10); // 10 Bs = 1 Point
    };

    return (
        <div className="p-6 pb-24 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
            
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                        {profile.image ? <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" /> : <User className="text-gray-400" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                        <p className="text-gray-500 text-sm">{profile.email || 'Agrega tu correo'}</p>
                    </div>
                </div>
                <button className="text-blue-600 font-bold text-sm">Editar</button>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl shadow-gray-200">
                <div className="relative z-10">
                    <p className="text-gray-400 text-[10px] font-bold tracking-wider mb-2">MIS PUNTOS</p>
                    <p className="text-white text-5xl font-black tracking-tight">{profile.loyaltyPoints || 0}</p>
                    <p className="text-gray-400 text-xs mt-4">1 Punto = 1 Bs para futuros pagos.</p>
                    <p className="text-gray-500 text-[10px] mt-1">(10 Bs gastados = 1 Punto ganado)</p>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-10 text-white">
                    <Star size={140} />
                </div>
                <button onClick={() => setShowSimModal(true)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Simular Puntos">
                   <Calculator size={18} className="text-white" />
                </button>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">¿Ofreces algún servicio?</h3>
                    <p className="text-blue-100 text-sm mb-4">Crea tu perfil de trabajador, sube tu CV y empieza a ganar dinero con tus habilidades.</p>
                    <button 
                        onClick={() => onNavigate('ONBOARDING_PROVIDER')}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                        Crear Perfil de Trabajador
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {[
                    { icon: CreditCard, label: "Métodos de Pago", action: () => alert("Gestión de tarjetas") },
                    { icon: HelpCircle, label: "Centro de Ayuda y Quejas", action: () => onNavigate('HELP') },
                    { icon: ShieldCheck, label: "Términos de Uso", action: () => onNavigate('TERMS') },
                ].map((item, i) => (
                    <button key={i} onClick={item.action} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                            <item.icon size={20} className="text-gray-900" />
                            <span className="font-medium text-gray-900">{item.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>
                ))}
                
                {/* Admin Button */}
                 <button onClick={() => onNavigate('ADMIN')} className="w-full flex items-center justify-between p-4 bg-gray-900 rounded-2xl text-white hover:bg-black transition-colors shadow-sm mt-4">
                    <div className="flex items-center gap-3">
                        <span className="font-medium">Panel Administrador</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-500" />
                </button>
            </div>

            <Modal isOpen={showSimModal} onClose={() => setShowSimModal(false)} title="Simular Puntos">
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
        <div className="pb-24 w-full h-full flex flex-col bg-white">
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