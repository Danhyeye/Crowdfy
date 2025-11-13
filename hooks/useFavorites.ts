import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { campaignsService } from "@/lib/api/fetchCampaigns";
import { useFilterStore } from "@/store/useFilterStore";

export function useFavorites() {
  const { favorites, toggleFavorite } = useFilterStore();

  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => campaignsService.getFavorites(),
  });

  useEffect(() => {
    if (favoritesData) {
      favoritesData.forEach((id) => {
        if (!favorites.includes(id)) {
          toggleFavorite(id);
        }
      });
    }
  }, [favoritesData, favorites, toggleFavorite]);

  return favorites;
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  const { toggleFavorite } = useFilterStore();

  return useMutation({
    mutationFn: ({ campaignId, isFavorite }: { campaignId: string; isFavorite: boolean }) =>
      campaignsService.toggleFavorite(campaignId, isFavorite),
    onMutate: async ({ campaignId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["campaigns"] });
      toggleFavorite(campaignId);
    },
    onError: (_, { campaignId }) => {
      // Revert on error
      toggleFavorite(campaignId);
    },
  });
}