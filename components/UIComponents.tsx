import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
    ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
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
