"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./app-shell";

const AUTH_PATH_PREFIXES = ["/login", "/auth/"] as const;

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

  if (isAuthRoute) return children;
  return <AppShell>{children}</AppShell>;
}
