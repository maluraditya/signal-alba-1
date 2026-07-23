"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { SourceMetric } from "@/lib/types";

const colors = ["#25261f", "#9aca43", "#c8b6ff", "#f2bd5a", "#8aa1b1"];

export function SourceChart({ data }: { data: SourceMetric[] }) {
  return (
    <div className="h-[260px]" role="img" aria-label="Deals by source">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="deals" nameKey="source" innerRadius={62} outerRadius={94} paddingAngle={3} stroke="none">
            {data.map((item, index) => (
              <Cell key={item.source} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#171815", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
