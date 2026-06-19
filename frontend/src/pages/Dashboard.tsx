import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Plus,
  ChevronRight,
  BarChart2,
  Activity,
  TrendingUp,
  Loader2
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CustomButton from '../components/CustomButton';
import SkillProgressChart from '../charts/SkillProgressChart';
import SkillDistributionChart from '../charts/SkillDistributionChart';
import { analysisService, AnalysisResponse } from '../services/api';

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LearningProgressItem {
  id: string;
  name: string;
  progress: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const userName = localStorage.getItem('userName') || userEmail.split('@')[0];

  const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await analysisService.getAll();
        // Sort by analyzedDate descending (most recent first)
        const sorted = data.sort((a, b) => new Date(b.analyzedDate).getTime() - new Date(a.analyzedDate).getTime());
        setAnalyses(sorted);
      } catch (err) {
        console.error('Failed to fetch analyses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  // Compute unique skills and their latest analysis state
  const latestBySkill: Record<string, AnalysisResponse> = {};
  analyses.forEach((item) => {
    const key = item.skillName.toLowerCase().trim();
    if (!latestBySkill[key]) {
      latestBySkill[key] = item;
    }
  });

  const latestSkillsList = Object.values(latestBySkill);

  // Compute statistics
  const totalSkillsCount = latestSkillsList.length;
  const completedSkillsCount = latestSkillsList.filter((s) => s.missingSkills.length === 0).length;
  const pendingSkillsCount = latestSkillsList.filter((s) => s.missingSkills.length > 0).length;

  // Format data for charts
  const chartData = latestSkillsList.map((s) => {
    let score = 40;
    if (s.currentLevel.toLowerCase() === 'intermediate') score = 70;
    if (s.currentLevel.toLowerCase() === 'advanced') score = 100;
    return {
      name: s.skillName,
      value: score,
    };
  });

  // Generate dynamic activities based on analysis history
  const activities: ActivityItem[] = analyses.slice(0, 4).map((item, idx) => {
    const date = new Date(item.analyzedDate);
    const timeFormatted = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const hasGaps = item.missingSkills.length > 0;
    return {
      id: String(item.id || idx),
      text: `Ran gap audit for ${item.skillName} (${item.currentLevel})`,
      time: timeFormatted,
      icon: hasGaps ? AlertCircle : CheckCircle2,
    };
  });

  // Fallback to static mock activities if no analyses exist
  const displayActivities = activities.length > 0 ? activities : [
    { id: 'mock-1', text: 'No recent activity logs available', time: 'Start by running an analysis', icon: Activity }
  ];

  // Dynamic learning progress based on missing skills of pending items
  const learningProgress: LearningProgressItem[] = [];
  latestSkillsList.forEach((s) => {
    if (s.missingSkills.length > 0) {
      // Create progress modules based on missing skills
      s.missingSkills.slice(0, 2).forEach((gap, idx) => {
        learningProgress.push({
          id: `${s.skillName}-${idx}`,
          name: `${s.skillName}: ${gap}`,
          progress: idx === 0 ? 60 : 30, // Simulated progression rate
        });
      });
    }
  });

  // Fallback progress if none are pending
  const displayProgress = learningProgress.length > 0 ? learningProgress.slice(0, 4) : [
    { id: 'mock-p1', name: 'All analyzed skills are mastered!', progress: 100 }
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-400 mb-3" />
        <p className="text-slate-400 text-sm">Loading your profile dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Page Header */}
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${userName}! Track your technical competencies, identify gap areas, and focus on recommended learning tasks.`}
        action={
          <CustomButton
            onClick={() => navigate('/skill-analysis')}
            icon={Plus}
          >
            New Analysis
          </CustomButton>
        }
      />

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Skills"
          value={totalSkillsCount}
          icon={Target}
          colorScheme="blue"
          trend={{ value: 'Across profiles', isPositive: true }}
        />
        <StatCard
          title="Completed Skills"
          value={completedSkillsCount}
          icon={CheckCircle2}
          colorScheme="emerald"
          trend={{
            value: totalSkillsCount > 0 ? `${Math.round((completedSkillsCount / totalSkillsCount) * 100)}% rate` : '0% rate',
            isPositive: true,
          }}
        />
        <StatCard
          title="Pending Skills"
          value={pendingSkillsCount}
          icon={AlertCircle}
          colorScheme="amber"
          trend={{ value: `${pendingSkillsCount} in progress`, isPositive: false }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Progress Chart Card */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Skills Progress</h3>
          <p className="text-xs text-slate-400">Your self-assessed proficiency score per core technology.</p>
          <SkillProgressChart data={chartData} />
        </div>

        {/* Skill Distribution Chart Card */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Skill Distribution</h3>
          <p className="text-xs text-slate-400">Relative weight distribution of evaluated technical modules.</p>
          <SkillDistributionChart data={chartData} />
        </div>
      </div>

      {/* Recent Activity and Learning Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Section */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-4">
            {displayActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start space-x-3 text-sm">
                  <div className="bg-slate-900 p-2 rounded-xl text-blue-400 border border-slate-800 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-slate-200 font-medium">{act.text}</p>
                    <p className="text-[10px] text-slate-500">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Progress Section */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>Learning Progress</span>
          </h3>
          <div className="space-y-5">
            {displayProgress.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200 truncate max-w-[80%]">{item.name}</span>
                  <span className="text-blue-400">{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Analysis Section */}
      <div className="glassmorphism rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-900 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-blue-400" />
            <span>Recent Skill Analysis</span>
          </h2>
          <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Last 5 records
          </span>
        </div>

        {/* Table/List View */}
        <div className="divide-y divide-slate-900 overflow-x-auto">
          {analyses.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Skill</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Analyzed Date</th>
                  <th className="px-6 py-4">Gaps Detected</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-sm text-slate-300">
                {analyses.slice(0, 5).map((item) => {
                  const hasGaps = item.missingSkills.length > 0;
                  const formattedDate = new Date(item.analyzedDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{item.skillName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          item.currentLevel === 'Advanced'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                            : item.currentLevel === 'Intermediate'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                        }`}>
                          {item.currentLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {hasGaps ? (
                          <span className="text-slate-400 text-xs truncate block" title={item.missingSkills.join(', ')}>
                            Missing: {item.missingSkills.join(', ')}
                          </span>
                        ) : (
                          <span className="text-emerald-400 text-xs">No missing skills</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          !hasGaps
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${!hasGaps ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span>{!hasGaps ? 'Completed' : 'Pending'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate('/skill-analysis', { state: { skillName: item.skillName, level: item.currentLevel } })}
                          className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center text-xs group"
                        >
                          <span>Re-analyze</span>
                          <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              No skills analyzed yet. Click "New Analysis" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
