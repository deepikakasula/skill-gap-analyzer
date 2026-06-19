import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipContentProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ChartDataItem {
  name: string;
  value: number;
}

const mockData: ChartDataItem[] = [
  { name: 'Java', value: 85 },
  { name: 'Spring Boot', value: 75 },
  { name: 'React', value: 70 },
  { name: 'MySQL', value: 80 },
  { name: 'Git', value: 90 },
];

const COLORS = ['#3b82f6', '#06b6d4', '#6366f1', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload }: Partial<TooltipContentProps<ValueType, NameType>>) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0];
    return (
      <div className="glassmorphism p-3 rounded-xl border border-slate-800 text-xs shadow-xl">
        <p className="font-bold text-white mb-1">{dataItem.name}</p>
        <p className="text-blue-450 font-semibold">Proficiency: {dataItem.value}%</p>
      </div>
    );
  }
  return null;
};

interface SkillProgressChartProps {
  data?: ChartDataItem[];
}

export default function SkillProgressChart({ data }: SkillProgressChartProps) {
  const chartData = data && data.length > 0 ? data : mockData;

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(51, 65, 85, 0.15)', radius: 8 }} />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          >
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#barGradient)`} 
                stroke={COLORS[index % COLORS.length]} 
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
