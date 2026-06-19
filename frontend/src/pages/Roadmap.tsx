import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Compass, Calendar, Award, CheckCircle2, Circle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import CustomButton from '../components/CustomButton';
import { roleAnalysisService, RoadmapWeekItem } from '../services/api';

interface Milestone {
  id: string;
  title: string;
  description: string;
  skills: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  date: string;
}

export default function Roadmap() {
  const navigate = useNavigate();
  const userIdStr = localStorage.getItem('userId') || '1';
  const currentUserId = parseInt(userIdStr, 10);

  const [roadmap, setRoadmap] = useState<RoadmapWeekItem[]>([]);
  const [roleName, setRoleName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [completedWeeks, setCompletedWeeks] = useState<Record<string, boolean>>({});

  // Default fallback static roadmap
  const staticMilestones: Milestone[] = [
    {
      id: 'static-1',
      title: 'Phase 1: Full-stack Foundations',
      description: 'Solidify core programming language proficiencies and database schema layouts.',
      skills: ['Java Standard Edition', 'Git Version Control', 'MySQL Database Design'],
      status: 'Completed',
      date: 'Completed - Q1 2026',
    },
    {
      id: 'static-2',
      title: 'Phase 2: Modern Web Frameworks',
      description: 'Master component-driven architectures and build robust backends with Spring Boot.',
      skills: ['React.js & State Management', 'Spring Boot REST APIs', 'Tailwind CSS layouts'],
      status: 'In Progress',
      date: 'In Progress - Q2 2026',
    },
    {
      id: 'static-3',
      title: 'Phase 3: Microservices & Deployment',
      description: 'Understand multi-container communication, server caching, and orchestration.',
      skills: ['Docker & Multi-stage Builds', 'Spring Cloud Gateway', 'Redis Caching'],
      status: 'Planned',
      date: 'Planned - Q3 2026',
    },
    {
      id: 'static-4',
      title: 'Phase 4: Cloud-Native Architecture',
      description: 'Deploy auto-scaling services and set up secure CI/CD build pipelines.',
      skills: ['Kubernetes Clusters', 'AWS ECS/EKS', 'GitHub Actions CI/CD'],
      status: 'Planned',
      date: 'Planned - Q4 2026',
    },
  ];

  const loadRoadmap = async () => {
    setIsLoading(true);
    try {
      const latestAnalysis = await roleAnalysisService.getLatest(currentUserId);
      if (latestAnalysis && latestAnalysis.roadmap) {
        setRoadmap(latestAnalysis.roadmap);
        setRoleName(latestAnalysis.targetRole);
        
        // Load checkbox state from local storage
        const storageKey = `roadmap_progress_${currentUserId}_${latestAnalysis.targetRole}`;
        const savedProgress = localStorage.getItem(storageKey);
        if (savedProgress) {
          setCompletedWeeks(JSON.parse(savedProgress));
        } else {
          setCompletedWeeks({});
        }
      } else {
        setRoadmap([]);
        setRoleName('');
      }
    } catch (err) {
      console.error('Failed to load personalized roadmap:', err);
      setRoadmap([]);
      setRoleName('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [currentUserId]);

  const handleCheckboxChange = (weekKey: string) => {
    const updated = {
      ...completedWeeks,
      [weekKey]: !completedWeeks[weekKey]
    };
    setCompletedWeeks(updated);

    if (roleName) {
      const storageKey = `roadmap_progress_${currentUserId}_${roleName}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  // Stats calculation
  const isPersonalized = roadmap.length > 0;
  const totalCount = isPersonalized ? roadmap.length : staticMilestones.length;
  const completedCount = isPersonalized
    ? roadmap.filter(item => completedWeeks[item.week]).length
    : staticMilestones.filter(m => m.status === 'Completed').length;

  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Learning Roadmap"
        description={
          isPersonalized
            ? `Your structured learning roadmap generated for the ${roleName} target role. Track your milestones and check items as you progress.`
            : "Track your structured milestones and conceptual modules on your journey to senior full-stack competency."
        }
        action={
          isPersonalized ? (
            <CustomButton variant="outline" icon={RefreshCw} onClick={loadRoadmap}>
              Refresh Roadmap
            </CustomButton>
          ) : (
            <CustomButton icon={Compass} onClick={() => navigate('/skill-analysis')}>
              Run Role Analysis
            </CustomButton>
          )
        }
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="animate-spin h-10 w-10 text-blue-400 mb-3" />
          <p className="text-slate-400 text-sm">Assembling your milestones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Timeline Visualizer */}
          <div className="lg:col-span-8 space-y-6">
            {!isPersonalized && (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/10 text-blue-300 text-xs leading-relaxed flex items-center justify-between gap-4">
                <span>
                  💡 <strong>Default Blueprint View:</strong> Showing standard full-stack pathway. Select a target role under "Skill Analysis" to generate your custom weekly plan.
                </span>
                <button
                  onClick={() => navigate('/skill-analysis')}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all whitespace-nowrap"
                >
                  Analyze Role
                </button>
              </div>
            )}

            <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-slate-800 relative">
              <div className="absolute left-8 sm:left-10 top-20 bottom-10 w-0.5 bg-slate-800" />

              <div className="space-y-10">
                {isPersonalized ? (
                  roadmap.map((weekItem, index) => {
                    const isChecked = !!completedWeeks[weekItem.week];
                    
                    return (
                      <div key={index} className="relative flex items-start space-x-6 sm:space-x-8">
                        {/* Circle / Checkbox Indicator */}
                        <div className="relative z-10 shrink-0">
                          <button
                            onClick={() => handleCheckboxChange(weekItem.week)}
                            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                              isChecked
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-500'
                            }`}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            ) : (
                              <span className="text-[10px] sm:text-xs font-bold font-mono">W{index + 1}</span>
                            )}
                          </button>
                        </div>

                        {/* Roadmap Card */}
                        <div className={`flex-1 glassmorphism/50 border p-5 rounded-xl transition-all duration-200 ${
                          isChecked
                            ? 'border-emerald-500/20 bg-emerald-950/5'
                            : 'border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/10'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className={`font-bold text-base sm:text-lg transition-colors ${isChecked ? 'text-slate-400 line-through' : 'text-white'}`}>
                              {weekItem.week}: {weekItem.title}
                            </h3>
                            <span className={`inline-flex items-center text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                              isChecked
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                            }`}>
                              {isChecked ? 'Completed' : 'Active Plan'}
                            </span>
                          </div>

                          <div className="border-t border-slate-900/60 pt-3 mt-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Topics Matrix</p>
                            <div className="flex flex-wrap gap-2">
                              {weekItem.topics.map((topic, topicIdx) => (
                                <span
                                  key={topicIdx}
                                  className={`text-xs border px-2.5 py-1 rounded-lg transition-all ${
                                    isChecked
                                      ? 'bg-slate-950/60 text-slate-500 border-slate-900'
                                      : 'bg-slate-900 text-slate-300 border-slate-800'
                                  }`}
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center text-xs text-slate-500">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Estimated effort: {weekItem.estimatedHours} hours</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  staticMilestones.map((milestone) => {
                    const isCompleted = milestone.status === 'Completed';
                    const isInProgress = milestone.status === 'In Progress';

                    return (
                      <div key={milestone.id} className="relative flex items-start space-x-6 sm:space-x-8">
                        {/* Circle Indicator */}
                        <div className="relative z-10 shrink-0">
                          {isCompleted ? (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center">
                              <CheckCircle2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                          ) : isInProgress ? (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500/10 border-2 border-blue-500 text-blue-400 flex items-center justify-center animate-pulse">
                              <Compass className="h-4.5 w-4.5 sm:h-5 sm:w-5 animate-spin duration-10000" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-900 border-2 border-slate-700 text-slate-500 flex items-center justify-center">
                              <Circle className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                          )}
                        </div>

                        {/* Milestone Card */}
                        <div className="flex-1 glassmorphism/50 border border-slate-900/60 p-5 rounded-xl hover:border-slate-800 hover:bg-slate-900/10 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className="font-bold text-white text-base sm:text-lg">{milestone.title}</h3>
                            <span className={`inline-flex items-center text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                              isCompleted
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : isInProgress
                                ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}>
                              {milestone.status}
                            </span>
                          </div>

                          <p className="text-slate-400 text-sm mb-4 leading-relaxed">{milestone.description}</p>

                          <div className="border-t border-slate-900/60 pt-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Skills Focused</p>
                            <div className="flex flex-wrap gap-2">
                              {milestone.skills.map((skill, index) => (
                                <span key={index} className="text-xs bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center text-xs text-slate-500">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{milestone.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <Award className="h-5 w-5 text-blue-400" />
                <span>Roadmap Progress Status</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isPersonalized
                  ? `You have marked ${completedCount} of your ${totalCount} weekly milestones as complete for the ${roleName} role.`
                  : "Complete the missing skill items in Spring Boot and React to qualify for the Intermediate Full-Stack Developer Badge."}
              </p>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>{percentComplete}% Completed</span>
                <span>{totalCount - completedCount} Milestones Left</span>
              </div>
            </div>

            <div className="glassmorphism p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base">Recommended Resources</h3>
              <div className="divide-y divide-slate-900">
                <a href="https://react.dev" target="_blank" rel="noreferrer" className="block py-3 group">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">React Advanced Hook Patterns</p>
                    <ArrowRight className="h-3 w-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-slate-550">Official React documentation & guides</p>
                </a>
                <a href="https://spring.io" target="_blank" rel="noreferrer" className="block py-3 group">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Spring Security Hardening</p>
                    <ArrowRight className="h-3 w-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-slate-550">Spring guides and reference manuals</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
