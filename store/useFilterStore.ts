import { create } from 'zustand';
import { CampaignFilters, SortBy, SortOrder } from '@/lib/api/fetchCampaigns';
import { CampaignType } from '@/types/campaigns';

export type ViewMode = 'gallery' | 'list';

interface FilterState extends CampaignFilters {
  searchQuery: string;
  favorites: string[];
  viewMode: ViewMode;
  setFilters: (filters: Partial<CampaignFilters>) => void;
  resetFilters: () => void;
  setSortBy: (sortBy: SortBy | undefined) => void;
  toggleSortOrder: () => void;
  setPriceRange: (minPrice?: number, maxPrice?: number) => void;
  setType: (type: CampaignType | undefined) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (campaignId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setPage: (page: number) => void;
}

const initialState: CampaignFilters & { searchQuery: string; favorites: string[]; viewMode: 'gallery' | 'list' } = {
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

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  
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
  
  toggleFavorite: (campaignId) => set((state) => {
    const favorites = state.favorites.includes(campaignId)
      ? state.favorites.filter((id) => id !== campaignId)
      : [...state.favorites, campaignId];
    return { favorites };
  }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setPage: (page) => set({ page }),
}));

