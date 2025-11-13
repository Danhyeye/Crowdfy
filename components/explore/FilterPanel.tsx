"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/store/useFilterStore";

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterPanel({ open, onOpenChange }: FilterPanelProps) {
  const { minPrice, maxPrice, setPriceRange, resetFilters } = useFilterStore();
  const [localMinPrice, setLocalMinPrice] = useState<string>("");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>("");

  useEffect(() => {
    setLocalMinPrice(minPrice?.toString() || "");
    setLocalMaxPrice(maxPrice?.toString() || "");
  }, [minPrice, maxPrice, open]);

  const handleApply = () => {
    const min = localMinPrice ? parseFloat(localMinPrice) : undefined;
    const max = localMaxPrice ? parseFloat(localMaxPrice) : undefined;
    setPriceRange(min, max);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setPriceRange(undefined, undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Filter Campaigns</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="minPrice" className="text-sm sm:text-base font-medium">
              Minimum Amount (€)
            </label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="maxPrice" className="text-sm sm:text-base font-medium">
              Maximum Amount (€)
            </label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="10000"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto text-sm sm:text-base">
            Reset
          </Button>
          <Button onClick={handleApply} className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-white w-full sm:w-auto text-sm sm:text-base">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

