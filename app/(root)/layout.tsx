"use client";

import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";
import * as React from "react";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="max-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-border/50 shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 lg:z-50">
        <Navbar />
      </header>

      <div className="flex max-h-screen pt-16">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`
          max-h-screen fixed lg:relative left-0 top-0 pt-3 bottom-0 w-64 bg-white/80 dark:bg-transparent backdrop-blur-sm 
          transform transition-transform duration-300 ease-in-out z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-0 pr-5 pt-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 max-h-[calc(100vh-104px)] overflow-y-auto remove-scrollbar rounded-3xl bg-primary-lite/30 dark:bg-slate-900/60 p-10 ">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
