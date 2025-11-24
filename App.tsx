
import React, { useState } from 'react';
import { Home, Search, PlusSquare, User, Inbox, Grid, Monitor, Wallet } from 'lucide-react';
import { ViewState, UserType, UserData, Provider, Lead, AdminData, JobPost } from './types';
import { INITIAL_PROVIDERS } from './constants';

// Views
import { LoginScreen, ProviderOnboarding } from './views/AuthFlow';
import { HomeView, ProfileDetail, ClientProfileView, RequestServiceView, SearchView, TermsView } from './views/ClientFlow';
import { WorkerDashboard, WalletView, MyServicesPanel, JobClosingSimulation, OpportunitiesView, LeadDetailView } from './views/ProviderFlow';
import { AdminDashboard } from './views/AdminFlow';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [userType, setUserType] = useState<UserType>('CLIENT');
  
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
      revenue: 1500
  });

  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);

  const navigateTo = (view: ViewState | 'HIRE_MODE') => {
    if (view === 'HIRE_MODE') {
        setCurrentView('HOME');
        return;
    }
    setSelectedProvider(null);
    setSelectedLead(null);
    setCurrentView(view);
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

  const calculateBonus = () => {
    const rand = Math.random() * 100;
    if (rand < 4) return 25;
    if (rand < 10) return 20;
    if (rand < 30) return 15;
    if (rand < 60) return 10;
    return 5;
  };

  const renderContent = () => {
    switch (currentView) {
      case 'LOGIN':
        return <LoginScreen onLogin={(type, data) => {
            setUserData({ ...userData, ...data });
            setUserType(type);
            navigateTo(type === 'CLIENT' ? 'HOME' : 'ONBOARDING_PROVIDER');
        }} />;

      case 'ONBOARDING_PROVIDER':
        return <ProviderOnboarding 
          onComplete={(data) => {
            const bonus = calculateBonus();
            setBonusAmount(bonus);
            setUserData({ ...userData, ...data, walletBalance: bonus, type: 'PROVIDER' });
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
        /> : null;

      case 'CLIENT_PROFILE':
        return <ClientProfileView profile={userData} onNavigate={navigateTo} />;

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
        return <MyServicesPanel userData={userData} onNavigate={navigateTo} />;

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
        return <div className="p-8 text-center"><h2 className="font-bold mb-4">Ayuda</h2><p>Centro de soporte...</p><button onClick={() => navigateTo('CLIENT_PROFILE')} className="mt-4 text-blue-500">Volver</button></div>;
      
      case 'TERMS':
        return <TermsView onBack={() => navigateTo('CLIENT_PROFILE')} />;

      default:
        return <HomeView userData={userData} providers={providers} onSelectProvider={() => {}} onToggleSearch={() => {}} />;
    }
  };

  const showNav = !['LOGIN', 'ONBOARDING_PROVIDER', 'JOB_CLOSING', 'ADMIN', 'PROFILE_DETAIL', 'LEAD_DETAIL', 'TERMS'].includes(currentView);

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center p-4 font-sans overflow-hidden">
      <div className="w-[360px] h-[640px] bg-white relative shadow-2xl rounded-[30px] overflow-hidden flex flex-col border-[8px] border-gray-900 ring-4 ring-gray-300 shrink-0">
        <div className="flex-1 overflow-y-auto no-scrollbar relative bg-white">
          {renderContent()}
        </div>
        
        {showNav && (
           <div className="bg-white border-t border-gray-100 px-3 py-2 flex justify-between items-center text-[10px] font-medium text-gray-400 sticky bottom-0 z-20">
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
    </div>
  );
};

const NavBtn: React.FC<{ active: boolean, icon: React.ElementType, label: string, onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors min-w-[50px] py-1 ${active ? 'text-blue-600' : 'hover:text-gray-600'}`}>
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span>{label}</span>
  </button>
);

export default App;
