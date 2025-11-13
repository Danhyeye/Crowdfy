"use client";

import { useState, useEffect } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "../ui/button";
import { LayoutGridIcon, MapPin, NewspaperIcon, SearchIcon } from "lucide-react";
import { useFilterStore } from "@/store/useFilterStore";

export function Subnav() {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="fixed top-14 md:top-16 left-0 right-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex flex-col sm:flex-row h-auto sm:h-14 items-stretch sm:items-center justify-between gap-3 sm:gap-4 mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-9 lg:py-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full sm:w-auto">
              <Button
                variant="default"
                className="bg-[#d9f99d] hover:bg-[#d9f99d]/90 text-foreground font-medium text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none [&_svg]:size-4 sm:[&_svg]:size-5"
              >
                <LayoutGridIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-1 sm:ml-2">Gallery</span>
              </Button>
              <Button
                variant="default"
                className="bg-[#d9f99d] hover:bg-[#d9f99d]/90 text-foreground font-medium text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none [&_svg]:size-4 sm:[&_svg]:size-5"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-1 sm:ml-2">Maps</span>
              </Button>
              <Button
                variant="default"
                className="bg-[#d9f99d] hover:bg-[#d9f99d]/90 text-foreground font-medium text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none [&_svg]:size-4 sm:[&_svg]:size-5"
              >
                <NewspaperIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-1 sm:ml-2">Feed</span>
              </Button>
            </div>

            <div className="w-full sm:w-64 md:w-80">
              <InputGroup className="h-10 sm:h-11 w-full">
                <InputGroupInput
                  placeholder="Search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="text-sm sm:text-base"
                />
                <InputGroupAddon>
                  <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
    </div>
  );
}