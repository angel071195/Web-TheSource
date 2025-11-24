import React, { useState } from 'react';
import { Phone, ArrowRight, User, MapPin, Camera, Check, ChevronLeft, Upload, Briefcase, Mail, FileText } from 'lucide-react';
import { Button, Input, TextArea, Modal } from '../components/UIComponents';
import { CATEGORIES, PRICING_UNITS, BANKS_BOLIVIA, WALLETS_BOLIVIA, COLORS, AVATARS } from '../constants';
import { UserData, Tariff, PaymentMethod } from '../types';
import { TermsContent } from './ClientFlow';

interface LoginProps {
  onLogin: (type: 'CLIENT' | 'PROVIDER', initialData?: Partial<UserData>) => void;
}

// Custom Icons for aesthetic buttons
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/>
    <path d="M16.671 15.563l.532-3.49h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.514V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.672-4.533 4.697v2.66H7.078v3.49h3.047V24a12.09 12.09 0 003.75 0v-8.437h2.796z" fill="white"/>
  </svg>
);

export const LoginScreen: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'LANDING' | 'DETAILS' | 'PHOTO'>('LANDING');
  const [tempData, setTempData] = useState({ name: '', location: '', phone: '', email: '', image: '' });

  if (step === 'LANDING') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-300 relative overflow-hidden">
        {/* Abstract Background Shapes for Depth */}
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10">
          
          {/* 3D Card Container */}
          <div className="bg-white/80 backdrop-blur-xl w-full max-w-sm rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-white/50 p-8 flex flex-col items-center">
            
            {/* Logo with Shadow */}
            <div className="relative mb-8 group cursor-pointer">
              <div className="absolute inset-0 bg-black rounded-3xl blur-md opacity-30 translate-y-2 group-hover:translate-y-3 transition-transform duration-500"></div>
              <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center relative z-10 shadow-inner border-t border-gray-700 transform group-hover:-translate-y-1 transition-transform duration-500">
                <span className="text-white text-5xl font-black" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.5)' }}>S</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-1 drop-shadow-sm">THE SOURCE</h1>
            <p className="text-[10px] font-bold text-blue-600 tracking-[0.3em] mb-10 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Solutions App</p>

            <div className="w-full space-y-4">
              {/* Phone Input with Depth */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-2xl">
                   <Input 
                      icon={Phone} 
                      placeholder="Número de Celular" 
                      type="tel" 
                      value={tempData.phone}
                      onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                      className="mb-0 shadow-inner"
                    />
                </div>
              </div>

              {/* Aesthetic Google Button */}
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-gray-200 border border-gray-100 flex items-center justify-center gap-3 transition-transform active:scale-95">
                 <GoogleIcon />
                 <span>Continuar con Google</span>
              </button>

              {/* Aesthetic Facebook Button */}
              <button className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-transform active:scale-95">
                 <div className="bg-white rounded-full p-0.5"><FacebookIcon /></div>
                 <span>Continuar con Facebook</span>
              </button>

              <div className="pt-4">
                <Button onClick={() => setStep('DETAILS')} fullWidth icon={ArrowRight} className="bg-gray-900 hover:bg-black shadow-xl shadow-gray-400/50">
                  Iniciar Sesión
                </Button>
              </div>

              <div className="mt-4 text-center">
                 <p className="text-gray-400 text-xs mb-1">¿Aún no eres parte?</p>
                 <button onClick={() => setStep('DETAILS')} className="text-gray-900 font-black text-sm hover:underline tracking-wide">
                   CREAR CUENTA
                 </button>
              </div>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="mt-8 text-center space-y-1">
             <p className="text-[10px] text-gray-500 font-medium">© 2025 THE SOURCE. Todos los derechos reservados.</p>
             <p className="text-[10px] text-gray-400">Creado por <span className="font-bold text-gray-500">Angelo Mario Villarroel De La Fuente</span></p>
          </div>

        </div>
      </div>
    );
  }

  if (step === 'DETAILS') {
    return (
      <div className="flex flex-col min-h-screen bg-white p-6 pt-12 items-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-right duration-300">
         <div className="mb-8 flex flex-col items-center text-center">
             <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido!</h2>
             <p className="text-gray-500 mt-2">Verificaremos tu perfil en unos segundos.</p>
         </div>
         <div className="w-full space-y-4">
           <Input label="¿Cuál es tu nombre?" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} placeholder="Nombre completo" icon={User} />
           <Input label="Correo Electrónico" value={tempData.email} onChange={(e) => setTempData({...tempData, email: e.target.value})} placeholder="ejemplo@correo.com" type="email" icon={Mail} />
           <Input label="¿Dónde te ubicas?" value={tempData.location} onChange={(e) => setTempData({...tempData, location: e.target.value})} placeholder="Ciudad, Barrio" icon={MapPin} />
           <Button fullWidth onClick={() => setStep('PHOTO')}>Continuar</Button>
         </div>
      </div>
    );
  }

  if (step === 'PHOTO') {
    return (
      <div className="flex flex-col min-h-screen bg-white p-6 pt-12 items-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-right duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
          <p className="text-gray-500 mb-6 text-center">Sube una foto o elige un avatar.</p>
          
          <button className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-xl flex items-center justify-center mb-6 hover:bg-gray-200 transition-colors">
              <Camera size={32} className="text-gray-400" />
          </button>

          <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">O elige uno</p>
          
          <div className="grid grid-cols-3 gap-4 w-full mb-8">
              {AVATARS.map((avatar, i) => (
                  <button 
                    key={i}
                    onClick={() => setTempData({...tempData, image: avatar})}
                    className={`p-1 rounded-full border-2 transition-all ${tempData.image === avatar ? 'border-blue-500 scale-110' : 'border-transparent hover:bg-gray-50'}`}
                  >
                      <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full rounded-full" />
                  </button>
              ))}
          </div>

          <div className="w-full mt-auto">
            <Button fullWidth onClick={() => onLogin('CLIENT', tempData)}>Finalizar</Button>
          </div>
      </div>
    );
  }
  return null;
};

export const ProviderOnboarding: React.FC<{ 
  onComplete: (data: Partial<UserData>) => void,
  onCancel: () => void,
  showBonusModal: boolean,
  bonusAmount: number,
  onCloseBonus: () => void
}> = ({ onComplete, onCancel, showBonusModal, bonusAmount, onCloseBonus }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserData>>({
      name: '', age: '', phone: '', location: '', bio: '',
      professions: [], customProfession: '', tariffs: [], 
      paymentMethods: [], acceptedTerms: false, issuesInvoice: false
  });
  
  const [newTariff, setNewTariff] = useState<Tariff>({service: '', price: '', unit: 'fixed'});
  const [tempPayment, setTempPayment] = useState<{type: 'BANK' | 'WALLET', entity: string, number: string}>({ type: 'WALLET', entity: '', number: '' });
  const [showTermsModal, setShowTermsModal] = useState(false);

  const toggleProfession = (label: string) => {
    const current = formData.professions || [];
    if (current.includes(label)) {
      setFormData({ ...formData, professions: current.filter(x => x !== label) });
    } else {
      setFormData({ ...formData, professions: [...current, label] });
    }
  };

  const addTariff = () => {
    if (newTariff.service && newTariff.price) {
       setFormData({ ...formData, tariffs: [...(formData.tariffs || []), newTariff] });
       setNewTariff({ service: '', price: '', unit: 'fixed' });
    }
  };

  const addPaymentMethod = () => {
      if (tempPayment.entity && tempPayment.number) {
          const newMethod: PaymentMethod = {
              id: Math.random().toString(),
              type: tempPayment.type,
              title: tempPayment.entity,
              details: tempPayment.number
          };
          setFormData({ ...formData, paymentMethods: [...(formData.paymentMethods || []), newMethod] });
          setTempPayment({ type: 'WALLET', entity: '', number: '' });
      }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto w-full relative">
       {/* Header */}
       <div className="px-6 pt-6 pb-2 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
             <ChevronLeft size={24} />
          </button>
          <div className="flex gap-1.5">
             {[1,2,3,4].map(i => ( // Reduced to 4 steps
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-gray-900' : 'w-2 bg-gray-200'}`} />
             ))}
          </div>
          <div className="w-8" />
       </div>

       <div className="p-6 flex-1 overflow-y-auto pb-24">
          {step === 1 && (
             <div className="animate-in fade-in slide-in-from-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos Personales</h2>
                <Input label="Nombre Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <div className="flex gap-4">
                   <Input label="Edad" type="number" className="flex-1" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                   <Input label="Celular" type="tel" className="flex-1" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <Input label="Ubicación" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <TextArea label="Sobre Ti" placeholder="Describe tu experiencia..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
             </div>
          )}

          {step === 2 && (
             <div className="animate-in fade-in slide-in-from-right">
                <h2 className="text-2xl font-bold text-gray-900">Profesión y Tarifas</h2>
                <p className="text-gray-500 mb-6">¿A qué te dedicas?</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                   {CATEGORIES.map(cat => {
                      const isActive = formData.professions?.includes(cat.label);
                      return (
                        <button 
                          key={cat.id} 
                          onClick={() => toggleProfession(cat.label)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                            isActive ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600'
                          }`}
                        >
                          {cat.icon}
                          <span className="text-xs font-medium">{cat.label}</span>
                        </button>
                      );
                   })}
                   <button 
                      onClick={() => toggleProfession('Otro')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                        formData.professions?.includes('Otro') ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                        <Briefcase size={20} />
                        <span className="text-xs font-medium">Otro</span>
                    </button>
                </div>

                {formData.professions?.includes('Otro') && (
                    <Input label="Especificar otra profesión" value={formData.customProfession} onChange={(e) => setFormData({...formData, customProfession: e.target.value})} />
                )}

                <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100 flex items-center justify-between">
                    <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">¿Emite Factura?</p>
                        <p className="text-xs text-gray-500">Aparecerá en tu perfil para los clientes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={formData.issuesInvoice} 
                            onChange={e => setFormData({...formData, issuesInvoice: e.target.checked})} 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <h3 className="font-bold text-gray-900 mb-3">Tus Tarifas</h3>
                {formData.tariffs?.map((t, i) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl mb-2 border border-gray-100">
                      <span className="font-semibold text-sm">{t.service}</span>
                      <span className="text-blue-600 font-bold text-sm">Bs. {t.price} <span className="text-xs text-gray-400 font-normal">/ {PRICING_UNITS.find(u => u.value === t.unit)?.label}</span></span>
                   </div>
                ))}
                
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mt-4">
                   <Input 
                      placeholder="Nombre Servicio (ej. Limpieza)" 
                      value={newTariff.service} 
                      onChange={e => setNewTariff({...newTariff, service: e.target.value})} 
                      className="mb-3"
                   />
                   <div className="flex gap-3 mb-3">
                      <Input 
                         type="number" 
                         placeholder="Precio" 
                         value={newTariff.price.toString()} 
                         onChange={e => setNewTariff({...newTariff, price: e.target.value})} 
                         className="flex-1 mb-0"
                      />
                      <select 
                        className="flex-1 bg-white border border-gray-200 rounded-2xl px-3 outline-none focus:border-blue-500 text-sm"
                        value={newTariff.unit}
                        onChange={e => setNewTariff({...newTariff, unit: e.target.value})}
                      >
                         {PRICING_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                   </div>
                   <Button variant="secondary" fullWidth onClick={addTariff}>+ Agregar Tarifa</Button>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="animate-in fade-in slide-in-from-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificación</h2>
                <p className="text-gray-500 mb-6">Documentos para generar confianza.</p>
                
                <p className="font-bold text-sm mb-2">Carnet de Identidad (Obligatorio)</p>
                <div className="flex gap-4 mb-6">
                   <button 
                     onClick={() => setFormData({...formData, idFront: 'uploaded'})}
                     className={`flex-1 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${formData.idFront ? 'bg-green-50 border-green-400 text-green-600' : 'bg-gray-50 border-gray-300 text-gray-400'}`}
                   >
                      <Camera size={24} className="mb-2" />
                      <span className="text-xs font-bold">{formData.idFront ? 'Cargado' : 'Anverso'}</span>
                   </button>
                   <button 
                     onClick={() => setFormData({...formData, idBack: 'uploaded'})}
                     className={`flex-1 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${formData.idBack ? 'bg-green-50 border-green-400 text-green-600' : 'bg-gray-50 border-gray-300 text-gray-400'}`}
                   >
                      <Camera size={24} className="mb-2" />
                      <span className="text-xs font-bold">{formData.idBack ? 'Cargado' : 'Reverso'}</span>
                   </button>
                </div>
                
                <h3 className="font-bold text-gray-900 text-sm mb-2">Currículum / Certificado (Opcional)</h3>
                <button 
                    onClick={() => setFormData({...formData, cv: 'uploaded'})}
                    className="w-full h-16 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 flex items-center justify-center gap-3 text-purple-600 font-bold hover:bg-purple-100 transition-colors mb-6"
                >
                    <FileText size={24} />
                    {formData.cv ? 'Documento Subido' : 'Subir Documento (PDF/Foto)'}
                </button>

                <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200">
                    <input type="checkbox" className="w-5 h-5 rounded text-gray-900 focus:ring-gray-900" defaultChecked={true} />
                    <span className="font-medium text-gray-900 text-sm">Declaro ser mayor de edad.</span>
                </label>
             </div>
          )}

          {step === 4 && ( // Merged Payment and Terms
             <div className="animate-in fade-in slide-in-from-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Métodos de Cobro</h2>
                <p className="text-gray-500 mb-6">¿Cómo te pagarán los clientes?</p>
                
                {/* Payment Methods List */}
                {formData.paymentMethods?.map((pm, i) => (
                    <div key={i} className="bg-gray-100 p-3 rounded-xl mb-2 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-xs">{pm.title}</p>
                            <p className="text-xs text-gray-500">{pm.details}</p>
                        </div>
                        <Check size={16} className="text-green-500"/>
                    </div>
                ))}

                {/* Add Payment Form */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 mt-4 mb-8">
                    <div className="flex gap-2 mb-4">
                        <button 
                            onClick={() => setTempPayment({...tempPayment, type: 'WALLET'})}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold ${tempPayment.type === 'WALLET' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                            Billetera Móvil
                        </button>
                        <button 
                            onClick={() => setTempPayment({...tempPayment, type: 'BANK'})}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold ${tempPayment.type === 'BANK' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                            Cuenta Bancaria
                        </button>
                    </div>

                    <div className="space-y-3">
                        <select 
                            className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none text-sm"
                            value={tempPayment.entity}
                            onChange={(e) => setTempPayment({...tempPayment, entity: e.target.value})}
                        >
                            <option value="">Seleccionar Entidad</option>
                            {(tempPayment.type === 'WALLET' ? WALLETS_BOLIVIA : BANKS_BOLIVIA).map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                        <Input 
                            placeholder="Número de Cuenta / Celular" 
                            value={tempPayment.number} 
                            onChange={(e) => setTempPayment({...tempPayment, number: e.target.value})} 
                        />
                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                            <Upload size={16}/> Subir Imagen QR (Opcional)
                        </button>
                        <Button variant="secondary" fullWidth onClick={addPaymentMethod} disabled={!tempPayment.entity || !tempPayment.number}>
                            Agregar Método
                        </Button>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                   <p className="text-sm text-blue-800 leading-relaxed mb-2">
                      Al continuar, aceptas los <button onClick={() => setShowTermsModal(true)} className="font-bold underline cursor-pointer">Términos y Condiciones</button>, Políticas de Privacidad y el modelo de cobro de <strong>Source Solution APP</strong>.
                   </p>
                   <p className="text-xs text-blue-600 font-bold">
                       * The Source cobra una comisión del 5% sobre el total de los servicios prestados.
                   </p>
                </div>
                <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200">
                    <input type="checkbox" className="w-5 h-5 rounded text-gray-900 focus:ring-gray-900" checked={formData.acceptedTerms} onChange={e => setFormData({...formData, acceptedTerms: e.target.checked})} />
                    <span className="font-bold text-gray-900 text-sm">He leído y acepto los términos.</span>
                </label>
             </div>
          )}
       </div>

       <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
          <Button fullWidth onClick={step === 4 ? () => onComplete(formData) : () => setStep(step + 1)} disabled={step === 4 && !formData.acceptedTerms}>
             {step === 4 ? 'Finalizar Registro' : 'Continuar'}
          </Button>
       </div>

       <Modal isOpen={showBonusModal} onClose={onCloseBonus}>
           <div className="flex flex-col items-center text-center">
              <SparklesIcon />
              <h2 className="text-2xl font-black text-gray-900 mt-4">¡FELICIDADES!</h2>
              <p className="text-gray-500 mt-2 mb-6">Eres de los primeros 100 trabajadores. Tienes un bono inicial.</p>
              <div className="bg-gray-900 rounded-2xl p-6 w-full mb-6">
                  <p className="text-gray-400 text-xs font-bold tracking-wider mb-1">SALDO DISPONIBLE</p>
                  <p className="text-4xl font-black text-yellow-400">Bs. {bonusAmount}</p>
              </div>
              <Button fullWidth onClick={onCloseBonus}>Ir a mi Panel</Button>
           </div>
       </Modal>
       
       <Modal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} title="Términos y Condiciones">
           <div className="max-h-[60vh] overflow-y-auto">
                <TermsContent />
           </div>
           <Button fullWidth onClick={() => setShowTermsModal(false)} className="mt-4">Cerrar</Button>
       </Modal>
    </div>
  );
};

const SparklesIcon = () => (
    <div className="relative">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
    </div>
);