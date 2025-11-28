
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Service, Subscription, Transaction, UserRole, RechargeRequest, PaymentMethod } from '../types';
import { MOCK_SERVICES, MOCK_USER, MOCK_ADMIN, INITIAL_SUBS } from '../constants';

interface AppContextType {
  user: User | null;
  allUsers: User[]; // Database of all users
  login: (email: string, password?: string) => { success: boolean, message?: string };
  registerUser: (email: string, password: string, name: string) => { success: boolean, message?: string };
  logout: () => void;
  services: Service[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  rechargeRequests: RechargeRequest[];
  paymentMethods: PaymentMethod[];
  buyService: (serviceId: string) => { success: boolean; message: string };
  reportIssue: (subscriptionId: string) => void;
  addBalance: (amount: number) => void;
  requestRecharge: (amount: number, receiptImage: string) => void;
  processRecharge: (requestId: string, approved: boolean, finalAmount?: number) => void;
  updateServicePrice: (serviceId: string, newPrice: number) => void;
  addService: (serviceData: Omit<Service, 'id'>) => void;
  adminRechargeUser: (email: string, amount: number) => void;
  fulfillSubscription: (subId: string, data: { email: string, password?: string, profileName?: string, message?: string }) => void;
  refreshUserBalance: () => void;
  redeemPoints: () => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (id: string) => void;
  
  // Data Sync
  exportSystemData: () => string;
  importSystemData: (jsonData: string) => boolean;

  // Mobile UI
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to load from storage
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultValue;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // PERSISTENCE: Load initial state from LocalStorage
  const [user, setUser] = useState<User | null>(() => loadFromStorage('streamhub_user', null));
  
  // USER DATABASE (Simulated Backend)
  const [allUsers, setAllUsers] = useState<User[]>(() => {
     const storedUsers = loadFromStorage('streamhub_users_db', []);
     // Ensure MOCK_ADMIN exists if DB is empty or refresh logic handled in login
     if (storedUsers.length === 0) {
       return [{...MOCK_ADMIN, isOnline: false, registeredAt: new Date().toISOString()}];
     }
     return storedUsers;
  });

  const [userBalances, setUserBalances] = useState<Record<string, number>>(() => {
    const balances = loadFromStorage('streamhub_balances', {
      [MOCK_USER.email]: MOCK_USER.balance,
      [MOCK_ADMIN.email]: MOCK_ADMIN.balance
    });
    // OBLIGATORY FIX: Reset Admin balance to 0 if it equals the old mock value (99999) 
    // to strictly comply with the order "update to zero".
    if (balances[MOCK_ADMIN.email] === 99999) {
        balances[MOCK_ADMIN.email] = 0;
    }
    return balances;
  });

  const [userPoints, setUserPoints] = useState<Record<string, number>>(() => 
    loadFromStorage('streamhub_points', {
      [MOCK_USER.email]: MOCK_USER.loyaltyPoints,
      [MOCK_ADMIN.email]: MOCK_ADMIN.loyaltyPoints
    })
  );

  const [services, setServices] = useState<Service[]>(() => loadFromStorage('streamhub_services', MOCK_SERVICES));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadFromStorage('streamhub_subs', INITIAL_SUBS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage('streamhub_txs', []));
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>(() => loadFromStorage('streamhub_reqs', []));
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => loadFromStorage('streamhub_methods', []));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // PERSISTENCE EFFECTS
  useEffect(() => { localStorage.setItem('streamhub_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('streamhub_users_db', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('streamhub_balances', JSON.stringify(userBalances)); }, [userBalances]);
  useEffect(() => { localStorage.setItem('streamhub_points', JSON.stringify(userPoints)); }, [userPoints]);
  useEffect(() => { localStorage.setItem('streamhub_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('streamhub_subs', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('streamhub_txs', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('streamhub_reqs', JSON.stringify(rechargeRequests)); }, [rechargeRequests]);
  useEffect(() => { localStorage.setItem('streamhub_methods', JSON.stringify(paymentMethods)); }, [paymentMethods]);

  // Sync current user with DB changes (e.g., balance updates)
  useEffect(() => {
    if (user && user.email) {
      const currentStoredBalance = userBalances[user.email];
      const currentStoredPoints = userPoints[user.email] || 0;
      
      if (currentStoredBalance !== undefined && (currentStoredBalance !== user.balance || currentStoredPoints !== user.loyaltyPoints)) {
        setUser(prev => prev ? { ...prev, balance: currentStoredBalance, loyaltyPoints: currentStoredPoints } : null);
      }
    }
  }, [userBalances, userPoints, user?.email]); 

  // Mobile Menu Helpers
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const refreshUserBalance = () => {
    if (user && userBalances[user.email] !== undefined) {
      setUser(prev => prev ? { 
        ...prev, 
        balance: userBalances[user.email],
        loyaltyPoints: userPoints[user.email] || 0
      } : null);
    }
  };

  const registerUser = (email: string, password: string, name: string) => {
    // Check if user exists
    if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'El correo ya está registrado.' };
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name: name,
      email: email,
      password: password,
      role: UserRole.USER,
      balance: 0,
      loyaltyPoints: 0,
      registeredAt: new Date().toISOString(),
      isOnline: false
    };

    setAllUsers(prev => [...prev, newUser]);
    // Initialize balance
    setUserBalances(prev => ({ ...prev, [email]: 0 }));
    setUserPoints(prev => ({ ...prev, [email]: 0 }));

    return { success: true, message: 'Usuario registrado correctamente.' };
  };

  const login = (email: string, password?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // STRICT CHECK: Is this the Super Admin?
    // Use constants logic to enforce specific credentials regardless of DB state
    if (normalizedEmail === MOCK_ADMIN.email.toLowerCase()) {
        if (password === MOCK_ADMIN.password) {
            // Success Super Admin Login
            const adminUser: User = { 
                ...MOCK_ADMIN, 
                isOnline: true, 
                lastLogin: new Date().toISOString(),
                // Use stored balance if available, else mock
                balance: userBalances[MOCK_ADMIN.email] !== undefined ? userBalances[MOCK_ADMIN.email] : MOCK_ADMIN.balance
            };
            
            // Sync with allUsers (if exists update, if not add)
            setAllUsers(prev => {
                const exists = prev.find(u => u.email.toLowerCase() === normalizedEmail);
                if (exists) {
                    return prev.map(u => u.email.toLowerCase() === normalizedEmail ? adminUser : u);
                }
                return [...prev, adminUser];
            });
            setUser(adminUser);
            return { success: true };
        } else {
             return { success: false, message: 'Contraseña de administrador incorrecta.' };
        }
    }

    // Normal user login logic
    const foundUser = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!foundUser) {
       return { success: false, message: 'Usuario no encontrado.' };
    }

    // Verify Password if provided
    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    // UPDATE ONLINE STATUS
    const updatedUser = { 
        ...foundUser, 
        isOnline: true, 
        lastLogin: new Date().toISOString(),
        balance: userBalances[foundUser.email] || foundUser.balance // Sync balance on login
    };

    // Update in DB
    setAllUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
    
    // Set Session
    setUser(updatedUser);
    return { success: true };
  };

  const logout = () => {
    if (user) {
        // Mark as offline in DB
        setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, isOnline: false } : u));
    }
    setUser(null);
    localStorage.removeItem('streamhub_user');
  };

  const addBalance = (amount: number) => {
    if (!user) return;
    setUserBalances(prev => ({ ...prev, [user.email]: (prev[user.email] || 0) + amount }));
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'DEPOSIT',
      amount: amount,
      date: new Date().toISOString(),
      description: 'Recarga de saldo',
      userEmail: user.email
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const requestRecharge = (amount: number, receiptImage: string) => {
    if (!user) return;
    const newRequest: RechargeRequest = {
      id: `req_${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      amount: amount,
      receiptImage: receiptImage,
      status: 'PENDING',
      date: new Date().toISOString()
    };
    setRechargeRequests(prev => [newRequest, ...prev]);
  };

  const processRecharge = (requestId: string, approved: boolean, finalAmount?: number) => {
    const request = rechargeRequests.find(r => r.id === requestId);
    if (!request) return;

    const amountToCredit = finalAmount !== undefined ? finalAmount : request.amount;
    const now = new Date().toISOString();

    setRechargeRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: approved ? 'APPROVED' : 'REJECTED', amount: approved ? amountToCredit : req.amount, approvalDate: approved ? now : undefined } 
        : req
    ));

    if (approved) {
      setUserBalances(prev => ({ ...prev, [request.userEmail]: (prev[request.userEmail] || 0) + amountToCredit }));
      
      if (amountToCredit >= 10) {
        const pointsToAdd = Math.floor(amountToCredit / 10) * 0.10;
        if (pointsToAdd > 0) {
           setUserPoints(prev => ({ ...prev, [request.userEmail]: (prev[request.userEmail] || 0) + pointsToAdd }));
        }
      }

      const newTransaction: Transaction = {
        id: `tx_dep_${Date.now()}`,
        type: 'DEPOSIT',
        amount: amountToCredit,
        date: now,
        description: `Recarga Aprobada (ID: ${requestId})`,
        userEmail: request.userEmail
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const redeemPoints = () => {
    if (!user || !user.loyaltyPoints || user.loyaltyPoints <= 0) return;
    const pointsToRedeem = user.loyaltyPoints;

    setUserBalances(prev => ({ ...prev, [user.email]: (prev[user.email] || 0) + pointsToRedeem }));
    setUserPoints(prev => ({ ...prev, [user.email]: 0 }));

    const newTransaction: Transaction = {
      id: `tx_redeem_${Date.now()}`,
      type: 'REDEEM',
      amount: pointsToRedeem,
      date: new Date().toISOString(),
      description: 'Canje de puntos por fidelidad',
      userEmail: user.email
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const buyService = (serviceId: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Debes iniciar sesión.' };
    const service = services.find(s => s.id === serviceId);
    if (!service) return { success: false, message: 'Servicio no encontrado.' };
    if (service.stock <= 0) return { success: false, message: 'Agotado.' };
    
    const currentBalance = userBalances[user.email] ?? user.balance;
    if (currentBalance < service.price) return { success: false, message: 'Saldo insuficiente.' };

    setUserBalances(prev => ({
      ...prev,
      [user.email]: (prev[user.email] || 0) - service.price,
      [MOCK_ADMIN.email]: (prev[MOCK_ADMIN.email] || 0) + service.price
    }));

    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, stock: s.stock - 1 } : s));

    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      serviceId: service.id,
      serviceName: service.name,
      logoUrl: service.logoUrl,
      buyerEmail: user.email,
      email: '', 
      purchaseDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + service.durationDays * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING' 
    };
    setSubscriptions(prev => [newSub, ...prev]);

    const userTx: Transaction = { id: `tx_buy_${Date.now()}`, type: 'PURCHASE', amount: service.price, date: new Date().toISOString(), description: `Compra: ${service.name}`, userEmail: user.email };
    const adminTx: Transaction = { id: `tx_sale_${Date.now()}`, type: 'SALE', amount: service.price, date: new Date().toISOString(), description: `Venta: ${service.name} a ${user.email}`, userEmail: user.email };
    setTransactions(prev => [userTx, adminTx, ...prev]);

    return { success: true, message: '¡Compra exitosa! Esperando envío de credenciales.' };
  };

  const fulfillSubscription = (subId: string, data: { email: string, password?: string, profileName?: string, message?: string }) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subId ? { ...sub, ...data, status: 'ACTIVE' } : sub
    ));
  };

  const reportIssue = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, status: 'REPORTED' } : s));
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, price: newPrice } : s));
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = { ...serviceData, id: `svc_${Date.now()}` };
    setServices(prev => [...prev, newService]);
  };

  const adminRechargeUser = (email: string, amount: number) => {
    // Check if user exists in DB, if not create entry in balances
    setUserBalances(prev => ({ ...prev, [email]: (prev[email] || 0) + amount }));
    const newTransaction: Transaction = { id: `admin_dep_${Date.now()}`, type: 'DEPOSIT', amount: amount, date: new Date().toISOString(), description: `Recarga Admin a: ${email}`, userEmail: email };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = { ...method, id: `pm_${Date.now()}` };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  // DATA SYNC FEATURES
  const exportSystemData = () => {
    const data = {
      allUsers,
      userBalances,
      userPoints,
      services,
      subscriptions,
      transactions,
      rechargeRequests,
      paymentMethods
    };
    return JSON.stringify(data);
  };

  const importSystemData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.allUsers || !data.services) {
        return false;
      }
      // Save all to localStorage
      localStorage.setItem('streamhub_users_db', JSON.stringify(data.allUsers));
      localStorage.setItem('streamhub_balances', JSON.stringify(data.userBalances));
      localStorage.setItem('streamhub_points', JSON.stringify(data.userPoints));
      localStorage.setItem('streamhub_services', JSON.stringify(data.services));
      localStorage.setItem('streamhub_subs', JSON.stringify(data.subscriptions));
      localStorage.setItem('streamhub_txs', JSON.stringify(data.transactions));
      localStorage.setItem('streamhub_reqs', JSON.stringify(data.rechargeRequests));
      localStorage.setItem('streamhub_methods', JSON.stringify(data.paymentMethods));
      
      // We must reload page to reflect changes as state initializes from storage
      window.location.reload();
      return true;
    } catch (e) {
      console.error("Error importing data", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, allUsers, login, registerUser, logout, 
      services, subscriptions, transactions, rechargeRequests, paymentMethods,
      buyService, reportIssue, addBalance, requestRecharge, processRecharge,
      updateServicePrice, addService, adminRechargeUser, fulfillSubscription,
      refreshUserBalance, redeemPoints, addPaymentMethod, deletePaymentMethod,
      isMobileMenuOpen, toggleMobileMenu, closeMobileMenu,
      exportSystemData, importSystemData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
