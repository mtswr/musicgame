import { getAccessToken } from '@/lib/spotify';

const WILDCARD_CHARACTERS = ['a', 'e', 'i', 'o', 'u', 'r', 's', 't'];

interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string;
  artists: { name: string }[];
}

async function getSpotifyLinks(url: string): Promise<string[]> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const previewUrlRegex = /https:\/\/p\.scdn\.co\/[^"'\s]+/g;
    const matches = html.match(previewUrlRegex) || [];

    return [...new Set(matches)];
  } catch (error) {
    console.error(`Failed to fetch preview URLs: ${error}`);
    return [];
  }
}

function getDateId() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getSeededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 2147483647;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre');

  if (!genre) {
    return new Response('Genre is required', { status: 400 });
  }

  try {
    const accessToken = await getAccessToken();
    const dateId = getDateId();

    const charIndex = Math.floor(getSeededRandom(`${genre}-${dateId}-char`) * WILDCARD_CHARACTERS.length);
    const wildcardChar = WILDCARD_CHARACTERS[charIndex];

    const offset = Math.floor(getSeededRandom(`${genre}-${dateId}-offset`) * 950);

    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=%25${wildcardChar}%25%20genre:${genre}&type=track&market=US&limit=50&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    let tracksWithPreview: SpotifyTrack[] = [];

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();

      if (searchData.tracks && searchData.tracks.items && searchData.tracks.items.length > 0) {
        const tracks = searchData.tracks.items;
        const batchSize = 5;

        for (let i = 0; i < tracks.length; i += batchSize) {
          const batch = tracks.slice(i, i + batchSize);
          const batchPromises = batch.map(async (track: any) => {
            try {
              const spotifyUrl = track.external_urls.spotify;

              const previewUrls = await getSpotifyLinks(spotifyUrl);

              if (previewUrls.length > 0) {
                return {
                  id: track.id,
                  name: track.name,
                  preview_url: previewUrls[0],
                  artists: track.artists.map((artist: any) => ({ name: artist.name })),
                };
              }
              return null;
            } catch (error) {
              console.error(`Error processing track ${track.id}:`, error);
              return null;
            }
          });

          const batchResults = await Promise.all(batchPromises);
          const validResults = batchResults.filter((result): result is SpotifyTrack => result !== null);

          tracksWithPreview = [...tracksWithPreview, ...validResults];

          if (tracksWithPreview.length >= 10) {
            break;
          }
        }

      } else {
      }
    } else {
    }

    if (tracksWithPreview.length === 0) {
      const broadOffset = Math.floor(getSeededRandom(`${genre}-${dateId}-broad`) * 950);

      const broadSearchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=%25${wildcardChar}%25&type=track&market=US&limit=50&offset=${broadOffset}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (broadSearchResponse.ok) {
        const broadSearchData = await broadSearchResponse.json();

        if (broadSearchData.tracks && broadSearchData.tracks.items) {
          const tracks = broadSearchData.tracks.items;
          const batchSize = 5;

          for (let i = 0; i < tracks.length; i += batchSize) {
            const batch = tracks.slice(i, i + batchSize);
            const batchPromises = batch.map(async (track: any) => {
              try {
                const trackName = track.name.toLowerCase();
                const albumName = track.album?.name.toLowerCase() || '';
                const artistNames = track.artists.map((a: any) => a.name.toLowerCase()).join(' ');

                const isGenreRelated = trackName.includes(genre) ||
                  albumName.includes(genre) ||
                  artistNames.includes(genre) ||
                  trackName.includes('rock') || artistNames.includes('metal');

                if (isGenreRelated) {
                  const spotifyUrl = track.external_urls.spotify;

                  const previewUrls = await getSpotifyLinks(spotifyUrl);

                  if (previewUrls.length > 0) {
                    return {
                      id: track.id,
                      name: track.name,
                      preview_url: previewUrls[0],
                      artists: track.artists.map((artist: any) => ({ name: artist.name })),
                    };
                  }
                }
                return null;
              } catch (error) {
                console.error(`Error processing track ${track.id}:`, error);
                return null;
              }
            });

            const batchResults = await Promise.all(batchPromises);
            const validResults = batchResults.filter((result): result is SpotifyTrack => result !== null);

            tracksWithPreview = [...tracksWithPreview, ...validResults];

            if (tracksWithPreview.length >= 10) {
              break;
            }
          }

          if (tracksWithPreview.length === 0) {
            for (let i = 0; i < tracks.length; i += batchSize) {
              const batch = tracks.slice(i, i + batchSize);
              const batchPromises = batch.map(async (track: any) => {
                try {
                  const spotifyUrl = track.external_urls.spotify;

                  const previewUrls = await getSpotifyLinks(spotifyUrl);

                  if (previewUrls.length > 0) {
                    return {
                      id: track.id,
                      name: track.name,
                      preview_url: previewUrls[0],
                      artists: track.artists.map((artist: any) => ({ name: artist.name })),
                    };
                  }
                  return null;
                } catch (error) {
                  console.error(`Error processing track ${track.id}:`, error);
                  return null;
                }
              });

              const batchResults = await Promise.all(batchPromises);
              const validResults = batchResults.filter((result): result is SpotifyTrack => result !== null);

              tracksWithPreview = [...tracksWithPreview, ...validResults];

              if (tracksWithPreview.length >= 10) {
                break;
              }
            }
          }
        }
      }
    }

    if (tracksWithPreview.length === 0) {
      for (const char of 'aeioustnr') {
        const seqOffset = Math.floor(getSeededRandom(`${genre}-${dateId}-${char}`) * 950);

        try {
          const seqSearchResponse = await fetch(
            `https://api.spotify.com/v1/search?q=%25${char}%25&type=track&market=US&limit=50&offset=${seqOffset}`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );

          if (seqSearchResponse.ok) {
            const seqSearchData = await seqSearchResponse.json();

            if (seqSearchData.tracks && seqSearchData.tracks.items) {
              const tracks = seqSearchData.tracks.items;
              const batchSize = 5;

              for (let i = 0; i < tracks.length; i += batchSize) {
                const batch = tracks.slice(i, i + batchSize);
                const batchPromises = batch.map(async (track: any) => {
                  try {
                    const spotifyUrl = track.external_urls.spotify;

                    const previewUrls = await getSpotifyLinks(spotifyUrl);

                    if (previewUrls.length > 0) {
                      return {
                        id: track.id,
                        name: track.name,
                        preview_url: previewUrls[0],
                        artists: track.artists.map((artist: any) => ({ name: artist.name })),
                      };
                    }
                    return null;
                  } catch (error) {
                    console.error(`Error processing track ${track.id}:`, error);
                    return null;
                  }
                });

                const batchResults = await Promise.all(batchPromises);
                const validResults = batchResults.filter((result): result is SpotifyTrack => result !== null);

                tracksWithPreview = [...tracksWithPreview, ...validResults];
                if (tracksWithPreview.length >= 10) {
                  break;
                }
              }

              if (tracksWithPreview.length > 0) {
                break;
              }
            }
          }
        } catch (error) {
          console.error(`Error with sequential search for "${char}":`, error);
        }
      }
    }

    if (tracksWithPreview.length === 0) {
      return Response.json({
        tracks: [],
        message: "Não foi possível encontrar músicas com previews disponíveis. Tente novamente mais tarde ou escolha outro gênero."
      });
    }

    const selectedTracks = selectDailyTracks(tracksWithPreview, `${genre}-${dateId}`);

    return Response.json({ tracks: selectedTracks });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      error instanceof Error ? error.message : 'Error fetching tracks',
      { status: 500 }
    );
  }
}

function selectDailyTracks(tracks: any[], seed: string) {
  const sortedTracks = [...tracks].sort((a, b) => {
    const seedA = getSeededRandom(`${seed}-${a.id}`);
    const seedB = getSeededRandom(`${seed}-${b.id}`);
    return seedA - seedB;
  });

  return sortedTracks.slice(0, Math.min(3, sortedTracks.length)).map((track, index) => ({
    id: track.id,
    gameId: `${seed}-${index}-${track.id}`,
    preview_url: track.preview_url,
  }));
} 