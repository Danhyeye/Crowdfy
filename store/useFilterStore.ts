import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { Campaign, CampaignFilters, SortBySchema, SortOrderSchema, ViewModeSchema } from '@/types/campaigns';

export type ViewMode = z.infer<typeof ViewModeSchema>;
export type SortBy = z.infer<typeof SortBySchema>;
export type SortOrder = z.infer<typeof SortOrderSchema>;

interface FilterState extends CampaignFilters {
  searchQuery: string;
  favorites: string[];
  viewMode: ViewMode;
  _hasHydrated: boolean;
  setFilters: (filters: Partial<CampaignFilters>) => void;
  resetFilters: () => void;
  setSortBy: (sortBy: SortBy | undefined) => void;
  toggleSortOrder: () => void;
  setPriceRange: (minPrice?: number, maxPrice?: number) => void;
  setType: (type: Campaign['type'] | undefined) => void;
  setSearchQuery: (query: string) => void;
  setLatitude: (latitude?: number) => void;
  setLongitude: (longitude?: number) => void;
  toggleFavorite: (campaignId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setPage: (page: number) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialState: CampaignFilters & { searchQuery: string; favorites: string[]; viewMode: ViewMode } = {
  page: 1,
  pageSize: 9,
  sortBy: undefined,
  sortOrder: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  type: undefined,
  searchQuery: '',
  favorites: [],
  viewMode: 'gallery' as ViewMode,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,
      _hasHydrated: false,
      
      setFilters: (filters) => set((state) => ({ ...state, ...filters })),
      
      resetFilters: () => set(initialState),
      
      setSortBy: (sortBy) => set((state) => {
        if (state.sortBy === sortBy) {
          return { sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' as SortOrder };
        }
        return { sortBy, sortOrder: 'asc' as SortOrder };
      }),
      
      toggleSortOrder: () => set((state) => ({
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' as SortOrder,
      })),
      
      setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice, page: 1 }),
      
      setType: (type) => set({ type, page: 1 }),
      
      setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),

      setLatitude: (latitude?: number) => set({ latitude, page: 1 }),
      
      setLongitude: (longitude?: number) => set({ longitude, page: 1 }),
      
      toggleFavorite: (campaignId) => set((state) => {
        const favorites = state.favorites.includes(campaignId)
          ? state.favorites.filter((id) => id !== campaignId)
          : [...state.favorites, campaignId];
        return { favorites };
      }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setPage: (page) => set({ page }),
      
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'crowdfy-filter-store',
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        favorites: state.favorites,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        type: state.type,
        latitude: state.latitude,
        longitude: state.longitude,
        pageSize: state.pageSize,
        page: state.page,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

