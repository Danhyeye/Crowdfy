import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

const FAVORITES_FILE = 'favorites.data.json';

export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'data', FAVORITES_FILE);
    const fileContents = await readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json({
      favorites: data.favorites || [],
      total: (data.favorites || []).length,
    });
  } catch (error) {
    return NextResponse.json({
      favorites: [],
      total: 0,
    });
  }
}

