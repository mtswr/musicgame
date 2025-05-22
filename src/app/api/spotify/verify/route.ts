import { getAccessToken } from '@/lib/spotify';

export async function POST(request: Request) {
  try {
    const { gameId, guess } = await request.json();

    if (!gameId || !guess) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const parts = gameId.split('-');
    const spotifyId = parts[parts.length - 1];

    if (!spotifyId) {
      return new Response(JSON.stringify({ error: 'Invalid gameId format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${spotifyId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch track details: ${response.statusText} - ${errorText}`);
    }

    const track = await response.json();

    const normalizeString = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
    };

    const normalizedTrackName = normalizeString(track.name);
    const normalizedGuess = normalizeString(guess);

    const isCorrect = normalizedTrackName === normalizedGuess;

    let isVariation = false;
    if (!isCorrect) {
      const variations = [
        normalizedTrackName.replace(/feat\.?|ft\.?|with|&/g, ''),
        normalizedTrackName.replace(/\(.*?\)/g, ''),
        normalizedTrackName.replace(/\[.*?\]/g, ''),
        normalizedTrackName.replace(/\s+/g, ''),
      ];

      isVariation = variations.some(v => v === normalizedGuess);
    }

    return new Response(JSON.stringify({
      correct: isCorrect || isVariation,
      correctName: (isCorrect || isVariation) ? null : track.name,
      artists: (isCorrect || isVariation) ? null : track.artists.map((artist: any) => artist.name),
      albumCover: track.album?.images?.[0]?.url || null,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Error verifying answer'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 