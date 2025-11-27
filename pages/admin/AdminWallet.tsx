
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RechargeRequest, PaymentMethod } from '../../types';
import Button from '../../components/Button';
import { Smartphone, Send, Search, CheckCircle, AlertCircle, DollarSign, Wallet, FileText, X, Check, Eye, XCircle, TrendingUp, Download, ArrowUpRight, Upload, Trash, CreditCard, QrCode } from 'lucide-react';

const AdminWallet: React.FC = () => {
  const { user, adminRechargeUser, transactions, rechargeRequests, processRecharge, paymentMethods, addPaymentMethod, deletePaymentMethod } = useApp();
  const [targetEmail, setTargetEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  // State for Verification Modal
  const [selectedRequest, setSelectedRequest] = useState<RechargeRequest | null>(null);
  const [verifyAmount, setVerifyAmount] = useState<string>('');

  // State for Adding Payment Method
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodType, setNewMethodType] = useState<'QR' | 'BANK_INFO'>('QR');
  const [newMethodDetails, setNewMethodDetails] = useState('');
  const [newMethodImage, setNewMethodImage] = useState<string | null>(null);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail || !amount) {
        setMessage({ text: 'Por favor completa todos los campos', type: 'error' });
        return;
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
        setMessage({ text: 'Monto inválido', type: 'error' });
        return;
    }

    // Simulate recharge
    adminRechargeUser(targetEmail, val);
    setMessage({ text: `Recarga de ${val.toFixed(2)} Bs enviada exitosamente a ${targetEmail}`, type: 'success' });
    
    // Reset
    setTargetEmail('');
    setAmount('');
    setTimeout(() => setMessage(null), 4000);
  };

  const openVerifyModal = (req: RechargeRequest) => {
    setSelectedRequest(req);
    setVerifyAmount(req.amount.toString());
  };

  const closeVerifyModal = () => {
    setSelectedRequest(null);
    setVerifyAmount('');
  };

  const handleConfirmVerification = () => {
      if (!selectedRequest) return;
      const finalAmt = parseFloat(verifyAmount);
      
      if (isNaN(finalAmt) || finalAmt <= 0) {
          alert("Por favor ingrese un monto válido.");
          return;
      }

      processRecharge(selectedRequest.id, true, finalAmt);
      setMessage({
          text: `Solicitud aprobada por ${finalAmt.toFixed(2)} Bs.`,
          type: 'success'
      });
      closeVerifyModal();
      setTimeout(() => setMessage(null), 3000);
  };

  const handleRejectVerification = () => {
      if (!selectedRequest) return;
      processRecharge(selectedRequest.id, false);
      setMessage({
          text: 'Solicitud rechazada.',
          type: 'error'
      });
      closeVerifyModal();
      setTimeout(() => setMessage(null), 3000);
  };

  // Payment Method Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMethodImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMethodName) return;

      if (newMethodType === 'QR' && !newMethodImage) {
          alert("Debes subir una imagen para el código QR.");
          return;
      }
      if (newMethodType === 'BANK_INFO' && !newMethodDetails) {
          alert("Debes escribir los detalles de la cuenta.");
          return;
      }

      addPaymentMethod({
          name: newMethodName,
          type: newMethodType,
          imageData: newMethodType === 'QR' ? newMethodImage! : undefined,
          details: newMethodType === 'BANK_INFO' ? newMethodDetails : undefined
      });

      // Reset
      setNewMethodName('');
      setNewMethodDetails('');
      setNewMethodImage(null);
      setMessage({ text: 'Método de cobro añadido correctamente.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
  };

  // List of Recharges for Report
  // We use DEPOSIT transactions to calculate Total Recharged to Users
  const rechargeTransactions = transactions.filter(t => t.type === 'DEPOSIT');
  const totalRecharged = rechargeTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingRequests = rechargeRequests.filter(r => r.status === 'PENDING');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Billetera Administrativa</h1>

      {/* FINANCIAL OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Card: Admin Balance (Sales Income) - Matches Navbar */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 border border-blue-700/50 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl"></div>
             <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-white/10 rounded-lg">
                    <Wallet className="text-white h-6 w-6"/>
                 </div>
                 <h2 className="text-lg font-medium text-blue-200">Saldo Admin (Ingresos Ventas)</h2>
             </div>
             <div>
                 <p className="text-4xl font-bold text-white font-mono">{user?.balance.toFixed(2)} Bs</p>
                 <p className="text-xs text-blue-300 mt-1">Ingresos generados por compra de servicios</p>
             </div>
          </div>
          
          {/* Secondary Card: Total Recharged to Users - Matches Report */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-brand-900/20 rounded-lg text-brand-500">
                    <ArrowUpRight className="h-6 w-6"/>
                 </div>
                 <h2 className="text-lg font-medium text-gray-300">Total Recargado a Usuarios</h2>
             </div>
             <div>
                 <p className="text-4xl font-bold text-white font-mono">{totalRecharged.toFixed(2)} Bs</p>
                 <p className="text-xs text-gray-500 mt-1">Suma total de todas las recargas realizadas</p>
             </div>
          </div>
      </div>

      {/* PAYMENT METHODS CONFIGURATION */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="text-brand-500" />
              Configuración de Métodos de Pago
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form to Add New Method */}
              <div className="bg-dark-900/50 p-6 rounded-xl border border-gray-700">
                  <h3 className="font-bold text-white mb-4">Añadir Nuevo Método</h3>
                  <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                      <div>
                          <label className="block text-sm text-gray-400 mb-1">Nombre del Método (ej: Banco Union)</label>
                          <input 
                              type="text" 
                              value={newMethodName} 
                              onChange={(e) => setNewMethodName(e.target.value)}
                              className="w-full bg-dark-800 border border-gray-600 rounded p-2 text-white focus:border-brand-500 outline-none"
                              placeholder="Nombre..."
                              required
                          />
                      </div>
                      
                      <div className="flex gap-4">
                          <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-colors ${newMethodType === 'QR' ? 'bg-brand-900/50 border-brand-500 text-white' : 'border-gray-600 text-gray-400'}`}>
                              <input type="radio" name="type" className="hidden" onClick={() => setNewMethodType('QR')} />
                              <QrCode size={18} />
                              <span>Imagen QR</span>
                          </label>
                          <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-colors ${newMethodType === 'BANK_INFO' ? 'bg-brand-900/50 border-brand-500 text-white' : 'border-gray-600 text-gray-400'}`}>
                              <input type="radio" name="type" className="hidden" onClick={() => setNewMethodType('BANK_INFO')} />
                              <FileText size={18} />
                              <span>Texto / Cuenta</span>
                          </label>
                      </div>

                      {newMethodType === 'QR' ? (
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:bg-dark-800 transition-colors relative">
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              {newMethodImage ? (
                                  <div className="relative">
                                      <img src={newMethodImage} alt="Preview" className="mx-auto h-32 object-contain" />
                                      <span className="text-xs text-green-400 block mt-2">Imagen Cargada</span>
                                  </div>
                              ) : (
                                  <>
                                      <Upload className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                                      <p className="text-sm text-gray-400">Subir foto del QR</p>
                                  </>
                              )}
                          </div>
                      ) : (
                          <div>
                              <label className="block text-sm text-gray-400 mb-1">Detalles de la Cuenta</label>
                              <textarea 
                                  value={newMethodDetails}
                                  onChange={(e) => setNewMethodDetails(e.target.value)}
                                  className="w-full bg-dark-800 border border-gray-600 rounded p-2 text-white focus:border-brand-500 outline-none h-24"
                                  placeholder="Número de cuenta, titular, CI..."
                              />
                          </div>
                      )}

                      <Button type="submit" className="w-full">Guardar Método</Button>
                  </form>
              </div>

              {/* List of Existing Methods */}
              <div className="space-y-4">
                  <h3 className="font-bold text-white">Métodos Activos</h3>
                  {paymentMethods.length === 0 && (
                      <p className="text-gray-500 text-sm">No has añadido métodos de cobro aún. Los usuarios no verán dónde pagar.</p>
                  )}
                  {paymentMethods.map(pm => (
                      <div key={pm.id} className="flex items-start gap-4 bg-dark-900/50 p-4 rounded-xl border border-gray-700 relative group">
                          <button 
                              onClick={() => deletePaymentMethod(pm.id)}
                              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors p-1"
                              title="Eliminar método"
                          >
                              <Trash size={16} />
                          </button>
                          
                          {pm.type === 'QR' && pm.imageData ? (
                              <img src={pm.imageData} alt={pm.name} className="w-16 h-16 object-cover rounded bg-white" />
                          ) : (
                              <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-400">
                                  <FileText size={24} />
                              </div>
                          )}
                          
                          <div className="flex-1">
                              <h4 className="font-bold text-white">{pm.name}</h4>
                              {pm.type === 'BANK_INFO' && (
                                  <p className="text-sm text-gray-400 mt-1 whitespace-pre-wrap">{pm.details}</p>
                              )}
                              {pm.type === 'QR' && (
                                  <span className="text-xs text-brand-400 bg-brand-900/30 px-2 py-0.5 rounded mt-1 inline-block">Código QR</span>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      
      {/* PENDING VALIDATIONS - This is the "Notification" for the Admin */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-brand-500/50 shadow-xl">
           <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <FileText className="text-brand-500" />
                   Validación de Recargas ({pendingRequests.length})
               </h2>
           </div>

           {pendingRequests.length === 0 ? (
               <div className="text-center py-8 bg-dark-900/30 rounded-lg border border-gray-700/50">
                   <CheckCircle className="mx-auto h-12 w-12 text-gray-600 mb-2"/>
                   <p className="text-gray-400">No hay solicitudes de recarga pendientes.</p>
               </div>
           ) : (
               <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-400">
                       <thead className="bg-dark-900 text-gray-200 uppercase">
                           <tr>
                               <th className="px-4 py-3">Usuario</th>
                               <th className="px-4 py-3">Monto Solicitado</th>
                               <th className="px-4 py-3">Fecha</th>
                               <th className="px-4 py-3 text-right">Acción</th>
                           </tr>
                       </thead>
                       <tbody>
                           {pendingRequests.map(req => (
                               <tr key={req.id} className="border-b border-gray-700 hover:bg-dark-700/50 transition-colors">
                                   <td className="px-4 py-3 font-medium text-white">{req.userEmail}</td>
                                   <td className="px-4 py-3 font-bold text-yellow-400">{req.amount.toFixed(2)} Bs</td>
                                   <td className="px-4 py-3">{new Date(req.date).toLocaleString()}</td>
                                   <td className="px-4 py-3 text-right">
                                       <Button 
                                          size="sm"
                                          onClick={() => openVerifyModal(req)}
                                          className="bg-brand-600 hover:bg-brand-700"
                                       >
                                           <Eye size={14} className="mr-2"/> Revisar
                                       </Button>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECHARGE REPORT LIST */}
          <div className="lg:col-span-2 bg-dark-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="text-gray-400" />
                        Reporte de Recargas
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Total acumulado: <span className="text-green-400 font-bold">{totalRecharged.toFixed(2)} Bs</span></p>
                 </div>
                 <button className="text-sm text-brand-400 hover:text-brand-300 flex items-center">
                     <Download size={16} className="mr-1"/> Exportar
                 </button>
              </div>

              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                   <table className="w-full text-left text-sm text-gray-400">
                       <thead className="bg-dark-900 text-gray-200 uppercase sticky top-0">
                           <tr>
                               <th className="px-4 py-3">Fecha / Hora</th>
                               <th className="px-4 py-3">Usuario (Email)</th>
                               <th className="px-4 py-3 text-right">Monto Cargado</th>
                           </tr>
                       </thead>
                       <tbody>
                           {rechargeTransactions.length === 0 ? (
                               <tr>
                                   <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                       No hay historial de recargas.
                                   </td>
                               </tr>
                           ) : (
                               rechargeTransactions.map(tx => (
                                   <tr key={tx.id} className="border-b border-gray-700 hover:bg-dark-700/50 transition-colors">
                                       <td className="px-4 py-3 text-gray-300">
                                           {new Date(tx.date).toLocaleDateString()} <span className="text-gray-500 text-xs ml-1">{new Date(tx.date).toLocaleTimeString()}</span>
                                       </td>
                                       <td className="px-4 py-3 font-medium text-white">
                                           {tx.userEmail || 'Desconocido'}
                                       </td>
                                       <td className="px-4 py-3 text-right font-bold text-green-400">
                                           +{tx.amount.toFixed(2)} Bs
                                       </td>
                                   </tr>
                               ))
                           )}
                       </tbody>
                   </table>
               </div>
          </div>

          {/* Manual Recharge Form */}
          <div className="lg:col-span-1 bg-dark-800 rounded-2xl p-6 border border-gray-700 shadow-xl h-fit">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Smartphone className="text-brand-500"/>
                 Recarga Manual
             </h2>
             
             {message && (
                 <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                     message.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-400' : 'bg-red-900/30 border border-red-800 text-red-400'
                 }`}>
                     {message.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                     <span>{message.text}</span>
                 </div>
             )}

             <form onSubmit={handleRecharge} className="space-y-4">
                 <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Correo del Usuario</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input 
                            type="email"
                            value={targetEmail}
                            onChange={(e) => setTargetEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 bg-dark-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                            placeholder="usuario@ejemplo.com"
                        />
                     </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Monto (Bs)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-500" />
                        </div>
                        <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 bg-dark-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                        />
                    </div>
                 </div>
                 
                 <Button type="submit" variant="secondary" className="w-full h-[50px] text-base mt-2">
                     <Send className="mr-2 h-4 w-4"/> Enviar Recarga
                 </Button>
             </form>
          </div>
      </div>

      {/* VERIFICATION MODAL */}
      {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
              <div className="bg-dark-800 rounded-2xl w-full max-w-4xl border border-gray-700 relative shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                  
                  {/* Left: Image */}
                  <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-700">
                      <img 
                        src={selectedRequest.receiptImage} 
                        alt="Comprobante" 
                        className="max-w-full max-h-[60vh] object-contain" 
                      />
                  </div>

                  {/* Right: Controls */}
                  <div className="w-full md:w-1/2 p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white">Verificar Pago</h3>
                            <p className="text-sm text-gray-400 mt-1">Usuario: {selectedRequest.userEmail}</p>
                            <p className="text-xs text-gray-500">{new Date(selectedRequest.date).toLocaleString()}</p>
                          </div>
                          <button 
                              onClick={closeVerifyModal}
                              className="text-gray-400 hover:text-white transition-colors"
                          >
                              <X size={24} />
                          </button>
                      </div>

                      <div className="flex-1 space-y-6">
                          <div className="bg-dark-900 p-4 rounded-lg border border-gray-700">
                              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Monto Solicitado</label>
                              <div className="text-2xl font-bold text-yellow-400">{selectedRequest.amount.toFixed(2)} Bs</div>
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-white mb-2">Monto a Acreditar (Bs)</label>
                              <p className="text-xs text-gray-400 mb-2">
                                  Verifica el comprobante e ingresa el monto real recibido.
                              </p>
                              <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <DollarSign className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <input 
                                      type="number"
                                      value={verifyAmount}
                                      onChange={(e) => setVerifyAmount(e.target.value)}
                                      className="block w-full pl-10 pr-3 py-3 bg-dark-900 border border-brand-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                      step="0.01"
                                      min="0"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-4">
                          <Button 
                              variant="danger" 
                              onClick={handleRejectVerification}
                              className="flex justify-center"
                          >
                              <XCircle className="mr-2 h-5 w-5" /> Rechazar
                          </Button>
                          <Button 
                              variant="primary" 
                              onClick={handleConfirmVerification}
                              className="flex justify-center bg-green-600 hover:bg-green-700"
                          >
                              <CheckCircle className="mr-2 h-5 w-5" /> Aprobar
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminWallet;
