import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CampaignsResponse } from '@/types/campaigns';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const sortBy = searchParams.get('sortBy'); // 'price' or 'date'
    const sortOrder = searchParams.get('sortOrder') || 'asc'; // 'asc' or 'desc'
    const type = searchParams.get('type') as 'donation' | 'petition' | null;
    const latitude = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : null;
    const longitude = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : null;
    const search = searchParams.get('search') || '';

    const filePath = join(process.cwd(), 'data', 'campaigns.data.json');
    const fileContents = await readFile(filePath, 'utf8');
    const data: CampaignsResponse = JSON.parse(fileContents);

    let filteredCampaigns = [...data.campaigns];

    // Apply search filter (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCampaigns = filteredCampaigns.filter((campaign) => {
        const titleMatch = campaign.title.toLowerCase().includes(searchLower);
        const descriptionMatch = campaign.description.toLowerCase().includes(searchLower);
        return titleMatch || descriptionMatch;
      });
    }

    // Apply type filter
    if (type) {
      filteredCampaigns = filteredCampaigns.filter((campaign) => campaign.type === type);
    }

    // Apply location filter
    if (latitude !== null && longitude !== null) {
      filteredCampaigns = filteredCampaigns.filter((campaign) => {
        return Math.abs(campaign.latitude! - latitude) <= 1 && Math.abs(campaign.longitude! - longitude) <= 1;
      });
    }

    // Apply price filter
    if (minPrice !== null || maxPrice !== null) {
      filteredCampaigns = filteredCampaigns.filter((campaign) => {
        const raised = campaign.amount.raised;
        if (minPrice !== null && raised < minPrice) return false;
        if (maxPrice !== null && raised > maxPrice) return false;
        return true;
      });
    }

    // Apply sorting (only one sort at a time)
    if (sortBy === 'price') {
      filteredCampaigns.sort((a, b) => {
        const diff = a.amount.raised - b.amount.raised;
        return sortOrder === 'asc' ? diff : -diff;
      });
    } else if (sortBy === 'date') {
      filteredCampaigns.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        const diff = dateA - dateB;
        return sortOrder === 'asc' ? diff : -diff;
      });
    }

    // Apply pagination after filtering and sorting
    const total = filteredCampaigns.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

    const response: CampaignsResponse = {
      campaigns: paginatedCampaigns,
      total,
      page,
      pageSize,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error reading campaigns data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

