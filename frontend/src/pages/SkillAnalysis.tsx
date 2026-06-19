import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Target, Loader2, Sparkles, AlertTriangle, BookOpen, ExternalLink, RefreshCw, CheckCircle2, Briefcase, Compass } from 'lucide-react';
import { analysisService, roleAnalysisService, RoleAnalysisResponse } from '../services/api';

interface AnalysisResult {
  skillName: string;
  level: string;
  missingSkills: string[];
  recommendations: {
    title: string;
    resource: string;
    type: 'Course' | 'Documentation' | 'Hands-on Practice';
  }[];
  evaluation: string;
}

const parseRecommendations = (recString: string) => {
  if (!recString) return [];
  return recString.split('\n').map((line) => {
    const cleanLine = line.replace(/^\d+\.\s*/, '');
    const parts = cleanLine.split('|');
    if (parts.length >= 3) {
      return {
        title: parts[0].trim(),
        resource: parts[1].trim(),
        type: parts[2].trim() as 'Course' | 'Documentation' | 'Hands-on Practice',
      };
    }
    return {
      title: cleanLine,
      resource: 'google.com',
      type: 'Documentation' as const,
    };
  });
};

export default function SkillAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tabs: 'single' (assess a single skill) or 'role' (assess skill gap for a target role)
  const [activeTab, setActiveTab] = useState<'single' | 'role'>('single');

  // Single Skill Analysis State
  const [skillInput, setSkillInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Target Role Analysis State
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [roleIsLoading, setRoleIsLoading] = useState(false);
  const [roleError, setRoleError] = useState('');
  const [roleResult, setRoleResult] = useState<RoleAnalysisResponse | null>(null);

  const userIdStr = localStorage.getItem('userId') || '1';
  const currentUserId = parseInt(userIdStr, 10);

  // Check if routed with state from dashboard
  useEffect(() => {
    const state = location.state as { skillName?: string; level?: string } | null;
    if (state?.skillName) {
      setSkillInput(state.skillName);
      if (state.level) setExperienceLevel(state.level);
      setActiveTab('single');
    }
  }, [location]);

  // Handle Single Skill Analysis
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analysisService.run(skillInput.trim(), experienceLevel);
      setResult({
        skillName: data.skillName,
        level: data.currentLevel,
        missingSkills: data.missingSkills,
        recommendations: parseRecommendations(data.recommendation),
        evaluation: data.evaluation,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Analysis failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Role-based Gap Analysis
  const handleRoleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    setRoleIsLoading(true);
    setRoleError('');
    setRoleResult(null);

    try {
      const data = await roleAnalysisService.run(currentUserId, selectedRole);
      setRoleResult(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Role analysis failed. Please ensure you have registered skills.';
      setRoleError(msg);
    } finally {
      setRoleIsLoading(false);
    }
  };

  const loadSuggestion = (skill: string, level: string) => {
    setSkillInput(skill);
    setExperienceLevel(level);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          Skill & Role Analyzer
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Evaluate your specific technical capabilities. Compare your registered skill inventory against target professional roles or analyze a single technology.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 max-w-md">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'single'
              ? 'text-blue-400 bg-slate-850 shadow-sm border border-slate-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Single Skill Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('role')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'role'
              ? 'text-blue-400 bg-slate-850 shadow-sm border border-slate-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Target Role Analysis</span>
        </button>
      </div>

      {activeTab === 'single' ? (
        // TAB 1: Single Skill Analysis
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Input */}
          <div className="lg:col-span-5 glassmorphism p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span>Analysis Parameters</span>
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-5">
              {/* Skill Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Technical Skill
                </label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. React, Docker, Kubernetes, TypeScript"
                  className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Experience Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-slate-100 outline-none transition-all focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !skillInput.trim()}
                className="w-full accent-gradient hover:opacity-95 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Running Gap Analytics...
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 mr-2" />
                    Analyze Skill Gap
                  </>
                )}
              </button>
            </form>

            {/* Quick Suggestions */}
            <div className="pt-4 border-t border-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Quick Templates
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => loadSuggestion('React', 'Intermediate')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  React
                </button>
                <button
                  onClick={() => loadSuggestion('TypeScript', 'Intermediate')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => loadSuggestion('Docker', 'Beginner')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Docker
                </button>
                <button
                  onClick={() => loadSuggestion('Kubernetes', 'Intermediate')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Kubernetes
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Result Rendering */}
          <div className="lg:col-span-7">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="glassmorphism p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Analyzing conceptual competencies</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 mx-auto">
                    Cross-referencing your skill profile against standard professional benchmarks and generating learning pathways...
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !result && (
              <div className="glassmorphism p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <Target className="h-12 w-12 text-slate-600 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-slate-300">Ready for Evaluation</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-1 mx-auto">
                    Configure your technical skill parameters on the left and start the gap analysis.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && result && (
              <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 animate-in zoom-in-95 fade-in duration-300">
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Analysis Result</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{result.skillName}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Evaluated Level:</span>
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                      {result.level}
                    </span>
                  </div>
                </div>

                {/* Evaluation Paragraph */}
                <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl text-slate-300 text-sm leading-relaxed">
                  {result.evaluation}
                </div>

                {/* Skill Gap Percentage Visualization */}
                <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-350 font-bold">Skill Gap Analysis</span>
                    <span className="text-amber-400 font-bold">
                      {result.missingSkills.length === 0 ? '0%' : `${Math.round((result.missingSkills.length / (result.missingSkills.length + 2)) * 100)}% Gap`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.missingSkills.length === 0 ? 0 : Math.round((result.missingSkills.length / (result.missingSkills.length + 2)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-450 leading-normal">
                    {result.missingSkills.length === 0
                      ? 'Congratulations! You meet all structured benchmarks for this capability level.'
                      : `You have attained roughly ${100 - Math.round((result.missingSkills.length / (result.missingSkills.length + 2)) * 100)}% of the core competencies expected at this level.`}
                  </p>
                </div>

                {/* Missing Skills / Gaps */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span>Detected Skill Gaps ({result.missingSkills.length})</span>
                  </h4>
                  {result.missingSkills.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {result.missingSkills.map((gap, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-900">
                          <span className="h-1.5 w-1.5 bg-amber-400 rounded-full mt-2 shrink-0" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center space-x-2 text-sm text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Fantastic! No structural gaps detected for this skill level.</span>
                    </div>
                  )}
                </div>

                {/* Learning Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                    <span>Targeted Learning Path</span>
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 gap-3 hover:border-slate-700 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              rec.type === 'Course'
                                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/25'
                                : rec.type === 'Documentation'
                                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                            }`}>
                              {rec.type}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-white">{rec.title}</p>
                        </div>
                        <a
                          href={`https://${rec.resource}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 whitespace-nowrap self-start sm:self-auto"
                        >
                          <span>{rec.resource}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset/Re-analyze button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setResult(null)}
                    className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset Analysis</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // TAB 2: Target Role Analysis
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Selector Form */}
          <div className="lg:col-span-5 glassmorphism p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-400" />
              <span>Target Role Selector</span>
            </h2>

            <form onSubmit={handleRoleAnalyze} className="space-y-5">
              {/* Target Role Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Select Target Professional Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-slate-100 outline-none transition-all focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  disabled={roleIsLoading}
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full-stack Developer">Full-stack Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Engineer">Data Engineer</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={roleIsLoading}
                className="w-full accent-gradient hover:opacity-95 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center transition-all disabled:opacity-50"
              >
                {roleIsLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Calculating Role Gaps...
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 mr-2" />
                    Run Role Gap Analysis
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-900 text-xs text-slate-450 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-350 uppercase tracking-wider">How role gap logic works:</p>
              <p>We retrieve the required skill matrices for your target role and compare them case-insensitively with your registered skills inventory.</p>
              <p>Skills present in both sets are **Matched**, requirements you lack are **Missing**, and extra skills you possess are labeled **Additional**.</p>
            </div>
          </div>

          {/* Right Column: Role Analysis Results */}
          <div className="lg:col-span-7">
            {roleError && (
              <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/20 text-red-300 text-sm">
                {roleError}
              </div>
            )}

            {roleIsLoading && (
              <div className="glassmorphism p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Comparing Skills Matrices</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 mx-auto">
                    Computing gap percentage, overall readiness score, and compiling custom learning paths...
                  </p>
                </div>
              </div>
            )}

            {!roleIsLoading && !roleResult && (
              <div className="glassmorphism p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <Briefcase className="h-12 w-12 text-slate-650 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-slate-300">Ready for Role Analysis</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-1 mx-auto">
                    Choose a target professional role on the left and start the comprehensive audit.
                  </p>
                </div>
              </div>
            )}

            {!roleIsLoading && roleResult && (
              <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-8 animate-in zoom-in-95 fade-in duration-300">
                {/* Result Header */}
                <div className="pb-4 border-b border-slate-900 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Target Role Analysis</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{roleResult.targetRole}</h3>
                  </div>
                  <span className="text-slate-500 text-xs font-semibold">
                    {new Date(roleResult.analyzedDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Score Indicators Gauge block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Readiness Score */}
                  <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Readiness Index</span>
                      <span className="text-emerald-400 text-sm font-extrabold">{Math.round(roleResult.readinessScore)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${roleResult.readinessScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Gap Score */}
                  <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Skill Gap</span>
                      <span className="text-amber-400 text-sm font-extrabold">{Math.round(roleResult.gapPercentage)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${roleResult.gapPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skill Categorizations (Matched, Missing, Additional) */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Skill Mapping Categories</h4>
                  <div className="space-y-3.5">
                    {/* Matched Skills */}
                    <div>
                      <span className="text-xs text-slate-400 font-semibold mb-1.5 block">Matched Skills ({roleResult.matchedSkills.length})</span>
                      {roleResult.matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {roleResult.matchedSkills.map((s, idx) => (
                            <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No matched skills. Add skills to your profile inventory.</p>
                      )}
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <span className="text-xs text-slate-400 font-semibold mb-1.5 block">Missing Target Skills ({roleResult.missingSkills.length})</span>
                      {roleResult.missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {roleResult.missingSkills.map((s, idx) => (
                            <span key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-450 px-2.5 py-1 rounded-lg text-xs font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/25 p-2.5 rounded-lg">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Wow! You satisfy all core requirements for this profile!</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Skills */}
                    {roleResult.additionalSkills.length > 0 && (
                      <div>
                        <span className="text-xs text-slate-400 font-semibold mb-1.5 block">Additional Skills in Profile ({roleResult.additionalSkills.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {roleResult.additionalSkills.map((s, idx) => (
                            <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg text-xs font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                {roleResult.recommendations.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-900">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                      <span>Actionable Learning Recommendations</span>
                    </h4>
                    <div className="space-y-4">
                      {roleResult.recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-slate-900/35 border border-slate-800/80 p-5 rounded-xl space-y-3.5">
                          {/* Heading */}
                          <div className="flex justify-between items-center">
                            <h5 className="font-bold text-white text-sm">{rec.skillName}</h5>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                              rec.importance === 'Critical'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : rec.importance === 'High'
                                ? 'bg-amber-500/10 text-amber-450 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {rec.importance} Priority
                            </span>
                          </div>

                          {/* Topics */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Key Topics to Learn</span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1.5">
                              {rec.topics.map((t, tIdx) => (
                                <li key={tIdx} className="text-xs text-slate-300 flex items-center space-x-1.5">
                                  <span className="h-1 w-1 bg-blue-400 rounded-full shrink-0" />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Practice Projects */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Practice Projects</span>
                            <div className="mt-1.5 space-y-1">
                              {rec.practiceProjects.map((p, pIdx) => (
                                <div key={pIdx} className="bg-slate-950/40 text-slate-350 p-2 rounded border border-slate-900 text-xs">
                                  {p}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Suggested Resources</span>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {rec.resources.map((res, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={`https://google.com/search?q=${encodeURIComponent(res)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center space-x-1 bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/10 hover:border-blue-500/20 transition-all"
                                >
                                  <span>{res}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Timeline Roadmap Overview */}
                {roleResult.roadmap.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-900">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                        <Compass className="h-4 w-4 text-blue-400" />
                        <span>Timeline Learning Roadmap</span>
                      </h4>
                      <button
                        onClick={() => navigate('/roadmap')}
                        className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>Full Track View</span>
                        <Compass className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                      {roleResult.roadmap.map((item, idx) => (
                        <div key={idx} className="relative pl-7 py-1 text-left">
                          <div className="absolute left-1.5 top-2.5 w-3 h-3 bg-blue-500 border border-slate-950 rounded-full" />
                          <div className="flex justify-between items-start text-xs font-bold text-slate-400">
                            <span className="text-white">{item.week}: {item.title}</span>
                            <span className="text-slate-500">{item.estimatedHours} hrs est.</span>
                          </div>
                          <p className="text-[11px] text-slate-450 mt-0.5 truncate max-w-sm">
                            Focus areas: {item.topics.join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setRoleResult(null)}
                    className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset Analysis</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
