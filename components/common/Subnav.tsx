"use client";

import { useState, useEffect, useMemo } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { LayoutGridIcon, MapPin, NewspaperIcon, SearchIcon, X } from "lucide-react";
import { useFilterStore } from "@/store/useFilterStore";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Campaign } from "@/types/campaigns";

export function Subnav() {
  const { searchQuery, setSearchQuery, viewMode, setViewMode } = useFilterStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    // Set platform after mount to avoid hydration mismatch
    setIsMac(typeof window !== "undefined" && navigator.platform.toLowerCase().includes("mac"));
  }, []);

  const [debouncedCommandSearch, setDebouncedCommandSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCommandSearch(commandSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [commandSearch]);

  const { data: campaignsData, isLoading } = useCampaigns(
    {
      search: debouncedCommandSearch || undefined,
      page: 1,
      pageSize: 9,
    },
    commandOpen
  );

  const filteredCampaigns = useMemo(() => {
    if (!campaignsData?.campaigns) return [];
    return campaignsData.campaigns;
  }, [campaignsData?.campaigns]);

  const handleSearchClick = () => {
    setCommandOpen(true);
    setCommandSearch("");
  };

  const handleCommandSelect = (campaign: Campaign) => {
    setSearchQuery(campaign.title);
    setLocalSearch(campaign.title);
    setCommandOpen(false);
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalSearch("");
    setSearchQuery("");
  };

  return (
    <div className="fixed top-14 md:top-16 left-0 right-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex flex-col sm:flex-row h-auto sm:h-14 items-stretch sm:items-center justify-between gap-3 sm:gap-4 mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-9 lg:py-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full sm:w-auto">
              <Button
                variant="default"
                onClick={() => setViewMode("gallery")}
                className={`font-medium text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none [&_svg]:size-4 sm:[&_svg]:size-5 ${
                  viewMode === "gallery"
                    ? "bg-[#d9f99d] hover:bg-[#d9f99d]/90 text-foreground"
                    : "bg-background hover:bg-[#d9f99d] text-foreground"
                }`}
              >
                <LayoutGridIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-1 sm:ml-2">Gallery</span>
              </Button>
              <Button
                variant="default"
                onClick={() => setViewMode("maps")}
                className={`font-medium text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none [&_svg]:size-4 sm:[&_svg]:size-5 ${
                  viewMode === "maps"
                    ? "bg-[#d9f99d] hover:bg-[#d9f99d]/90 text-foreground"
                    : "bg-background hover:bg-[#d9f99d] text-foreground"
                }`}
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-1 sm:ml-2">Maps</span>
              </Button>
              <Button
                variant="default"
                disabled
                className="bg-gray-200 hover:bg-gray-200 text-gray-400 cursor-not-allowed font-medium text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none [&_svg]:size-4 sm:[&_svg]:size-5"
              >
                <NewspaperIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-1 sm:ml-2">Feed</span>
              </Button>
            </div>

            <div className="w-full sm:w-64 md:w-80 relative">
              <InputGroup className="h-10 sm:h-11 w-full">
                <InputGroupInput
                  placeholder="Search documentation..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onFocus={handleSearchClick}
                  className="text-sm sm:text-base pr-20"
                />
                <InputGroupAddon>
                  {localSearch ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearSearch}
                      className="flex items-center justify-center hover:bg-muted rounded-sm transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={handleSearchClick} aria-label="Search">
                      <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                    </Button>
                  )}
                </InputGroupAddon>
                <InputGroupAddon>
                {!localSearch && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                    <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hover:bg-muted cursor-pointer transition-colors" onClick={handleSearchClick}>
                      {isMac ? "⌘" : "Ctrl"}
                    </kbd>
                    <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hover:bg-muted cursor-pointer transition-colors" onClick={handleSearchClick}>
                      K
                    </kbd>
                  </div>
                )}
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput
          placeholder="Search campaigns by name..."
          value={commandSearch}
          onValueChange={setCommandSearch}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Searching..." : debouncedCommandSearch ? "No campaigns found." : "Type to search campaigns..."}
          </CommandEmpty>
          {filteredCampaigns.length > 0 && (
            <CommandGroup heading="Campaigns">
              {filteredCampaigns.map((campaign) => (
                <CommandItem
                  key={campaign.id}
                  value={campaign.title}
                  onSelect={() => handleCommandSelect(campaign)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{campaign.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {campaign.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}