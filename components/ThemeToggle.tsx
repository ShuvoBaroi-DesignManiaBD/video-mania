"use client";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "theme-blue-dark";

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) =>
        setTheme(checked ? "theme-blue-dark" : "theme-blue-light")
      }
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      checkedChildren={
        isDark && 
        <>
          <Sun className="size-4" aria-hidden="true" />
          {/* <span className="text-xs font-semibold">Light</span> */}
        </>
      }
      uncheckedChildren={
        !isDark && 
        <>
          <Moon className="size-4.5" aria-hidden="true" />
          {/* <span className="text-xs font-semibold">Dark</span> */}
        </>
      }
    />
  );
}

export default ThemeToggle;
