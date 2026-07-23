import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[linear-gradient(90deg,#ecece7_25%,#f7f7f4_50%,#ecece7_75%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
