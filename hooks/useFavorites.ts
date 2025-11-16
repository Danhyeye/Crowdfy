import { useFilterStore } from "@/store/useFilterStore";

export function useFavorites() {
  const { favorites } = useFilterStore();
  return favorites;
}

export function useToggleFavoriteMutation() {
  const { toggleFavorite } = useFilterStore();

  return {
    mutate: ({ campaignId }: { campaignId: string; isFavorite: boolean }) => {
      toggleFavorite(campaignId);
    },
    mutateAsync: async ({ campaignId }: { campaignId: string; isFavorite: boolean }) => {
      toggleFavorite(campaignId);
      return Promise.resolve();
    },
    isPending: false,
    isError: false,
    isSuccess: true,
  };
}