import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  helper,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  delta?: number;
  icon: LucideIcon;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="group relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-[#d8ff72]/0 blur-2xl transition group-hover:bg-[#d8ff72]/20" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#777970]">{label}</span>
        <span className="grid size-7 place-items-center rounded-lg bg-[#f1f2ec] text-[#6c6e65]">
          <Icon className="size-3.5" />
        </span>
      </div>
      <p className="mt-5 text-[27px] font-semibold tracking-[-0.04em] text-[#1d1e1a]">{value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#92948b]">
        {delta !== undefined ? (
          <span className={positive ? "flex items-center text-[#67951f]" : "flex items-center text-red-500"}>
            {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
        ) : null}
        <span>{helper}</span>
      </div>
    </Card>
  );
}
