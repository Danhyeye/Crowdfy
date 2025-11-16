// types/campaign.ts
import { z } from 'zod';

export const ViewModeSchema = z.enum(['gallery', 'maps']);
export const CampaignTypeSchema = z.enum(['donation', 'petition']);

export const CampaignSchema = z.object({
  id: z.string(),
  type: CampaignTypeSchema,
  title: z.string(),
  description: z.string(),
  creator: z.object({
    name: z.string(),
    avatar: z.string(),
    verified: z.boolean(),
  }),
  image: z.string(),
  amount: z.object({
    raised: z.number(),
    currency: z.string(),
  }),
  percentage: z.number(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  supporters: z.number().optional(), // for petitions (signatures)
  createdAt: z.string(), // ISO date string
});

export const CampaignsResponseSchema = z.object({
  campaigns: z.array(CampaignSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const SortBySchema = z.enum(['price', 'date']);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const CampaignFiltersSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: SortBySchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  type: CampaignTypeSchema.optional(),
  search: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type Campaign = z.infer<typeof CampaignSchema>;
export type CampaignsResponse = z.infer<typeof CampaignsResponseSchema>;
export type CampaignFilters = z.infer<typeof CampaignFiltersSchema>;