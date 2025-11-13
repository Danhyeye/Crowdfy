"use client";

import { PiggyBank, LayoutGrid, FilePenLine, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ViewMode } from "@/store/useFilterStore";
interface ViewTabsProps {
  activeTab: "all" | "petitions" | "donations";
  viewMode: ViewMode;
  onTabChange: (value: "all" | "petitions" | "donations") => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const tabs = [
  { id: "all" as const, label: "All views", icon: null },
  { id: "petitions" as const, label: "Petitions", icon: FilePenLine },
  { id: "donations" as const, label: "Donations", icon: PiggyBank },
] as const;

const viewModes = [
  { id: "gallery" as const, icon: LayoutGrid, label: "Gallery view" },
  { id: "maps" as const, icon: MapPin, label: "Maps view" },
] as const;

export function ViewTabs({
  activeTab,
  viewMode,
  onTabChange,
  onViewModeChange,
}: ViewTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <ButtonGroup className="bg-background w-full sm:w-auto rounded-lg border border-muted">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          
          return (
            <Button
              key={id}
              variant="ghost"
              onClick={() => onTabChange(id)}
              className={`
                flex-1 sm:flex-none h-9 sm:h-10 px-3 sm:px-4
                text-xs sm:text-sm font-medium
                transition-all duration-200
                ${isActive ? "bg-muted shadow-sm text-foreground" : "hover:bg-muted text-muted-foreground"}
              `}
              aria-pressed={isActive}
              aria-label={label}
            >
              <span className="flex items-center gap-2">
                {Icon && (
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {label}
                </span>
              </span>
            </Button>
          );
        })}
      </ButtonGroup>

      <ButtonGroup 
        className="hidden sm:flex bg-background rounded-lg border border-muted"
        aria-label="View mode"
      >
        {viewModes.map(({ id, icon: Icon, label }) => {
          const isActive = viewMode === id;
          
          return (
            <Button
              key={id}
              variant="ghost"
              size="icon"
              onClick={() => onViewModeChange(id as ViewMode)}
              className={`
                h-9 w-9 transition-all duration-200
                ${isActive 
                  ? "bg-background shadow-sm text-foreground" 
                  : "hover:bg-muted text-muted-foreground"
                }
              `}
              aria-pressed={isActive}
              aria-label={label}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}