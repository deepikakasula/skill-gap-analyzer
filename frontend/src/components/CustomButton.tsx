import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export default function CustomButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}: CustomButtonProps) {
  // Variant CSS
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "accent-gradient text-white hover:opacity-95 shadow-lg shadow-blue-500/10 active:scale-[0.98]",
    secondary: "bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white active:bg-slate-800",
    outline: "border border-slate-800 hover:border-slate-700 bg-transparent text-slate-300 hover:bg-slate-900/40 hover:text-white active:bg-slate-900/60",
    danger: "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 active:bg-red-500/30"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5"
  };

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`${iconSize[size]} animate-spin`} />
      ) : (
        Icon && iconPosition === 'left' && <Icon className={iconSize[size]} />
      )}
      
      <span>{children}</span>
      
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className={iconSize[size]} />
      )}
    </button>
  );
}
