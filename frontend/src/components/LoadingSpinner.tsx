import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({
  size = 'md',
  message
}: LoadingSpinnerProps) {
  const spinnerSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const containerSizes = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center space-y-3 ${containerSizes[size]}`}>
      <Loader2 className={`animate-spin text-blue-400 ${spinnerSizes[size]}`} />
      {message && (
        <div>
          <p className="text-sm font-semibold text-slate-200">{message}</p>
          <p className="text-xs text-slate-500 mt-0.5">Please wait while the system completes this action...</p>
        </div>
      )}
    </div>
  );
}
