import PageHeader from '../components/PageHeader';
import { FileText, Download, TrendingUp, Target, Calendar, Award } from 'lucide-react';
import CustomButton from '../components/CustomButton';

interface ReportItem {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  icon: typeof FileText;
}

export default function Reports() {
  const reports: ReportItem[] = [
    {
      id: '1',
      name: 'Q2 Technical Competency Audit',
      type: 'PDF Document',
      date: '2026-06-18',
      size: '2.4 MB',
      icon: FileText,
    },
    {
      id: '2',
      name: 'Full-stack Developer Gap Matrix',
      type: 'CSV Spreadsheet',
      date: '2026-06-15',
      size: '840 KB',
      icon: FileText,
    },
    {
      id: '3',
      name: 'Enterprise Backend Proficiency Distribution',
      type: 'PDF Document',
      date: '2026-06-10',
      size: '4.1 MB',
      icon: FileText,
    },
    {
      id: '4',
      name: 'Personal Roadmap & Milestones Export',
      type: 'PDF Document',
      date: '2026-06-05',
      size: '1.2 MB',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Reports & Analytics"
        description="Generate and download extensive analytical reports regarding your technical skill profiles and development timelines."
        action={
          <CustomButton icon={Download}>
            Generate New Report
          </CustomButton>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glassmorphism p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="bg-blue-500/10 text-blue-400 p-4 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quarterly Progress</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">+14.2%</h3>
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skill Competency Index</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">78 / 100</h3>
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl border border-slate-800 flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
          <div className="bg-purple-500/10 text-purple-400 p-4 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assessments Completed</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">12 Total</h3>
          </div>
        </div>
      </div>

      {/* Report List */}
      <div className="glassmorphism rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-900 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <span>Generated Reports</span>
          </h2>
          <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Export History
          </span>
        </div>

        <div className="divide-y divide-slate-900">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-900/10 transition-colors gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">{report.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs mt-1">
                      <span className="text-slate-400">{report.type}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.date}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>

                <button className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl text-slate-300 hover:text-white transition-all duration-200 flex items-center justify-center space-x-1.5 self-start sm:self-auto w-full sm:w-auto">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
