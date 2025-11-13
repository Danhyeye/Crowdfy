import { useQuery } from "@tanstack/react-query";
import { campaignsService, CampaignFilters } from "@/lib/api/fetchCampaigns";

export function useCampaigns(filters: CampaignFilters) {
  return useQuery({
    queryKey: ["campaigns", filters],
    queryFn: () => campaignsService.getAll(filters),
  });
}

