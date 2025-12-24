"use client";

import * as React from "react";
import { Moon, Sun, RotateCcw, Settings, Check, CircleOff } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

export function ThemeCustomizer() {
  const { setTheme, theme } = useTheme();
  const { setOpen, open } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const [radius, setRadius] = React.useState("0.5");
  const [scale, setScale] = React.useState("1");

  React.useEffect(() => {
    setMounted(true);
    const r = getComputedStyle(document.documentElement)
      .getPropertyValue("--radius")
      .replace("rem", "");
    if (r) setRadius(r.trim());
  }, []);

  const handleRadiusChange = (value: string) => {
    if (!value) return;
    setRadius(value);
    document.documentElement.style.setProperty("--radius", `${value}rem`);
  };

  const handleScaleChange = (value: string) => {
    if (!value) return;
    setScale(value);
    document.documentElement.style.fontSize = `${parseFloat(value) * 100}%`;
  };

  const sidebarMode = open ? "default" : "icon";

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Open Theme Customizer</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-6" align="end">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium leading-none">Theme Customizer</h4>
              <p className="text-sm text-muted-foreground">
                Customize the appearance of the dashboard.
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {/* Color Mode */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Color mode
              </Label>
              <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(val) => val && setTheme(val)}
                className="w-full gap-2"
              >
                <ToggleGroupItem
                  value="light"
                  className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Scale */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Scale
              </Label>
              <ToggleGroup
                type="single"
                value={scale}
                onValueChange={handleScaleChange}
                className="w-full gap-2"
              >
                <ToggleGroupItem
                  value="1"
                  className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                >
                  <CircleOff className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="0.9"
                  className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                >
                  XS
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="1.1"
                  className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                >
                  LG
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Radius */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Radius
              </Label>
              <ToggleGroup
                type="single"
                value={radius}
                onValueChange={handleRadiusChange}
                className="w-full justify-between gap-2"
              >
                {[
                  { value: "0", label: "0" },
                  { value: "0.3", label: "SM" },
                  { value: "0.5", label: "MD" },
                  { value: "0.75", label: "LG" },
                  { value: "1.0", label: "XL" },
                ].map((item) => (
                  <ToggleGroupItem
                    key={item.value}
                    value={item.value}
                    className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                  >
                    {item.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Sidebar Mode */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Sidebar mode
              </Label>
              <ToggleGroup
                type="single"
                value={sidebarMode}
                onValueChange={(val) => {
                  if (val === "default") setOpen(true);
                  if (val === "icon") setOpen(false);
                }}
                className="w-full gap-2"
              >
                <ToggleGroupItem
                  value="default"
                  className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                >
                  Default
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="icon"
                  className="w-full rounded-md border-2 border-muted hover:border-accent data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"
                >
                  Icon
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Separator />

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                setTheme("system");
                setRadius("0.5");
                document.documentElement.style.setProperty(
                  "--radius",
                  "0.5rem"
                );
                setOpen(true);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
