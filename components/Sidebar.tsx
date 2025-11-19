"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Image as lucideImage,
  Video,
  MoreHorizontal,
  Upload,
  User,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/user.actions";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "My videos",
    href: "/my-videos",
    icon: Video,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  }
];

const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={cn("flex flex-col h-full px-4 pt-4", className)}>
      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                "hover:bg-gradient-to-r dark:hover:from-pink-900/20 dark:hover:to-purple-900/20",
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <Image
        src="/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />

      {/* User Profile Section */}
      <div className=" border-border/50 !mt-4">
        {loading ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-zinc-50 dark:from-slate-800/50 dark:to-zinc-800/50 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        ) : currentUser ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-primary-lite/60 to-primary-lite/50 dark:from-slate-800/50 dark:to-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {currentUser.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentUser.email || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.email || "No email available"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 !pb-0 rounded-2xl bg-gradient-to-r from-slate-50 to-zinc-50 dark:from-slate-800/50 dark:to-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">?</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Guest User
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Not signed in
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
