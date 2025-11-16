"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useFilterStore } from "@/store/useFilterStore";
import { Euro, X, Filter } from "lucide-react";
import formatCurrency from "@/utils/number/price/formatCurrency";
import { useCampaigns } from "@/hooks/useCampaigns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterPanel({ open, onOpenChange }: FilterPanelProps) {
  const { minPrice, maxPrice, setPriceRange, resetFilters } = useFilterStore();
  const [localMinPrice, setLocalMinPrice] = useState<string>("");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>("");
  const [sliderMin, setSliderMin] = useState<number>(0);
  const [sliderMax, setSliderMax] = useState<number>(10000);

  const { data: allCampaignsData } = useCampaigns(
    { page: 1, pageSize: 1000 },
    open
  );

  const priceDistribution = useMemo(() => {
    if (!allCampaignsData?.campaigns) return [];

    const campaigns = allCampaignsData.campaigns;
    const prices = campaigns.map((c) => c.amount.raised);
    const maxPrice = Math.max(...prices, 10000);

    const bucketSize = maxPrice / 10;
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: `${Math.round(i * bucketSize)}-${Math.round((i + 1) * bucketSize)}`,
      min: i * bucketSize,
      max: (i + 1) * bucketSize,
      count: 0,
    }));

    prices.forEach((price) => {
      const bucketIndex = Math.min(
        Math.floor(price / bucketSize),
        buckets.length - 1
      );
      buckets[bucketIndex].count++;
    });

    return buckets;
  }, [allCampaignsData?.campaigns]);

  useEffect(() => {
    if (allCampaignsData?.campaigns && allCampaignsData.campaigns.length > 0) {
      const prices = allCampaignsData.campaigns.map((c) => c.amount.raised);
      const max = Math.max(...prices, 10000);
      setSliderMax(maxPrice || max);
      setSliderMin(minPrice || 0);
    }
  }, [allCampaignsData?.campaigns, minPrice, maxPrice]);

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
    resetFilters();
    setSliderMin(0);
    setSliderMax(10000);
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onOpenChange(false);
  };


  const handlePresetRange = (min: number | undefined, max: number | undefined) => {
    setLocalMinPrice(min?.toString() || "");
    setLocalMaxPrice(max?.toString() || "");
    if (min !== undefined) setSliderMin(min);
    if (max !== undefined) setSliderMax(max);
  };

  const hasActiveFilters = minPrice !== undefined || maxPrice !== undefined;
  const hasLocalChanges = localMinPrice !== "" || localMaxPrice !== "";
  const minValue = localMinPrice ? parseFloat(localMinPrice) : undefined;
  const maxValue = localMaxPrice ? parseFloat(localMaxPrice) : undefined;
  const hasValidationError = minValue !== undefined && maxValue !== undefined && minValue > maxValue;

  const maxPriceValue = useMemo(() => {
    if (!allCampaignsData?.campaigns) return 10000;
    const prices = allCampaignsData.campaigns.map((c) => c.amount.raised);
    return Math.max(...prices, 10000);
  }, [allCampaignsData?.campaigns]);

  const presetRanges = useMemo(() => {
    const max = maxPriceValue;
    return [
      { label: "Under €5K", min: undefined, max: 5000 },
      { label: "€5K - €10K", min: 5000, max: 10000 },
      { label: "€10K - €15K", min: 10000, max: 15000 },
      { label: "€15K - €20K", min: 15000, max: 20000 },
      { label: "€20K - €25K", min: 20000, max: 25000 },
      { label: "€25K - €30K", min: 25000, max: 30000 },
    ];
  }, [maxPriceValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#84CC16]/10">
              <Filter className="h-5 w-5 text-[#84CC16]" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-semibold">Filter Price Range of Campaigns</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Euro className="h-4 w-4 text-[#84CC16]" />
              <span>Price Range</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="minPrice" className="text-sm font-medium text-muted-foreground">
                  Minimum Amount
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={localMinPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalMinPrice(val);
                      if (val) {
                        setSliderMin(parseFloat(val));
                      }
                    }}
                    className="pl-9 h-11 text-base border-2 focus-visible:border-[#84CC16] focus-visible:ring-[#84CC16]/20"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxPrice" className="text-sm font-medium text-muted-foreground">
                  Maximum Amount
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="No limit"
                    value={localMaxPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalMaxPrice(val);
                      if (val) {
                        setSliderMax(parseFloat(val));
                      }
                    }}
                    className="pl-9 h-11 text-base border-2 focus-visible:border-[#84CC16] focus-visible:ring-[#84CC16]/20"
                    min={minValue || 0}
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {priceDistribution.length > 0 && (
            <div className="space-y-4">
              <div className="h-32 sm:h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceDistribution}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#84CC16" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#84CC16" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#84CC16"
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                    />
                    <XAxis
                      dataKey="range"
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
                              <p className="text-sm font-medium">
                                {payload[0].payload.range}: {payload[0].value} campaign{payload[0].value === 1 || payload[0].value === 0 ? '' : 's'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="[&>div>div]:bg-muted [&>div>div>div]:bg-[#84CC16] [&>div>button]:bg-white [&>div>button]:border-[#84CC16] [&>div>button]:shadow-md">
                  <Slider
                    value={[sliderMin, sliderMax]}
                    onValueChange={(values) => {
                      const [min, max] = values;
                      setSliderMin(min);
                      setSliderMax(max);
                      setLocalMinPrice(min.toString());
                      setLocalMaxPrice(max.toString());
                    }}
                    min={0}
                    max={maxPriceValue}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(sliderMin, "EUR", true)}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Min</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(sliderMax, "EUR", true)}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Max</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Quick Filters</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presetRanges.map((range, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handlePresetRange(range.min, range.max)}
                  className={`h-10 text-sm border-2 transition-all ${
                    (minValue === range.min || (!minValue && !range.min)) &&
                    (maxValue === range.max || (!maxValue && !range.max))
                      ? "border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]"
                      : "hover:border-[#84CC16]/50"
                  }`}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {(minValue !== undefined && maxValue !== undefined && minValue > maxValue) && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">
                Minimum amount cannot be greater than maximum amount
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="w-full sm:w-auto order-2 sm:order-1 h-11 text-base font-medium border-2 hover:bg-muted/50"
            disabled={!hasActiveFilters && !hasLocalChanges}
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
          <Button 
            onClick={handleApply} 
            className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-white w-full sm:w-auto order-1 sm:order-2 h-11 text-base font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasLocalChanges && !hasActiveFilters || hasValidationError}
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

