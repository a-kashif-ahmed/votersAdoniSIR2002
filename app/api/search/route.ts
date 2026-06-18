import { NextRequest, NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/searchIndex';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const name = (searchParams.get('name') || '').trim().toLowerCase();
  const house = (searchParams.get('house') || '').trim().toLowerCase();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  if (name === '' && house === '') {
    return NextResponse.json({
      results: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 0,
    });
  }

  const { voters } = getSearchIndex();

  const matches = voters.filter((voter) => {
    const voterName = (voter.name || '').toLowerCase();
    const epic = (voter.epic_no || '').toLowerCase();
    const voterHouse = (voter.house_no || '').toLowerCase();

    const nameMatch =
      name === '' ||
      voterName.includes(name) ||
      epic.includes(name);

    const houseMatch =
      house === '' ||
      voterHouse.includes(house);

    return nameMatch && houseMatch;
  });

  const start = (page - 1) * limit;
  const end = start + limit;

  return NextResponse.json({
    results: matches.slice(start, end),
    total: matches.length,
    page,
    limit,
    totalPages: Math.ceil(matches.length / limit),
  });
}