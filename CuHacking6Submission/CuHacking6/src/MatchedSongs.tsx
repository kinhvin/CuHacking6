import React, { useEffect, useState } from 'react';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface MatchedSongsProps {
  matchingSongs: string[] | null;
  token: string; // Spotify API token
}

const MatchedSongs: React.FC<MatchedSongsProps> = ({ matchingSongs, token }) => {
  const [songsData, setSongsData] = useState<Track[]>([]);

  useEffect(() => {
    const fetchSongData = async () => {
      if (!matchingSongs || matchingSongs.length === 0) return;

      try {
        const songQueries = matchingSongs.map(song => encodeURIComponent(song)).join(',');
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${songQueries}&type=track&limit=${matchingSongs.length}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch song data');
        }

        const data = await response.json();
        setSongsData(data.tracks.items);
      } catch (err) {
        console.error('Error fetching song details:', err);
      }
    };

    fetchSongData();
  }, [matchingSongs, token]);

  return (
    <>
            {songsData.map((track) => (
        <li key={track.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            {track.album.images[0] && (
            <img
                src={track.album.images[0].url}
                alt={track.name}
                style={{ width: '50px', height: '50px', marginRight: '10px' }}
            />
            )}
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>
                <b>{track.name}</b> - {track.artists.map(artist => artist.name).join(', ')}
            </div>
            </a>
        </li>
        ))}
    </>
  );
};

export default MatchedSongs;