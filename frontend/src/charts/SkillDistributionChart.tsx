import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
        <p className="text-blue-450 font-semibold">Score: {dataItem.value}</p>
      </div>
    );
  }
  return null;
};

interface SkillDistributionChartProps {
  data?: ChartDataItem[];
}

export default function SkillDistributionChart({ data }: SkillDistributionChartProps) {
  const chartData = data && data.length > 0 ? data : mockData;

  return (
    <div className="h-[300px] w-full mt-4 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#0f172a" 
                strokeWidth={2}
                className="hover:opacity-90 transition-opacity outline-none"
              />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => <span className="text-slate-350 text-xs font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
