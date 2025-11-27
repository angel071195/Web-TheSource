
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import { CreditCard, Smartphone, QrCode, Gift, History, Upload, Image as ImageIcon, X, CheckCircle, RefreshCw, Star, Copy, Building } from 'lucide-react';

const Wallet: React.FC = () => {
  const { user, requestRecharge, transactions, rechargeRequests, refreshUserBalance, redeemPoints, paymentMethods } = useApp();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !receiptFile) return;
    
    setLoading(true);
    // Simulate Network Delay
    setTimeout(() => {
        requestRecharge(parseFloat(amount), receiptFile);
        setAmount('');
        setReceiptFile(null);
        setLoading(false);
        setNotification('Solicitud enviada. El administrador verificará tu comprobante.');
        setTimeout(() => setNotification(null), 5000);
    }, 1500);
  };

  const handleRefreshBalance = () => {
      setIsRefreshing(true);
      // Simulate fetching updated balance from server
      setTimeout(() => {
          refreshUserBalance(); // Call context to sync with source of truth
          setIsRefreshing(false);
          setNotification('Saldo sincronizado correctamente.');
          setTimeout(() => setNotification(null), 3000);
      }, 1000);
  };

  const handleRedeemPoints = () => {
      if (!user?.loyaltyPoints || user.loyaltyPoints <= 0) return;
      redeemPoints();
      setNotification(`¡Has canjeado ${user.loyaltyPoints.toFixed(2)} Bs de tus puntos!`);
      setTimeout(() => setNotification(null), 4000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter requests for current user (Strict Isolation)
  const myRequests = rechargeRequests.filter(r => r.userId === user?.id);
  
  // Filter transactions for current user (Strict Isolation)
  const myTransactions = transactions.filter(t => t.userEmail === user?.email);

  // Logic to show "Approved" notification based on approvalDate
  const recentlyApproved = myRequests.find(r => 
      r.status === 'APPROVED' && 
      r.approvalDate && 
      (new Date().getTime() - new Date(r.approvalDate).getTime()) < 600000 // 10 minutes from approval time
  );

  return (
    <div className="space-y-6">
        {/* Success Notification for approved recharge */}
        {recentlyApproved && !notification && (
             <div className="bg-green-600/20 border border-green-500 p-4 rounded-xl flex items-center justify-between animate-fade-in shadow-lg">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-green-500 rounded-full text-white">
                         <CheckCircle size={24} />
                     </div>
                     <div>
                         <h3 className="text-green-400 font-bold text-lg">¡Recarga Exitosa!</h3>
                         <p className="text-green-200 text-sm">El administrador aprobó tu recarga. Tu saldo ha sido actualizado.</p>
                     </div>
                 </div>
                 <div className="text-2xl font-bold text-white font-mono">
                     +{recentlyApproved.amount.toFixed(2)} Bs
                 </div>
             </div>
        )}

        {/* Main Wallet Card */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-700 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left: Main Balance */}
                <div>
                    <h1 className="text-sm text-brand-200 font-medium mb-1">Saldo Disponible</h1>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl font-bold font-mono">{user?.balance.toFixed(2)} Bs</div>
                        <button 
                            onClick={handleRefreshBalance}
                            disabled={isRefreshing}
                            className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 ${isRefreshing ? 'animate-spin cursor-not-allowed' : 'hover:rotate-180'}`}
                            title="Actualizar Saldo"
                        >
                            <RefreshCw size={24} className="text-white" />
                        </button>
                    </div>
                    {isRefreshing && <span className="text-sm text-brand-200 animate-pulse">Actualizando...</span>}
                    <div className="flex gap-4">
                        <Button variant="primary" className="bg-white text-brand-900 hover:bg-gray-100">
                            <Gift className="mr-2 h-4 w-4" /> Canjear Código
                        </Button>
                    </div>
                </div>

                {/* Right: Loyalty Points Section */}
                <div className="bg-brand-800/50 rounded-xl p-4 border border-brand-500/30 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-yellow-300 mb-2">
                             <Star className="fill-yellow-300 h-5 w-5" />
                             <h3 className="font-bold">Puntos por Fidelidad</h3>
                        </div>
                        <p className="text-xs text-brand-100 mb-3">
                            Recibes 0.10 Bs por cada 10 Bs recargados.
                        </p>
                        <div className="text-3xl font-bold font-mono text-yellow-300">
                             {user?.loyaltyPoints ? user.loyaltyPoints.toFixed(2) : '0.00'} Bs
                        </div>
                    </div>
                    <button 
                        onClick={handleRedeemPoints}
                        disabled={!user?.loyaltyPoints || user.loyaltyPoints <= 0}
                        className="mt-3 w-full py-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-brand-900 font-bold rounded-lg text-sm transition-colors"
                    >
                        Añadir a mi billetera móvil
                    </button>
                </div>
            </div>
        </div>

        {notification && (
            <div className="bg-blue-500/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg animate-fade-in flex items-center gap-2">
                <CheckCircle size={18} />
                {notification}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deposit Form */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* PAYMENT METHODS GALLERY */}
                <div className="bg-dark-800 rounded-xl border border-gray-700 p-6">
                     <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                         <CreditCard className="text-brand-500"/> Métodos de Pago Disponibles
                     </h2>
                     {paymentMethods.length === 0 ? (
                         <div className="text-center py-6 bg-dark-900/50 rounded-lg text-gray-400 text-sm">
                             El administrador no ha cargado métodos de pago aún.
                         </div>
                     ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {paymentMethods.map(pm => (
                                 <div key={pm.id} className="bg-dark-900/50 p-4 rounded-xl border border-gray-600 hover:border-brand-500 transition-all group">
                                     <div className="flex items-center gap-3 mb-3 border-b border-gray-700 pb-2">
                                         {pm.type === 'QR' ? <QrCode className="text-brand-400" size={20}/> : <Building className="text-blue-400" size={20}/>}
                                         <span className="font-bold text-white">{pm.name}</span>
                                     </div>
                                     
                                     {pm.type === 'QR' && pm.imageData ? (
                                         <div className="flex flex-col items-center">
                                             <img src={pm.imageData} alt={pm.name} className="w-48 h-48 object-contain bg-white rounded-lg p-2" />
                                             <p className="text-xs text-gray-500 mt-2">Escanea desde tu app bancaria</p>
                                         </div>
                                     ) : (
                                         <div className="space-y-3">
                                             <div className="bg-black/30 p-3 rounded text-sm text-gray-300 font-mono whitespace-pre-wrap relative">
                                                  {pm.details}
                                                  <button 
                                                      onClick={() => handleCopy(pm.details || '')}
                                                      className="absolute top-2 right-2 text-gray-500 hover:text-white p-1 bg-dark-800 rounded shadow"
                                                      title="Copiar"
                                                  >
                                                      {copiedText === pm.details ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14}/>}
                                                  </button>
                                             </div>
                                             <p className="text-xs text-gray-500">Realiza la transferencia a estos datos.</p>
                                         </div>
                                     )}
                                 </div>
                             ))}
                         </div>
                     )}
                </div>

                <div className="bg-dark-800 rounded-xl border border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Subir Comprobante</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Monto Transferido (Bs)</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-dark-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 text-lg"
                                placeholder="10.00"
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Captura de Pantalla (Obligatorio)</label>
                            {!receiptFile ? (
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 hover:bg-dark-900/50 transition-colors text-center cursor-pointer relative group">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <Upload className="mx-auto h-10 w-10 text-gray-500 mb-2 group-hover:text-brand-400 transition-colors" />
                                    <p className="text-sm text-gray-300">Haz clic para subir la captura</p>
                                    <p className="text-xs text-gray-500 mt-1">Soporta JPG, PNG</p>
                                </div>
                            ) : (
                                <div className="relative rounded-lg overflow-hidden border border-brand-500 group">
                                    <img src={receiptFile} alt="Preview" className="w-full h-48 object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                            <CheckCircle size={14}/> Listo para enviar
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setReceiptFile(null)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700 transition-colors z-10"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <Button 
                            disabled={loading || !amount || !receiptFile} 
                            type="submit" 
                            className={`w-full h-12 text-base font-bold shadow-lg transition-all duration-300 ${
                                !amount || !receiptFile ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-brand-500/30 hover:shadow-brand-500/50'
                            }`}
                        >
                            {loading ? 'Enviando comprobante...' : 'Enviar Comprobante para Revisión'}
                        </Button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-900/50 flex items-start gap-3">
                        <Gift className="text-blue-400 h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-300">Nota Importante</h4>
                            <p className="text-xs text-blue-200 mt-1">
                                El saldo se acreditará una vez que el administrador verifique que el pago ha llegado a la cuenta. Recuerda usar el botón de actualizar saldo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* History & Status */}
            <div className="space-y-6">
                 {/* Pending/Recent Requests */}
                 <div className="bg-dark-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <History className="text-gray-400"/>
                        <h2 className="text-xl font-bold text-white">Mis Solicitudes</h2>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {myRequests.length === 0 && <p className="text-gray-500 text-sm">No tienes solicitudes recientes.</p>}
                        {myRequests.map(req => (
                            <div key={req.id} className="bg-dark-900/50 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold">{req.amount.toFixed(2)} Bs</p>
                                    <p className="text-xs text-gray-500">{new Date(req.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded font-bold ${
                                    req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                    req.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                    'bg-orange-500/20 text-orange-400'
                                }`}>
                                    {req.status === 'APPROVED' ? 'APROBADO' : 
                                     req.status === 'REJECTED' ? 'RECHAZADO' : 'EN REVISIÓN'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-dark-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <History className="text-gray-400"/>
                        <h2 className="text-xl font-bold text-white">Movimientos</h2>
                    </div>
                    <div className="space-y-4">
                        {/* ONLY SHOW MY TRANSACTIONS */}
                        {myTransactions.slice(0, 5).map(tx => (
                            <div key={tx.id} className="flex justify-between items-center pb-4 border-b border-gray-700 last:border-0">
                                <div>
                                    <p className="text-white text-sm font-medium">{tx.description}</p>
                                    <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`font-mono font-bold ${tx.type === 'DEPOSIT' || tx.type === 'REDEEM' ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.type === 'DEPOSIT' || tx.type === 'REDEEM' ? '+' : '-'}{tx.amount.toFixed(2)} Bs
                                </span>
                            </div>
                        ))}
                        {myTransactions.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Sin movimientos.</p>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Wallet;
