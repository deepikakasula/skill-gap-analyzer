import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = HelpCircle,
  action
}: EmptyStateProps) {
  return (
    <div className="glassmorphism p-10 sm:p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-full text-slate-500 animate-pulse">
        <Icon className="h-10 w-10" />
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  );
}
