"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// onKeyUp-driven search, min 3 chars

export function SearchBar({ onChange }: { onChange?: (value: string) => void }) {
  const [query, setQuery] = React.useState("");

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.currentTarget as HTMLInputElement).value;
    if (value.length >= 3) onChange?.(value);
    else if (value.length === 0) onChange?.("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={handleKeyUp}
        placeholder="Search videos"
        className="pl-9 rounded-3xl w-84"
      />
    </div>
  );
}

export default SearchBar;