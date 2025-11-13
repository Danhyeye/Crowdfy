import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const FAVORITES_FILE = 'favorites.data.json';

async function getFavorites(): Promise<string[]> {
  try {
    const filePath = join(process.cwd(), 'data', FAVORITES_FILE);
    const fileContents = await readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.favorites || [];
  } catch (error) {
    return [];
  }
}

async function saveFavorites(favorites: string[]): Promise<void> {
  const filePath = join(process.cwd(), 'data', FAVORITES_FILE);
  await writeFile(filePath, JSON.stringify({ favorites }, null, 2), 'utf8');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const favorites = await getFavorites();

    if (favorites.includes(campaignId)) {
      return NextResponse.json(
        { message: 'Campaign already in favorites', favorites },
        { status: 200 }
      );
    }

    favorites.push(campaignId);
    await saveFavorites(favorites);

    return NextResponse.json(
      { message: 'Campaign added to favorites', favorites },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const favorites = await getFavorites();
    const filteredFavorites = favorites.filter((id) => id !== campaignId);

    if (favorites.length === filteredFavorites.length) {
      return NextResponse.json(
        { message: 'Campaign not in favorites', favorites },
        { status: 200 }
      );
    }

    await saveFavorites(filteredFavorites);

    return NextResponse.json(
      { message: 'Campaign removed from favorites', favorites: filteredFavorites },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}

