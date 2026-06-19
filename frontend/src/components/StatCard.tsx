import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorScheme = 'blue',
  trend
}: StatCardProps) {
  const schemeClasses = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/10"
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/10"
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/10"
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/10"
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/10"
    }
  };

  const scheme = schemeClasses[colorScheme] || schemeClasses.blue;

  return (
    <div className="glassmorphism p-6 rounded-2xl border border-slate-800 flex items-center justify-between hover:scale-[1.01] hover:border-slate-700/60 transition-all duration-300 group">
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-xl transition-all duration-300 group-hover:scale-105 ${scheme.bg} ${scheme.text}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{value}</h3>
        </div>
      </div>
      
      {trend && (
        <div className={`flex items-center space-x-0.5 px-2 py-1 rounded-lg text-xs font-semibold border ${
          trend.isPositive 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/10'
        }`}>
          {trend.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
