import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="w-full sm:w-auto shrink-0 flex items-center">
          {action}
        </div>
      )}
    </div>
  );
}
