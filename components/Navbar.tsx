"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Avatar from "@/components/ui/avatar";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Search, Upload, Settings, LogOut, Video } from "lucide-react";
import { cn } from "@/lib/utils";
// keyup-based search propagation
import * as React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar({ className, onSearchChange }: { className?: string; onSearchChange?: (value: string) => void }) {
  const [query, setQuery] = React.useState("");

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.currentTarget as HTMLInputElement).value;
    if (value.length >= 3) onSearchChange?.(value);
    else if (value.length === 0) onSearchChange?.("");
  };

  return (
    <header className={cn("sticky py-2 top-0 z-40 w-full border-b border-border dark:bg-white backdrop-blur supports-[backdrop-filter]:bg-card/80", className)}>
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-pink-400">
              <Video className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              VideoMania
            </h1>
          </Link>

        {/* Center: Search */}
        <div className="w-full">
          <div className="relative mx-auto max-w-[40vw] 2xl:max-w-[40vw] 4xl:max-w-[50vw]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={handleKeyUp}
              placeholder="Search videos"
              className="pl-9"
            />
          </div>
        </div>

        {/* Right: Theme toggle + User dropdown */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu
            trigger={
              <div className="flex items-center gap-3">
                <Avatar className=""/>
              </div>
            }
          >
            <DropdownItem>
              <Link href="/profile">Profile</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/upload" className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/settings" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Settings</Link>
            </DropdownItem>
            <DropdownItem>
              <button className="flex w-full items-center gap-2 text-left"><LogOut className="h-4 w-4" /> Logout</button>
            </DropdownItem>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;