"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CategoryChartProps {
  label: string;
  icon: React.ElementType;
  progress: number;
}

export function CategoryChart({ label, icon: Icon, progress }: CategoryChartProps) {
  const data = [
    { value: progress },
    { value: 100 - progress },
  ];

  return (
    <div className="flex flex-col items-center p-5 bg-white rounded-2xl border border-black/5 shadow-sm">
      <div className="relative w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={34}
              outerRadius={48}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#2BA89D" />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-triart-black">{progress}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <Icon className="w-4 h-4 text-triart-green" />
        <span className="text-sm font-medium text-triart-black">{label}</span>
      </div>
    </div>
  );
}
