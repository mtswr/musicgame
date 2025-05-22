import { getAccessToken } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return new Response('Query parameter is required', { status: 400 });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();

    const suggestions = data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name).join(', ')
    }));

    return Response.json(suggestions);
  } catch (error) {
    console.error('Error searching tracks:', error);
    return new Response(
      error instanceof Error ? error.message : 'Error searching tracks',
      { status: 500 }
    );
  }
} 