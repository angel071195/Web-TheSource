
import React from 'react';
import { LucideIcon, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'black';
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', icon: Icon, fullWidth = false, className = '', ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100",
    outline: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100",
    black: "bg-black text-white hover:bg-gray-900 shadow-lg shadow-gray-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export const LoadingButton: React.FC<{
  stage: 'IDLE' | 'ENCRYPTING' | 'UPLOADING' | 'FINALIZING';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ stage, onClick, disabled, className = '' }) => {
  
  if (stage === 'IDLE') {
    return (
      <Button fullWidth onClick={onClick} disabled={disabled} className={className}>
        Finalizar Registro
      </Button>
    );
  }

  // Dynamic Content based on stage
  let text = "Procesando...";
  let colorClass = "bg-gray-900";
  
  switch(stage) {
    case 'ENCRYPTING':
      text = "Encriptando documentos...";
      colorClass = "bg-blue-600";
      break;
    case 'UPLOADING':
      text = "Subiendo a Servidor Seguro...";
      colorClass = "bg-purple-600";
      break;
    case 'FINALIZING':
      text = "Finalizando...";
      colorClass = "bg-green-600";
      break;
  }

  return (
    <button 
      disabled 
      className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-white shadow-xl transition-all duration-500 ${colorClass} ${className}`}
    >
      <Loader2 size={20} className="animate-spin" />
      <span className="animate-pulse">{text}</span>
    </button>
  );
};

export const VerificationCard: React.FC<{
  name: string;
  profession: string;
  image?: string;
  since?: string;
  memberId?: string;
}> = ({ name, profession, image, since = "2025", memberId = "MBR-" + Math.floor(Math.random()*10000) }) => {
  return (
    <div className="relative w-full aspect-[1.586/1] max-w-[340px] mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-6 shadow-2xl border border-yellow-500/30 overflow-hidden group hover:scale-105 transition-transform duration-500">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-5 -mb-5"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-yellow-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">The Source</h3>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 backdrop-blur-sm w-fit">
               <ShieldCheck size={12} className="text-yellow-400" />
               <span className="text-[10px] font-bold text-yellow-200 uppercase tracking-wider">Verified Member</span>
            </div>
          </div>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TheSourceMember" className="w-10 h-10 opacity-80 rounded-md mix-blend-screen" alt="QR" />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mt-auto">
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20">
             <img src={image || "https://via.placeholder.com/150"} className="w-full h-full rounded-full object-cover border-2 border-gray-900" alt="Profile" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight tracking-tight shadow-black drop-shadow-md">{name}</p>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{profession}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/10">
           <div>
             <p className="text-[8px] text-gray-500 font-bold uppercase">Member ID</p>
             <p className="text-[10px] text-gray-300 font-mono tracking-widest">{memberId}</p>
           </div>
           <div className="text-right">
             <p className="text-[8px] text-gray-500 font-bold uppercase">Member Since</p>
             <p className="text-[10px] text-gray-300 font-mono">{since}</p>
           </div>
        </div>
      </div>
      
      {/* Holographic Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input 
          className={`w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none py-3.5 px-4 ${Icon ? 'pl-12' : ''} placeholder:text-gray-400 transition-all`}
          {...props}
        />
      </div>
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className={`mb-4 w-full ${className}`}>
    {label && <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>}
    <textarea 
      className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none py-3.5 px-4 placeholder:text-gray-400 min-h-[100px] resize-none transition-all"
      {...props}
    />
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'center' | 'bottom';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, position = 'center' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div 
        className={`relative bg-white w-full max-w-md animate-in fade-in zoom-in duration-200 ${
          position === 'bottom' ? 'mt-auto rounded-t-3xl rounded-b-none' : 'rounded-3xl'
        } p-6 shadow-2xl overflow-hidden`}
      >
        {title && <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, color?: 'blue' | 'green' | 'red' | 'gray' }> = ({ children, color = 'gray' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-700'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold ${colors[color]}`}>
      {children}
    </span>
  );
};
