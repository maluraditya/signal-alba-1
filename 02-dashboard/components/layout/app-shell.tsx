"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Sidebar } from "./sidebar";
import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f4f4f0] text-[#20211d]">
      <Sidebar />
      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[#dcddd6]/90 bg-[#f4f4f0]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <MobileNav />
          <button
            onClick={() => setCommandOpen(true)}
            className="flex h-9 w-full max-w-[380px] items-center gap-2 rounded-lg border border-[#d7d8d1] bg-white px-3 text-left text-xs text-[#85877e] shadow-[0_1px_1px_rgba(17,18,15,.03)] transition hover:border-[#c7c8c0]"
            aria-label="Open global search"
          >
            <Search className="size-3.5" />
            <span className="flex-1">Search anything...</span>
            <kbd className="rounded border border-[#dedfd8] bg-[#f5f5f1] px-1.5 py-0.5 font-sans text-[10px] text-[#85877e]">
              ⌘ K
            </kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#dfe0d9] bg-white px-2.5 py-1 text-[10px] font-medium text-[#5f6159] sm:flex">
              <span className="size-1.5 rounded-full bg-[#87c730]" />
              Live workspace
            </span>
          </div>
        </header>
        <main>{children}</main>
      </div>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
