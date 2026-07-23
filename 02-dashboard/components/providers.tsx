"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={250}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#171815",
            color: "#f8f8f4",
            border: "1px solid rgba(255,255,255,.1)",
          },
        }}
      />
    </TooltipProvider>
  );
}
