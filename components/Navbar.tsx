"use client";

import Link from "next/link";
import Avatar from "@/components/ui/avatar";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Video, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOutUser } from "@/lib/actions/user.actions";
import SearchBar from "./SearchBar";

export function Navbar({ className }: { className?: string }) {
  const [signingOut, setSigningOut] = React.useState(false);

  const onLogout = async () => {
    try {
      setSigningOut(true);
      await signOutUser();
      if (typeof window !== "undefined") {
        window.location.assign("/sign-in");
      }
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header
      className={cn(
        "w-full",
        className
      )}
    >
      <div className="mx-auto flex justify-between px-4 py-4 items-center gap-6 dark:bg-transparent">
        <div className="flex items-center gap-18">
        {/* Logo - Hidden on mobile since sidebar has it */}
        <Link
          href="/"
          className="hidden md:flex gap-2 transition-all duration-300 hover:scale-105"
        >
          {/* <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-all duration-300"> */}
            <Video className="size-6 text-white drop-shadow-sm relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-all duration-300 p-2" />
          <h1 className="text-[26px] font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
            VideoMania
          </h1>
        </Link>

        {/* Center: Page Title for Mobile */}
        <div className="lg:hidden flex-1 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            VideoMania
          </h1>
        </div>

        <SearchBar></SearchBar>
        </div>
        {/* Right: Theme toggle + User dropdown */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <DropdownMenu
            trigger={
              <div className="group relative self-center flex items-center gap-3 rounded-2xl transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <Avatar className="transition-all duration-300" />
                  <div className="absolute -bottom-0.5 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
              </div>
            }
          >
            <DropdownItem>
              <Link
                href="/profile"
                className="flex items-center gap-3 py-2 hover:bg-accent/50 transition-colors duration-200 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Profile</span>
              </Link>
            </DropdownItem>
            <div className="border-t border-border/20 my-1" />

            <DropdownItem>
              <Link
                href="/settings"
                className="flex items-center gap-3 py-2 hover:bg-accent/50 transition-colors duration-200 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Settings</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 py-2 text-left"
                disabled={signingOut}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-destructive">
                  {signingOut ? "Logging out..." : "Sign Out"}
                </span>
              </button>
            </DropdownItem>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
