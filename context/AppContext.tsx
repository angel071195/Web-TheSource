
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Service, Subscription, Transaction, UserRole, RechargeRequest, PaymentMethod } from '../types';
import { MOCK_SERVICES, MOCK_USER, MOCK_ADMIN, INITIAL_SUBS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (role: UserRole, email?: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Single Source of Truth for Balances (Simulating a Database)
  const [userBalances, setUserBalances] = useState<Record<string, number>>({
    [MOCK_USER.email]: MOCK_USER.balance,
    [MOCK_ADMIN.email]: MOCK_ADMIN.balance // This represents Admin Sales Income
  });

  // Source of Truth for Loyalty Points
  const [userPoints, setUserPoints] = useState<Record<string, number>>({
    [MOCK_USER.email]: MOCK_USER.loyaltyPoints,
    [MOCK_ADMIN.email]: MOCK_ADMIN.loyaltyPoints
  });

  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBS); 
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Auto-sync user balance if it changes in the background (e.g. Admin approved while user is logged in)
  useEffect(() => {
    if (user && user.email) {
      const currentStoredBalance = userBalances[user.email];
      const currentStoredPoints = userPoints[user.email] || 0;
      
      if (currentStoredBalance !== undefined && (currentStoredBalance !== user.balance || currentStoredPoints !== user.loyaltyPoints)) {
        setUser(prev => prev ? { ...prev, balance: currentStoredBalance, loyaltyPoints: currentStoredPoints } : null);
      }
    }
  }, [userBalances, userPoints, user?.email]); 

  const refreshUserBalance = () => {
    if (user && userBalances[user.email] !== undefined) {
      setUser(prev => prev ? { 
        ...prev, 
        balance: userBalances[user.email],
        loyaltyPoints: userPoints[user.email] || 0
      } : null);
    }
  };

  const login = (role: UserRole, email?: string) => {
    const emailToUse = email || (role === UserRole.ADMIN ? MOCK_ADMIN.email : MOCK_USER.email);
    
    // Ensure the user has a record in our balance "DB"
    let currentBalance = userBalances[emailToUse];
    if (currentBalance === undefined) {
      // If new user (or mock user accessed via different email), init with 0 or mock default
      currentBalance = (emailToUse === MOCK_USER.email) ? MOCK_USER.balance : 0;
      setUserBalances(prev => ({ ...prev, [emailToUse]: currentBalance }));
    }

    let currentPoints = userPoints[emailToUse] || 0;

    if (role === UserRole.ADMIN) {
      setUser({
        ...MOCK_ADMIN,
        email: emailToUse,
        balance: currentBalance,
        loyaltyPoints: currentPoints
      });
    } else {
      setUser({
        ...MOCK_USER,
        email: emailToUse,
        name: emailToUse.split('@')[0],
        balance: currentBalance,
        loyaltyPoints: currentPoints
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addBalance = (amount: number) => {
    if (!user) return;
    
    // Update Central Store
    setUserBalances(prev => ({
      ...prev,
      [user.email]: (prev[user.email] || 0) + amount
    }));

    // Record transaction
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

    // Update Request Status and Approval Date
    setRechargeRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: approved ? 'APPROVED' : 'REJECTED', 
            amount: approved ? amountToCredit : req.amount,
            approvalDate: approved ? now : undefined
          } 
        : req
    ));

    if (approved) {
      // RULE: ADD TO USER BALANCE
      // Update the central balance store for the user who requested the recharge
      setUserBalances(prev => ({
        ...prev,
        [request.userEmail]: (prev[request.userEmail] || 0) + amountToCredit
      }));
      
      // RULE: Do NOT add to Admin Balance (MOCK_ADMIN.email). 
      // Admin Balance only increases on SALES (Purchase of service).
      // The amount is tracked in "Total Recargado" via the 'DEPOSIT' transaction type.

      // --- LOYALTY POINTS FORMULA ---
      if (amountToCredit >= 10) {
        const pointsToAdd = Math.floor(amountToCredit / 10) * 0.10;
        if (pointsToAdd > 0) {
           setUserPoints(prev => ({
             ...prev,
             [request.userEmail]: (prev[request.userEmail] || 0) + pointsToAdd
           }));
        }
      }

      // Create Transaction Record
      const newTransaction: Transaction = {
        id: `tx_dep_${Date.now()}`,
        type: 'DEPOSIT', // IMPORTANT: This type drives the "Total Recargado" icon in Admin Wallet
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

    setUserBalances(prev => ({
      ...prev,
      [user.email]: (prev[user.email] || 0) + pointsToRedeem
    }));

    setUserPoints(prev => ({
      ...prev,
      [user.email]: 0
    }));

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

    if (currentBalance < service.price) return { success: false, message: 'Saldo insuficiente en Billetera Móvil.' };

    // RULE: Transaction Logic
    // 1. Deduct from User Wallet
    // 2. Add to Admin Wallet (Sales Income)
    setUserBalances(prev => ({
      ...prev,
      [user.email]: (prev[user.email] || 0) - service.price,
      [MOCK_ADMIN.email]: (prev[MOCK_ADMIN.email] || 0) + service.price // Admin Income Increases Here
    }));

    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, stock: s.stock - 1 } : s));

    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      serviceId: service.id,
      serviceName: service.name,
      logoUrl: service.logoUrl,
      buyerEmail: user.email, // STRICTLY RECORD WHO BOUGHT IT
      email: '', 
      password: '', 
      profileName: '', 
      purchaseDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + service.durationDays * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING' 
    };
    setSubscriptions(prev => [newSub, ...prev]);

    // Transaction for User (Spending)
    const userTx: Transaction = {
      id: `tx_buy_${Date.now()}`,
      type: 'PURCHASE',
      amount: service.price,
      date: new Date().toISOString(),
      description: `Compra: ${service.name} (Pendiente de Envío)`,
      userEmail: user.email
    };
    
    // Transaction for Admin (Income)
    const adminTx: Transaction = {
      id: `tx_sale_${Date.now()}`,
      type: 'SALE',
      amount: service.price,
      date: new Date().toISOString(),
      description: `Venta: ${service.name} a ${user.email}`,
      userEmail: user.email
    };

    setTransactions(prev => [userTx, adminTx, ...prev]);

    return { success: true, message: '¡Compra exitosa! Esperando envío de credenciales por el administrador.' };
  };

  const fulfillSubscription = (subId: string, data: { email: string, password?: string, profileName?: string, message?: string }) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subId) {
        return {
          ...sub,
          email: data.email,
          password: data.password,
          profileName: data.profileName,
          adminMessage: data.message,
          status: 'ACTIVE'
        };
      }
      return sub;
    }));
  };

  const reportIssue = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, status: 'REPORTED' } : s));
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, price: newPrice } : s));
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
        ...serviceData,
        id: `svc_${Date.now()}`
    };
    setServices(prev => [...prev, newService]);
  };

  const adminRechargeUser = (email: string, amount: number) => {
    // Manual Admin Recharge
    setUserBalances(prev => ({
      ...prev,
      [email]: (prev[email] || 0) + amount
    }));

    const newTransaction: Transaction = {
      id: `admin_dep_${Date.now()}`,
      type: 'DEPOSIT', // Contributes to "Total Recargado"
      amount: amount,
      date: new Date().toISOString(),
      description: `Recarga Admin a: ${email}`,
      userEmail: email
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm_${Date.now()}`
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      login, 
      logout, 
      services, 
      subscriptions, 
      transactions, 
      rechargeRequests,
      paymentMethods,
      buyService, 
      reportIssue,
      addBalance,
      requestRecharge,
      processRecharge,
      updateServicePrice,
      addService,
      adminRechargeUser,
      fulfillSubscription,
      refreshUserBalance,
      redeemPoints,
      addPaymentMethod,
      deletePaymentMethod
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
