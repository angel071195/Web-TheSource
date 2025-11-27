
import React, { useState, useEffect } from 'react';
import { Home, Search, PlusSquare, User, Inbox, Grid, Monitor, Wallet, LogOut, Menu } from 'lucide-react';
import { ViewState, UserType, UserData, Provider, Lead, AdminData, JobPost, UserDocument } from './types';
import { INITIAL_PROVIDERS } from './constants';
import emailjs from '@emailjs/browser';
import { auth, googleProvider, facebookProvider, signInWithPopup } from './firebaseConfig';

// Views
import { LoginScreen, ProviderOnboarding } from './views/AuthFlow';
import { HomeView, ProfileDetail, ClientProfileView, RequestServiceView, SearchView, TermsView } from './views/ClientFlow';
import { WorkerDashboard, WalletView, MyServicesPanel, JobClosingSimulation, OpportunitiesView, LeadDetailView } from './views/ProviderFlow';
import { AdminDashboard } from './views/AdminFlow';

// EMAILJS CONFIGURATION - REAL PRODUCTION CREDENTIALS
const EMAIL_SERVICE_ID = "service_ytz8gpd";
const EMAIL_TEMPLATE_ID = "template_gkqblyu";
const EMAIL_PUBLIC_KEY = "9DpJRC-7vdu7TOeXl";

const SantaHatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" className="absolute -top-3 -right-2 rotate-12 z-20">
    <path d="M10,80 Q50,10 90,80" fill="#dc2626" />
    <circle cx="90" cy="80" r="10" fill="white" />
    <rect x="5" y="75" width="90" height="15" rx="8" fill="white" />
  </svg>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [userType, setUserType] = useState<UserType>('CLIENT');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // Firebase User
  const [authLoading, setAuthLoading] = useState(true); // Critical for avoiding refresh bug
  
  // App State
  const [userData, setUserData] = useState<UserData>({
    name: 'Usuario Nuevo',
    location: 'Puerto Quijarro',
    loyaltyPoints: 0,
    walletBalance: 20,
    unlockedLeads: []
  });

  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [leads, setLeads] = useState<Lead[]>([
     { id: 'l1', clientName: 'Maria Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', location: 'Barrio Central', message: 'Necesito reparar un enchufe que hace corto.', status: 'LOCKED', date: 'Hoy', phone: '70012345', category: 'Electricista', budget: '50 Bs' },
     { id: 'l2', clientName: 'Juan Perez', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', location: 'Zona Norte', message: 'Cotización para cableado completo de sala.', status: 'UNLOCKED', date: 'Ayer', phone: '70099999', category: 'Electricista', budget: 'A convenir' }
  ]);

  const [jobPosts] = useState<JobPost[]>([
      {
          id: 'jp1',
          title: 'Reparación de Refrigerador',
          description: 'Mi refrigerador LG no enfría en la parte de abajo. Necesito un técnico urgente.',
          clientName: 'Pedro Gutierrez',
          location: 'Barrio Central',
          date: 'Hace 2 horas',
          category: 'Refrigeración',
          budget: 'A convenir'
      },
      {
          id: 'jp2',
          title: 'Instalación de Aire Acondicionado',
          description: 'Necesito instalar un aire de 12000 BTU en un segundo piso. Ya tengo el soporte.',
          clientName: 'Sofia Mendez',
          location: 'Zona Norte',
          date: 'Hace 5 horas',
          category: 'Técnico A/C',
          budget: '200 Bs'
      },
      {
          id: 'jp3',
          title: 'Pintado de Fachada',
          description: 'Busco pintor para una fachada de casa de una planta. Yo pongo la pintura.',
          clientName: 'Carlos Ruiz',
          location: 'Barrio Lindo',
          date: 'Ayer',
          category: 'Pintor',
          budget: '300 Bs'
      }
  ]);

  const [adminData, setAdminData] = useState<AdminData>({
      pendingRecharges: [
          {id: 'tx1', workerName: 'Carlos Mamani', amount: 50, date: 'Hoy', status: 'pending', proofUrl: ''},
          {id: 'tx2', workerName: 'Ana Flores', amount: 20, date: 'Ayer', status: 'pending', proofUrl: ''}
      ],
      jobAudits: [{id: 'jb1', service: 'Limpieza', amount: 100, warning: false, client: 'Maria'}, {id: 'jb2', service: 'Plomería', amount: 10, warning: true, client: 'Pedro'}],
      revenue: 1500,
      complaints: []
  });

  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);

  // Monitor Auth State & Admin Security (Firebase Auth)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      
      if (user) {
        // Update local user data
        setUserData(prev => ({ ...prev, email: user.email || prev.email }));
        
        // Auto-redirect if on LOGIN screen
        if (currentView === 'LOGIN') {
            setCurrentView('HOME');
        }
      }
      setAuthLoading(false); // Stop loading screen
    });
    return () => unsubscribe();
  }, [currentView]);

  // Monitor UserData Email for Admin Access (Manual + Social)
  useEffect(() => {
      const ADMIN_EMAIL = "elderangelo071195@gmail.com";
      // Check strictly against the email stored in userData (works for both Google and Manual login)
      if (userData.email && userData.email.trim().toLowerCase() === ADMIN_EMAIL) {
          setIsAdmin(true);
      } else {
          setIsAdmin(false);
      }
  }, [userData.email]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    if (providerName === 'facebook') {
      alert("🔒 Ingreso con Facebook disponible próximamente. Por favor usa Google.");
      return;
    }

    try {
      const provider = googleProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Social Login Success:", user.email);
      
      setUserData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        image: user.photoURL || prev.image
      }));
      
      // Redirect handled by onAuthStateChanged
      return user;
    } catch (error: any) {
      console.error("Social login error:", error);
      const errorMessage = typeof error === 'object' && error.message ? error.message : JSON.stringify(error);

      if (error.code === 'auth/unauthorized-domain') {
          // FALLBACK FOR PREVIEW ENVIRONMENTS
          const confirmMock = window.confirm("Error de Dominio: Este entorno de vista previa no está autorizado en Firebase. ¿Deseas ingresar con una sesión simulada para probar la app?");
          if (confirmMock) {
             const mockUser = {
                 displayName: "Usuario Prueba",
                 email: "usuario@prueba.com",
                 photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
             };
             setUserData(prev => ({ ...prev, name: mockUser.displayName, email: mockUser.email, image: mockUser.photoURL }));
             
             // Proceed to app
             navigateTo(userType === 'CLIENT' ? 'HOME' : 'ONBOARDING_PROVIDER');
             return;
          }
      } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
          console.log("User closed popup");
      } else {
          alert(`Error al iniciar sesión: ${errorMessage}`);
      }
    }
  };

  const navigateTo = (view: ViewState | 'HIRE_MODE') => {
    if (view === 'HIRE_MODE') {
        setCurrentView('HOME');
        return;
    }
    setSelectedProvider(null);
    setSelectedLead(null);
    setCurrentView(view);
  };

  const sendWelcomeEmail = (data: Partial<UserData>) => {
      if (!data.email || !data.name) return;

      const templateParams = {
          to_name: data.name,
          to_email: data.email,
          user_name: data.name,
          message: "Bienvenido a The Source. Tu registro ha sido exitoso.",
          reply_to: "contacto.thesource@gmail.com"
      };

      emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, EMAIL_PUBLIC_KEY)
          .then((response) => {
              console.log('Welcome Email Sent!', response.status, response.text);
          }, (err) => {
              console.log('Failed to send welcome email...', err);
          });
  };

  const handleJobSuccess = (points: number) => {
    const newPoints = (userData.loyaltyPoints || 0) + points;
    setUserData({ ...userData, loyaltyPoints: newPoints });
    alert(`¡Excelente! Has ganado +${points} puntos.`);
    setCurrentView('HOME');
  };

  const handleUnlockLead = (leadId: string) => {
      const COST = 3;
      
      // Check if already unlocked to prevent double charge
      if (userData.unlockedLeads?.includes(leadId)) {
          const lead = leads.find(l => l.id === leadId);
          if (lead) {
             setSelectedLead(lead);
             setCurrentView('LEAD_DETAIL');
          }
          return;
      }

      // Check balance
      if (userData.walletBalance < COST) {
          alert("Saldo insuficiente (Requiere 3 Bs). Por favor recarga tu billetera en la sección Billetera.");
          return;
      }

      // EXECUTE AUTOMATICALLY (No Confirm Dialog)
      
      // 1. Update User Wallet (-3 Bs) & Unlocked List
      setUserData(prev => ({
          ...prev,
          walletBalance: prev.walletBalance - COST,
          unlockedLeads: [...(prev.unlockedLeads || []), leadId]
      }));

      // 2. Update Admin Revenue (+3 Bs)
      setAdminData(prev => ({
          ...prev,
          revenue: prev.revenue + COST
      }));

      // 3. Update Lead Status locally
      setLeads(prev => prev.map(l => l.id === leadId ? {...l, status: 'UNLOCKED'} : l));

      // 4. Navigate immediately to Lead Profile
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
         setSelectedLead(lead);
         setCurrentView('LEAD_DETAIL');
      }
  };

  const handleViewLead = (lead: Lead) => {
      setSelectedLead(lead);
      setCurrentView('LEAD_DETAIL');
  };

  // ADMIN LOGIC: Approve Recharge
  const handleApproveRecharge = (rechargeId: string) => {
      const recharge = adminData.pendingRecharges.find(r => r.id === rechargeId);
      if (!recharge) return;

      // 1. Remove from pending list
      setAdminData(prev => ({
          ...prev,
          pendingRecharges: prev.pendingRecharges.filter(r => r.id !== rechargeId)
      }));

      // 2. Add Balance to User (Simulation: If user matches or generic success)
      if (userData.name === recharge.workerName) {
          setUserData(prev => ({
              ...prev,
              walletBalance: prev.walletBalance + recharge.amount
          }));
      }

      alert(`Recarga de Bs. ${recharge.amount} aprobada para ${recharge.workerName}. Saldo acreditado exitosamente.`);
  };

  const handleManualRecharge = (workerName: string, amount: number) => {
      alert(`Recarga manual de Bs. ${amount} realizada para ${workerName}.`);
      // Update logic would go here
  };

  const handleReport = (complaint: any) => {
      const newComplaint = {
          id: `comp_${Date.now()}`,
          reporter: userData.name,
          reportedUser: complaint.reportedUser,
          reason: complaint.reason,
          details: complaint.details,
          date: new Date().toLocaleDateString(),
          status: 'PENDING' as 'PENDING'
      };
      
      setAdminData(prev => ({
          ...prev,
          complaints: [...(prev.complaints || []), newComplaint]
      }));
      
      alert("Reporte enviado al administrador.");
  };

  const calculateBonus = () => {
    const rand = Math.random() * 100;
    if (rand < 4) return 25;
    if (rand < 10) return 20;
    if (rand < 30) return 15;
    if (rand < 60) return 10;
    return 5;
  };

  // LOADING STATE (Prevents Admin Bug on Refresh)
  if (authLoading) {
      return (
          <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center text-white">
              <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-t-4 border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
              <h2 className="text-2xl font-bold tracking-widest animate-pulse">THE SOURCE</h2>
              <p className="text-xs text-gray-500 mt-2 uppercase tracking-[0.3em]">Cargando Sistema</p>
          </div>
      );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'LOGIN':
        return <LoginScreen 
            onLogin={(type, data) => {
                setUserData({ ...userData, ...data });
                setUserType(type);
                
                if (data.email) {
                    sendWelcomeEmail(data);
                }
                
                navigateTo(type === 'CLIENT' ? 'HOME' : 'ONBOARDING_PROVIDER');
            }} 
            onSocialLogin={handleSocialLogin}
        />;

      case 'ONBOARDING_PROVIDER':
        return <ProviderOnboarding 
          currentUser={currentUser}
          onComplete={(data) => {
            const bonus = calculateBonus();
            setBonusAmount(bonus);
            const finalData = { ...userData, ...data, walletBalance: bonus, type: 'PROVIDER' as UserType };
            setUserData(finalData);
            
            // Send Welcome Email
            sendWelcomeEmail(finalData);
            
            setShowBonusModal(true);
          }}
          onCancel={() => navigateTo('CLIENT_PROFILE')}
          showBonusModal={showBonusModal}
          bonusAmount={bonusAmount}
          onCloseBonus={() => {
            setShowBonusModal(false);
            setUserType('PROVIDER');
            navigateTo('MY_SERVICES');
          }}
        />;

      case 'HOME':
        return <HomeView 
           userData={userData} 
           providers={providers}
           onSelectProvider={(p) => { setSelectedProvider(p); setCurrentView('PROFILE_DETAIL'); }}
           onNavigate={navigateTo}
           onToggleSearch={() => setCurrentView('SEARCH')}
        />;
        
      case 'SEARCH':
        return <SearchView 
           providers={providers}
           onSelectProvider={(p) => { setSelectedProvider(p); setCurrentView('PROFILE_DETAIL'); }}
        />;

      case 'REQUEST_SERVICE':
          return <RequestServiceView onSubmit={() => { alert("Solicitud Publicada!"); navigateTo('HOME'); }} />;

      case 'PROFILE_DETAIL':
        return selectedProvider ? <ProfileDetail 
          provider={selectedProvider} 
          onBack={() => navigateTo('HOME')}
          onSendRequest={() => { alert("Solicitud Enviada"); navigateTo('HOME'); }}
          onReport={handleReport}
        /> : null;

      case 'CLIENT_PROFILE':
        return <ClientProfileView 
            profile={userData} 
            onNavigate={navigateTo} 
            onUpdateProfile={(newData) => setUserData({ ...userData, ...newData })} 
            isAdmin={isAdmin}
        />;

      case 'WORKER_DASHBOARD':
        return <WorkerDashboard 
            userData={userData} 
            leads={leads} 
            onUnlock={handleUnlockLead}
            onViewLead={handleViewLead}
        />;
    
      case 'LEAD_DETAIL':
        return selectedLead ? <LeadDetailView lead={selectedLead} onBack={() => navigateTo('WORKER_DASHBOARD')} /> : null;

      case 'MY_SERVICES':
        return <MyServicesPanel 
            userData={userData} 
            onNavigate={navigateTo} 
            onUpdateUserData={(newData) => setUserData({ ...userData, ...newData })} 
        />;

      case 'WALLET':
        return <WalletView userData={userData} onRecharge={() => { alert("Comprobante enviado. El administrador lo revisará."); navigateTo('WALLET'); }} />;

      case 'OPPORTUNITIES':
        return <OpportunitiesView jobPosts={jobPosts} />;

      case 'JOB_CLOSING':
        return <JobClosingSimulation onSuccess={handleJobSuccess} onClose={() => navigateTo('MY_SERVICES')} />;

      case 'ADMIN':
        return <AdminDashboard 
            adminData={adminData} 
            onBack={() => navigateTo('CLIENT_PROFILE')} 
            onApproveRecharge={handleApproveRecharge}
            onManualRecharge={handleManualRecharge}
        />;

      case 'HELP':
        return <div className="p-8 text-center max-w-2xl mx-auto"><h2 className="font-bold mb-4">Ayuda</h2><p>Centro de soporte...</p><button onClick={() => navigateTo('CLIENT_PROFILE')} className="mt-4 text-blue-500">Volver</button></div>;
      
      case 'TERMS':
        return <TermsView onBack={() => navigateTo('CLIENT_PROFILE')} />;

      default:
        return <HomeView userData={userData} providers={providers} onSelectProvider={() => {}} onNavigate={navigateTo} onToggleSearch={() => {}} />;
    }
  };

  const showNav = !['LOGIN', 'ONBOARDING_PROVIDER', 'JOB_CLOSING', 'ADMIN', 'PROFILE_DETAIL', 'LEAD_DETAIL', 'TERMS'].includes(currentView);

  return (
    // Main Container - Full Screen, Adaptive
    <div className="min-h-screen w-full bg-gray-50 flex">
      
      {/* Sidebar Navigation - Visible on Desktop (lg+) */}
      {showNav && (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 shadow-sm z-50">
           <div className="p-6 relative">
              <SantaHatIcon />
              <h1 className="text-2xl font-black text-red-800 tracking-tighter">THE SOURCE</h1>
              <p className="text-[10px] font-bold text-green-600 tracking-[0.3em] uppercase">Christmas Edition</p>
           </div>
           
           <nav className="flex-1 px-4 space-y-2">
              {userType === 'CLIENT' || currentView === 'HOME' ? (
                <>
                  <NavSidebarItem active={currentView === 'HOME'} icon={Home} label="Inicio" onClick={() => navigateTo('HOME')} />
                  <NavSidebarItem active={currentView === 'SEARCH'} icon={Search} label="Buscar" onClick={() => navigateTo('SEARCH')} />
                  <NavSidebarItem active={currentView === 'REQUEST_SERVICE'} icon={PlusSquare} label="Pedir Servicio" onClick={() => navigateTo('REQUEST_SERVICE')} />
                  <NavSidebarItem active={currentView === 'CLIENT_PROFILE'} icon={User} label="Mi Perfil" onClick={() => navigateTo('CLIENT_PROFILE')} />
                </>
              ) : (
                <>
                  <NavSidebarItem active={currentView === 'WORKER_DASHBOARD'} icon={Inbox} label="Solicitudes" onClick={() => navigateTo('WORKER_DASHBOARD')} />
                  <NavSidebarItem active={currentView === 'MY_SERVICES'} icon={Grid} label="Mi Panel" onClick={() => navigateTo('MY_SERVICES')} />
                  <NavSidebarItem active={currentView === 'OPPORTUNITIES'} icon={Monitor} label="Muro de Empleos" onClick={() => navigateTo('OPPORTUNITIES')} />
                  <NavSidebarItem active={currentView === 'WALLET'} icon={Wallet} label="Billetera" onClick={() => navigateTo('WALLET')} />
                </>
              )}
           </nav>

           <div className="p-4 border-t border-gray-100">
              <button 
                type="button"
                onClick={() => {
                   if(confirm("¿Cerrar Sesión?")) setCurrentView('LOGIN');
                }}
                className="flex items-center gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl w-full transition-colors font-medium text-sm"
              >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
              </button>
           </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        <div className={`w-full mx-auto ${showNav ? 'pb-24 lg:pb-0' : ''}`}>
          {renderContent()}
        </div>
      </main>
      
      {/* Bottom Navigation - Visible on Mobile/Tablet (Hidden on lg+) */}
      {showNav && (
         <div className="lg:hidden fixed bottom-0 z-50 w-full bg-white border-t border-gray-100 px-4 py-2 flex justify-around items-center text-[10px] font-medium text-gray-400 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-pb">
            {userType === 'CLIENT' || currentView === 'HOME' ? (
              <>
                <NavBtn active={currentView === 'HOME'} icon={Home} label="Inicio" onClick={() => navigateTo('HOME')} />
                <NavBtn active={currentView === 'SEARCH'} icon={Search} label="Buscar" onClick={() => navigateTo('SEARCH')} />
                <NavBtn active={currentView === 'REQUEST_SERVICE'} icon={PlusSquare} label="Pedir" onClick={() => navigateTo('REQUEST_SERVICE')} />
                <NavBtn active={currentView === 'CLIENT_PROFILE'} icon={User} label="Perfil" onClick={() => navigateTo('CLIENT_PROFILE')} />
              </>
            ) : (
              <>
                <NavBtn active={currentView === 'WORKER_DASHBOARD'} icon={Inbox} label="Solicitudes" onClick={() => navigateTo('WORKER_DASHBOARD')} />
                <NavBtn active={currentView === 'MY_SERVICES'} icon={Grid} label="Panel" onClick={() => navigateTo('MY_SERVICES')} />
                <NavBtn active={currentView === 'OPPORTUNITIES'} icon={Monitor} label="Muro" onClick={() => navigateTo('OPPORTUNITIES')} />
                <NavBtn active={currentView === 'WALLET'} icon={Wallet} label="Billetera" onClick={() => navigateTo('WALLET')} />
              </>
            )}
         </div>
      )}
    </div>
  );
};

// Component for Mobile Bottom Nav Button
const NavBtn: React.FC<{ active: boolean, icon: React.ElementType, label: string, onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors min-w-[60px] py-1.5 px-2 rounded-xl ${active ? 'text-red-600 bg-red-50' : 'hover:text-gray-600 hover:bg-gray-50'}`}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// Component for Desktop Sidebar Item
const NavSidebarItem: React.FC<{ active: boolean, icon: React.ElementType, label: string, onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? 'bg-red-800 text-white shadow-lg shadow-red-200' : 'text-gray-500 hover:bg-red-50'}`}>
      <Icon size={20} />
      <span className="font-bold text-sm">{label}</span>
  </button>
);

export default App;
