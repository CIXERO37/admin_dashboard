"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function AppearancePage() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          Appearance
        </h3>
      </div>
      <Separator />

      <div className="space-y-8">
        <div className="space-y-1">
          <div className="font-medium">Theme</div>
          <div className="text-sm text-muted-foreground">
            Select the theme for the dashboard.
          </div>
        </div>

        <div className="grid max-w-md grid-cols-1 gap-8 md:grid-cols-2">
          {/* Light Theme Card */}
          <div
            className="relative cursor-pointer"
            onClick={() => setTheme("light")}
          >
            <div
              className={cn(
                "items-center rounded-md border-2 border-muted p-1 hover:border-accent",
                theme === "light" && "border-primary"
              )}
            >
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Light
            </span>
            {theme === "light" && (
              <div className="absolute top-2 right-2 rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>

          {/* Dark Theme Card */}
          <div
            className="relative cursor-pointer"
            onClick={() => setTheme("dark")}
          >
            <div
              className={cn(
                "items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground",
                theme === "dark" && "border-primary"
              )}
            >
              <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Dark
            </span>
            {theme === "dark" && (
              <div className="absolute top-2 right-2 rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
