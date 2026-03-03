import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { FeatureContribution } from "@/services/churnPrediction";

interface FeatureImportanceChartProps {
  contributions: FeatureContribution[];
}

const FeatureImportanceChart = ({ contributions }: FeatureImportanceChartProps) => {
  const data = contributions.slice(0, 8).map((c) => ({
    name: c.feature,
    value: Math.round(c.importance * 1000) / 1000,
    direction: c.direction,
  }));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-display uppercase tracking-wider text-muted-foreground mb-4">
        Feature Impact
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'hsl(210, 40%, 92%)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            width={110}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(222, 44%, 9%)',
              border: '1px solid hsl(222, 30%, 18%)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
            }}
            labelStyle={{ color: 'hsl(210, 40%, 92%)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.direction === 'increases' ? 'hsl(0, 72%, 51%)' : 'hsl(160, 84%, 39%)'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-display">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-destructive inline-block" /> Increases churn
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Decreases churn
        </span>
      </div>
    </div>
  );
};

export default FeatureImportanceChart;
