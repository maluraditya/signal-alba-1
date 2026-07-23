import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#dedfd8] bg-white shadow-[0_1px_1px_rgba(17,18,15,.02),0_12px_30px_rgba(17,18,15,.025)]",
        className,
      )}
      {...props}
    />
  );
}
