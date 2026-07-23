"use client";

import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ListToolbar({
  query,
  onQueryChange,
  placeholder,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#e3e4dd] p-3 sm:flex-row sm:items-center">
      <label className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-[#dedfd8] bg-[#fafaf7] px-3 focus-within:ring-2 focus-within:ring-[#d8ff72]">
        <Search className="size-3.5 text-[#8b8d84]" />
        <span className="sr-only">Search</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs outline-none placeholder:text-[#a1a39a]"
        />
      </label>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Filter className="size-3.5" /> Filter
        </Button>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="size-3.5" /> Columns
        </Button>
      </div>
    </div>
  );
}
