import { Award, Calendar, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface SkillCardProps {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  date?: string;
  missingSkills: string[];
  status: 'Completed' | 'Pending';
  onAction?: () => void;
  actionLabel?: string;
}

export default function SkillCard({
  name,
  level,
  date,
  missingSkills,
  status,
  onAction,
  actionLabel = 'Details'
}: SkillCardProps) {
  const levelColors: Record<string, string> = {
    Advanced: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    Intermediate: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    Beginner: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  };

  const currentLevelColor = levelColors[level] || 'bg-slate-500/10 text-slate-300 border-slate-500/20';

  return (
    <div className="glassmorphism p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 group">
      <div>
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-blue-400 group-hover:text-blue-350 transition-colors">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight group-hover:text-blue-100 transition-colors">{name}</h3>
              {date && (
                <div className="flex items-center space-x-1 text-slate-400 text-xs mt-0.5">
                  <Calendar className="h-3 w-3" />
                  <span>{date}</span>
                </div>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentLevelColor}`}>
            {level}
          </span>
        </div>

        {/* Content Section: Missing Gaps */}
        <div className="mb-6">
          {missingSkills.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Gaps Detected ({missingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.slice(0, 3).map((gap, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-slate-900 text-slate-450 border border-slate-800/80 rounded-md truncate max-w-[150px]" title={gap}>
                    {gap}
                  </span>
                ))}
                {missingSkills.length > 3 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-amber-450 border border-amber-500/20 rounded-md">
                    +{missingSkills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/5 px-2.5 py-2 rounded-xl border border-emerald-500/10">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Full Proficiency Attained</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-auto">
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          status === 'Completed'
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span>{status}</span>
        </span>

        {onAction && (
          <button
            onClick={onAction}
            className="text-blue-450 hover:text-blue-350 font-bold inline-flex items-center text-xs group/btn"
          >
            <span>{actionLabel}</span>
            <ChevronRight className="h-3.5 w-3.5 ml-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
