
import React, { useState, useRef, useEffect } from 'react';
import { Phone, ArrowRight, User, MapPin, Camera, Check, ChevronLeft, Upload, Briefcase, Mail, FileText, Crosshair, Loader2, Plus, Navigation, Map } from 'lucide-react';
import { Button, Input, TextArea, Modal, VerificationCard, LoadingButton } from '../components/UIComponents';
import { CATEGORIES, PRICING_UNITS, BANKS_BOLIVIA, WALLETS_BOLIVIA, COLORS } from '../constants';
import { UserData, Tariff, PaymentMethod } from '../types';
import { TermsContent } from './ClientFlow';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";

interface LoginProps {
  onLogin: (type: 'CLIENT' | 'PROVIDER', initialData?: Partial<UserData>) => void;
  onSocialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  currentUser?: any; // Added currentUser prop
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

const BOLIVIA_CITIES = [
  "Santa Cruz de la Sierra", "Puerto Quijarro", "Puerto Suárez", "La Paz", "El Alto", 
  "Cochabamba", "Oruro", "Sucre", "Tarija", "Potosí", "Trinidad", "Cobija", 
  "Montero", "Warnes", "Cotoca", "Yacuiba", "Riberalta", "Viacha"
];

export const LoginScreen: React.FC<LoginProps> = ({ onLogin, onSocialLogin, currentUser }) => {
  const [step, setStep] = useState<'LANDING' | 'DETAILS' | 'PHOTO'>('LANDING');
  const [tempData, setTempData] = useState({ name: '', location: '', phone: '', email: '', image: '' });
  
  // Location States
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  // Photo Upload State
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTempData({...tempData, location: text});
    
    if (text.length > 2) {
      const filtered = BOLIVIA_CITIES.filter(city => 
        city.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (city: string) => {
    setTempData({...tempData, location: city});
    setSuggestions([]);
  };

  const handleGPSLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setTempData({...tempData, location: "Puerto Quijarro, Santa Cruz"});
            setIsLocating(false);
            setSuggestions([]);
          }, 1500);
        },
        (error) => {
          console.error(error);
          alert("No pudimos obtener tu ubicación precisa. Por favor ingrésala manualmente.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
      setIsLocating(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const uniqueName = `profile_photos/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, uniqueName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setTempData({ ...tempData, image: downloadURL });
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error al subir la foto. Inténtalo de nuevo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const saveClientProfile = async () => {
      if (!currentUser?.uid) {
          onLogin('CLIENT', tempData);
          return;
      }
      try {
          // SAVE TO FIRESTORE 'users' COLLECTION
          // Using setDoc with { merge: true } prevents duplicates and just updates existing info
          await setDoc(doc(db, "users", currentUser.uid), {
              ...tempData,
              uid: currentUser.uid,
              userType: 'CLIENT',
              lastLogin: new Date().toISOString()
          }, { merge: true });
          
          console.log("Client profile saved to Cloud");
          onLogin('CLIENT', tempData);
      } catch (error) {
          console.error("Error saving client profile:", error);
          onLogin('CLIENT', tempData); // Proceed anyway locally
      }
  };

  if (step === 'LANDING') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-300 relative overflow-hidden items-center justify-center">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="w-full max-w-sm p-6 relative z-10">
          {/* 3D Card Container */}
          <div className="bg-white/80 backdrop-blur-xl w-full rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-white/50 p-8 flex flex-col items-center">
            {/* Logo */}
            <div className="relative mb-8 group cursor-pointer">
              <div className="absolute inset-0 bg-black rounded-3xl blur-md opacity-30 translate-y-2 group-hover:translate-y-3 transition-transform duration-500"></div>
              <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center relative z-10 shadow-inner border-t border-gray-700 transform group-hover:-translate-y-1 transition-transform duration-500">
                <span className="text-white text-5xl font-black" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.5)' }}>S</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-1 drop-shadow-sm">THE SOURCE</h1>
            <p className="text-[10px] font-bold text-blue-600 tracking-[0.3em] mb-10 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Solutions App</p>

            <div className="w-full space-y-4">
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

              <button onClick={() => onSocialLogin('google')} className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-gray-200 border border-gray-100 flex items-center justify-center gap-3 transition-transform active:scale-95">
                 <GoogleIcon />
                 <span>Continuar con Google</span>
              </button>

              <button 
                onClick={() => onSocialLogin('facebook')} 
                className="w-full bg-[#1877F2]/50 cursor-not-allowed text-white/80 font-bold py-3.5 px-4 rounded-2xl shadow-none border border-blue-200/50 flex items-center justify-center gap-3 transition-none relative overflow-hidden"
              >
                 <div className="bg-white/20 rounded-full p-0.5 opacity-60"><FacebookIcon /></div>
                 <span>Continuar con Facebook</span>
                 <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                    Próximamente
                 </div>
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
      <div className="flex flex-col min-h-screen bg-white p-6 pt-12 items-center justify-center animate-in fade-in slide-in-from-right duration-300">
         <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido!</h2>
                <p className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full mb-2">Creando perfil de Cliente</p>
                <p className="text-gray-500 text-sm">Verificaremos tu perfil en unos segundos.</p>
            </div>
            <div className="space-y-4">
              <Input label="¿Cuál es tu nombre?" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} placeholder="Nombre completo" icon={User} />
              <Input label="Correo Electrónico" value={tempData.email} onChange={(e) => setTempData({...tempData, email: e.target.value})} placeholder="ejemplo@correo.com" type="email" icon={Mail} />
              
              <div className="relative mb-4 w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">¿Dónde te ubicas?</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={20} />
                  </div>
                  <input 
                    className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none py-3.5 pl-12 pr-12 placeholder:text-gray-400 transition-all"
                    placeholder="Escribe tu ciudad o barrio..."
                    value={tempData.location}
                    onChange={handleLocationChange}
                  />
                  <button 
                      type="button"
                      onClick={handleGPSLocation}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 rounded-xl transition-colors"
                      title="Usar GPS"
                  >
                      {isLocating ? <Loader2 size={18} className="animate-spin" /> : <Crosshair size={18} />}
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-2 max-h-40 overflow-y-auto animate-in fade-in zoom-in duration-200">
                    {suggestions.map((city, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => selectSuggestion(city)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 font-medium flex items-center gap-2 border-b border-gray-50 last:border-0"
                      >
                        <MapPin size={14} className="text-gray-400" />
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button fullWidth onClick={() => setStep('PHOTO')} disabled={!tempData.name || !tempData.location}>Continuar</Button>
            </div>
         </div>
      </div>
    );
  }

  if (step === 'PHOTO') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6 items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="w-full max-w-sm flex flex-col items-center bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-200 border border-white">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Tu Foto de Perfil</h2>
            <p className="text-gray-400 mb-8 text-center text-sm font-medium">Personaliza tu experiencia. Es opcional.</p>
            
            <input 
              type="file" 
              ref={photoInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoSelect} 
            />

            <button 
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhoto}
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center mb-10 transition-all duration-500 relative group shadow-2xl ${
                tempData.image && !tempData.image.includes('dicebear')
                  ? 'bg-white' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-white'
              }`}
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white flex items-center justify-center bg-white">
                  {uploadingPhoto ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={32} className="animate-spin text-blue-600" />
                        <span className="text-[10px] font-bold text-blue-600">SUBIENDO</span>
                      </div>
                  ) : tempData.image && !tempData.image.includes('dicebear') ? (
                      <img src={tempData.image} alt="Uploaded" className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-6xl shadow-inner">
                         {tempData.name.charAt(0).toUpperCase()}
                      </div>
                  )}

                  {!uploadingPhoto && (
                    <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${tempData.image ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                       <Camera className="text-white" size={32} />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-full shadow-lg border-2 border-white transform group-hover:scale-110 transition-transform">
                   <Plus size={16} />
                </div>
            </button>

            <div className="w-full space-y-3">
              <Button fullWidth onClick={saveClientProfile} disabled={uploadingPhoto} className="h-14 text-lg bg-gray-900 hover:bg-black shadow-xl shadow-gray-300">
                 {tempData.image ? 'Finalizar Registro' : 'Continuar sin foto'}
              </Button>
              
              {!tempData.image && (
                <p className="text-center text-xs text-gray-400 font-medium">
                  Se usará la inicial de tu nombre
                </p>
              )}
            </div>
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
  onCloseBonus: () => void,
  currentUser: any
}> = ({ onComplete, onCancel, showBonusModal, bonusAmount, onCloseBonus, currentUser }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserData>>({
      name: currentUser?.displayName || '',
      email: currentUser?.email || '',
      age: '', phone: '', location: '', bio: '',
      professions: [], customProfession: '', tariffs: [], 
      paymentMethods: [], acceptedTerms: false, issuesInvoice: false
  });
  
  // NEW: GPS State
  const [locationCoords, setLocationCoords] = useState<{latitude: number, longitude: number} | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [docId, setDocId] = useState<string | null>(null);

  // Firestore Profile Fetching Logic (Edit Mode)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.uid) return;
      try {
        const q = query(collection(db, "solicitudes_servicio"), where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setDocId(doc.id);
          const data = doc.data();
          setFormData(prev => ({ ...prev, ...data }));
          
          // Load saved coords if available
          if (data.latitude && data.longitude) {
              setLocationCoords({ latitude: data.latitude, longitude: data.longitude });
          }
          console.log("Perfil cargado:", doc.id);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };
    fetchProfile();
  }, [currentUser]);

  // GPS Function
  const handleGetLocation = () => {
      setGettingLocation(true);
      if (!navigator.geolocation) {
          alert("Geolocalización no soportada en este navegador.");
          setGettingLocation(false);
          return;
      }
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const { latitude, longitude } = position.coords;
              setLocationCoords({ latitude, longitude });
              setGettingLocation(false);
          },
          (error) => {
              console.error(error);
              alert("La ubicación es obligatoria para ofrecer servicios cercanos.");
              setGettingLocation(false);
          }
      );
  };

  const [newTariff, setNewTariff] = useState<Tariff>({service: '', price: '', unit: 'fixed'});
  const [tempPayment, setTempPayment] = useState<{type: 'BANK' | 'WALLET', entity: string, number: string}>({ type: 'WALLET', entity: '', number: '' });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submitStage, setSubmitStage] = useState<'IDLE' | 'ENCRYPTING' | 'UPLOADING' | 'FINALIZING'>('IDLE');
  
  const [uploadingIdFront, setUploadingIdFront] = useState(false);
  const [uploadingIdBack, setUploadingIdBack] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingQR, setUploadingQR] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");

  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

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
              details: tempPayment.number,
              qrImage: qrUrl
          };
          setFormData({ ...formData, paymentMethods: [...(formData.paymentMethods || []), newMethod] });
          setTempPayment({ type: 'WALLET', entity: '', number: '' });
          setQrUrl(""); 
      }
  };

  const uploadImageToFirebase = async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error al subir la imagen. Inténtalo de nuevo.");
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ID_FRONT' | 'ID_BACK' | 'CV' | 'QR') => {
      const file = e.target.files?.[0];
      if (!file) return;

      const uniqueName = `${Date.now()}_${file.name}`;

      try {
        if (type === 'ID_FRONT') {
            setUploadingIdFront(true);
            const url = await uploadImageToFirebase(file, `documents/id_front/${uniqueName}`);
            setFormData(prev => ({ ...prev, idFront: url }));
        } else if (type === 'ID_BACK') {
            setUploadingIdBack(true);
            const url = await uploadImageToFirebase(file, `documents/id_back/${uniqueName}`);
            setFormData(prev => ({ ...prev, idBack: url }));
        } else if (type === 'CV') {
            setUploadingCV(true);
            const url = await uploadImageToFirebase(file, `documents/cv/${uniqueName}`);
            setFormData(prev => ({ ...prev, cv: url }));
        } else if (type === 'QR') {
            setUploadingQR(true);
            const url = await uploadImageToFirebase(file, `payments/qr/${uniqueName}`);
            setQrUrl(url);
            alert("QR subido correctamente. Ahora puedes agregar el método de pago.");
        }
      } catch (error) {
        console.error("File upload failed", error);
      } finally {
        // Stop spinners safely
        setUploadingIdFront(false);
        setUploadingIdBack(false);
        setUploadingCV(false);
        setUploadingQR(false);
      }
  };

  const handleSmartSubmit = async () => {
    console.log("Guardando datos..."); // DEBUG LOG
    setSubmitStage('ENCRYPTING');
    
    // --- ANTI-DUPLICATE VALIDATION ---
    try {
      if (formData.phone) {
        const phoneQuery = query(collection(db, "solicitudes_servicio"), where("phone", "==", formData.phone));
        const phoneSnapshot = await getDocs(phoneQuery);
        
        const isDuplicate = phoneSnapshot.docs.some(doc => {
           const data = doc.data();
           // Check if duplicate belongs to DIFFERENT user (allow self-update)
           return data.uid !== currentUser?.uid;
        });

        if (isDuplicate) {
           alert("⛔ Este número de celular ya está registrado por otro usuario.");
           setSubmitStage('IDLE');
           return; // STOP SUBMISSION
        }
      }
    } catch (e) {
      console.error("Validation check failed", e);
      // Continue cautiously or stop? We continue but log it.
    }
    // ---------------------------------

    await new Promise(r => setTimeout(r, 1000));
    setSubmitStage('UPLOADING');
    
    try {
        const finalData = { 
            ...formData, 
            uid: currentUser?.uid,
            email: currentUser?.email,
            updatedAt: new Date().toISOString(),
            latitude: locationCoords?.latitude,
            longitude: locationCoords?.longitude
        };

        if (docId) {
            await updateDoc(doc(db, "solicitudes_servicio", docId), finalData);
            alert("Perfil Actualizado Correctamente");
        } else {
            await addDoc(collection(db, "solicitudes_servicio"), {
                ...finalData,
                createdAt: new Date().toISOString()
            });
        }
        
        setSubmitStage('FINALIZING');
        await new Promise(r => setTimeout(r, 1000));
        onComplete(formData);
        
    } catch (error) {
        console.error("Error saving profile:", error); // DEBUG ERROR
        alert("Error al guardar perfil: " + (error as any).message);
        setSubmitStage('IDLE');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full relative">
      <div className="w-full max-w-2xl mx-auto bg-white min-h-screen shadow-sm flex flex-col">
       <div className="px-6 pt-6 pb-2 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <button type="button" onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
             <ChevronLeft size={24} />
          </button>
          <div className="flex gap-1.5">
             {[1,2,3,4].map(i => (
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
                
                {/* MANDATORY GPS BUTTON */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Geolocalización (Obligatorio)</label>
                    <button 
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gettingLocation || !!locationCoords}
                        className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 font-bold transition-all ${
                            locationCoords 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100'
                        }`}
                    >
                        {gettingLocation ? <Loader2 className="animate-spin" size={20}/> : locationCoords ? <Check size={20}/> : <Navigation size={20}/>}
                        {gettingLocation ? 'Obteniendo ubicación...' : locationCoords ? 'Ubicación Detectada' : '📍 Activar mi Ubicación GPS'}
                    </button>
                    {!locationCoords && <p className="text-xs text-red-500 mt-1 font-medium">* Requerido para continuar</p>}
                </div>

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
                          type="button"
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
                      type="button"
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
                   <Button variant="secondary" fullWidth onClick={addTariff} type="button">+ Agregar Tarifa</Button>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="animate-in fade-in slide-in-from-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificación</h2>
                <p className="text-gray-500 mb-6">Documentos para generar confianza.</p>
                
                <input type="file" ref={idFrontInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'ID_FRONT')} />
                <input type="file" ref={idBackInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'ID_BACK')} />
                <input type="file" ref={cvInputRef} className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'CV')} />

                <p className="font-bold text-sm mb-2">Carnet de Identidad (Obligatorio)</p>
                <div className="flex gap-4 mb-6">
                   <button 
                     type="button"
                     onClick={() => idFrontInputRef.current?.click()}
                     disabled={uploadingIdFront}
                     className={`flex-1 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${formData.idFront ? 'bg-green-50 border-green-400 text-green-600' : 'bg-gray-50 border-gray-300 text-gray-400'}`}
                   >
                      {uploadingIdFront ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} className="mb-2" />}
                      <span className="text-xs font-bold">{uploadingIdFront ? 'Subiendo...' : formData.idFront ? 'Cargado' : 'Anverso'}</span>
                   </button>
                   <button 
                     type="button"
                     onClick={() => idBackInputRef.current?.click()}
                     disabled={uploadingIdBack}
                     className={`flex-1 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${formData.idBack ? 'bg-green-50 border-green-400 text-green-600' : 'bg-gray-50 border-gray-300 text-gray-400'}`}
                   >
                      {uploadingIdBack ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} className="mb-2" />}
                      <span className="text-xs font-bold">{uploadingIdBack ? 'Subiendo...' : formData.idBack ? 'Cargado' : 'Reverso'}</span>
                   </button>
                </div>
                
                <h3 className="font-bold text-gray-900 text-sm mb-2">Currículum / Certificado (Opcional)</h3>
                <button 
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    disabled={uploadingCV}
                    className="w-full h-16 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 flex items-center justify-center gap-3 text-purple-600 font-bold hover:bg-purple-100 transition-colors mb-6"
                >
                    {uploadingCV ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
                    {uploadingCV ? 'Subiendo...' : formData.cv ? 'Documento Subido' : 'Subir Documento (PDF/Foto)'}
                </button>

                <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200">
                    <input type="checkbox" className="w-5 h-5 rounded text-gray-900 focus:ring-gray-900" defaultChecked={true} />
                    <span className="font-medium text-gray-900 text-sm">Declaro ser mayor de edad.</span>
                </label>
             </div>
          )}

          {step === 4 && (
             <div className="animate-in fade-in slide-in-from-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Métodos de Cobro</h2>
                <p className="text-gray-500 mb-6">¿Cómo te pagarán los clientes?</p>
                
                <input type="file" ref={qrInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'QR')} />

                {formData.paymentMethods?.map((pm, i) => (
                    <div key={i} className="bg-gray-100 p-3 rounded-xl mb-2 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-xs">{pm.title}</p>
                            <p className="text-xs text-gray-500">{pm.details}</p>
                            {pm.qrImage && <span className="text-[10px] text-green-600 font-bold">QR Adjunto</span>}
                        </div>
                        <Check size={16} className="text-green-500"/>
                    </div>
                ))}

                <div className="bg-white p-4 rounded-2xl border border-gray-200 mt-4 mb-8">
                    <div className="flex gap-2 mb-4">
                        <button 
                            type="button"
                            onClick={() => setTempPayment({...tempPayment, type: 'WALLET'})}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold ${tempPayment.type === 'WALLET' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                            Billetera Móvil
                        </button>
                        <button 
                            type="button"
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
                        <button 
                            type="button"
                            onClick={() => qrInputRef.current?.click()}
                            disabled={uploadingQR}
                            className={`w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors ${qrUrl ? 'text-green-600 bg-green-50 border-green-300' : 'text-gray-400'}`}
                        >
                            {uploadingQR ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16}/>} 
                            {uploadingQR ? 'Subiendo QR...' : qrUrl ? 'QR Cargado Exitosamente' : 'Subir Imagen QR (Opcional)'}
                        </button>
                        <Button variant="secondary" fullWidth onClick={addPaymentMethod} disabled={!tempPayment.entity || !tempPayment.number} type="button">
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

       <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 rounded-b-none lg:rounded-b-[32px]">
          {step === 4 ? (
             <LoadingButton 
                stage={submitStage} 
                onClick={handleSmartSubmit} 
                disabled={!formData.acceptedTerms} 
             />
          ) : (
            <Button fullWidth onClick={() => setStep(step + 1)} disabled={step === 1 && !locationCoords} type="button">
              {step === 1 && !locationCoords ? 'Requiere Ubicación' : 'Continuar'}
            </Button>
          )}
       </div>

       <Modal isOpen={showBonusModal} onClose={onCloseBonus}>
           <div className="flex flex-col items-center text-center">
              <SparklesIcon />
              <h2 className="text-2xl font-black text-gray-900 mt-4">¡FELICIDADES!</h2>
              <p className="text-gray-500 mt-2 mb-6">Eres miembro verificado de The Source.</p>
              
              <div className="w-full mb-6">
                 <VerificationCard 
                    name={formData.name || "Usuario Nuevo"} 
                    profession={formData.professions?.[0] || "Profesional"} 
                    image={formData.image} 
                 />
              </div>

              <div className="bg-gray-100 rounded-2xl p-4 w-full mb-4">
                  <p className="text-gray-400 text-xs font-bold tracking-wider mb-1">BONO INICIAL</p>
                  <p className="text-3xl font-black text-yellow-500">Bs. {bonusAmount}</p>
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
