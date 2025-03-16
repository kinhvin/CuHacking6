import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { spotifyAuthService } from './services/spotifyAuth';
import MatchedSongs from './MatchedSongs';


  interface UserProfile {
    display_name: string;
    email: string;
    id: string;
    images: Array<{url: string}>;
  }
  interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    external_urls: { spotify: string };
  }

  interface TopTracksResponse {
    items: Track[];
  }

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);
  const [discoverOthers, setDiscoverOthers] = useState([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSaved, setDataSaved] = useState<boolean>(false);
  const [matchingSongs, setMatchingSongs] = useState<string[] | null>(null);
  const [top5Genres, setTop5Genres] = useState<string[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem('sidebarState') === 'closed' ? false : true
  );
  const [matchingUser, setMatchingUser] = useState<string | null>("");


  useEffect(() => {
    
    // Fetch user stats here
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Save sidebar state to localStorage
    localStorage.setItem('sidebarState', isSidebarOpen ? 'open' : 'closed');
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getTop5Genres = async() => {
    if (!profile || topTracks.length === 0) {
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/api/getTop5Genres", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({"username": profile.display_name})
      });
      const data = await response.json();
      if(data["choices"] && data["choices"].length > 0 && data["choices"][0]["message"] && data["choices"][0]["message"]["content"]){
        setTop5Genres(data["choices"][0]["message"]["content"].split(", "))
      } else {
        setTop5Genres([])
      }
  } catch (err) {
      console.error('Error:', err);
      setError('Failed to save data to server');
  }
  }
  const matchUser = async () => {
    if (!profile || topTracks.length === 0) {
      return;
    }
    const response = await fetch("http://127.0.0.1:5000/api/matchUser", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"username": profile.display_name})
    });
    const data = await response.json();
    if(data["choices"] && data["choices"].length > 0 && data["choices"][0]["message"] && data["choices"][0]["message"]["content"]){
      setMatchingUser(data["choices"][0]["message"]["content"])
    } else {
      setMatchingUser("")
    }

  }

  const matchSongs = async () => {
    if (!profile || topTracks.length === 0) {
      return;
    }
    const response = await fetch("http://127.0.0.1:5000/api/matchSongs", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"username": profile.display_name})
    });
    const data = await response.json();
    if(data["choices"] && data["choices"].length > 0 && data["choices"][0]["message"] && data["choices"][0]["message"]["content"]){
      setMatchingSongs(data["choices"][0]["message"]["content"].split(", "))
    } else {
      setMatchingSongs([])
    }
  }

  const save_to_db = async () => {
    if (!profile || topTracks.length === 0 || dataSaved) {
        return;
    }
    let songNames = []
    for(let i = 0; i < topTracks.length; i++){
        songNames.push({"name": topTracks[i].name, "artist": topTracks[i].artists[0].name})
    }
    try {
        const response = await fetch("http://127.0.0.1:5000/api/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": profile.display_name, "top_songs": songNames})
        });
        
        if (!response.ok) {
            throw new Error(`Failed to save user data: ${response.status}`);
        }
        setDataSaved(true);
        console.log("User saved");

    } catch (err) {
        console.error('Error:', err);
        setError('Failed to save data to server');
    }
};

  useEffect(() => {
    const token = spotifyAuthService.getStoredToken();

    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserProfileAndTopTracks = async () => {
      try {
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData: UserProfile = await profileResponse.json();
        setProfile(profileData);

        const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!topTracksResponse.ok) {
          throw new Error('Failed to fetch top tracks');
        }

        const topTracksData: TopTracksResponse = await topTracksResponse.json();
        setTopTracks(topTracksData.items);
        // Save user data to MongoDB
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load data from Spotify');
        spotifyAuthService.logout();
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndTopTracks();
  }, [navigate]);

  useEffect(() => {
    save_to_db();
    getTop5Genres();
  },[profile, topTracks])

  const handleLogout = () => {
    spotifyAuthService.logout();
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-toggle-container">
          <button className="sidebar-toggle-button" onClick={toggleSidebar} aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.5 13a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 1 0v11a.5.5 0 0 1-.5.5z"/>
                <path d="M5.354 8.354a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8 5.707 5.354 8.354z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9a.5.5 0 0 1 .5-.5z"/>
                <path d="M10.646 7.646a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 10.293l2.646-2.647z"/>
              </svg>
            )}
          </button>
        </div>
        <div className="sidebar-content">
          
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Social</h3>
            <Link to="/connect" className={`sidebar-button ${location.pathname === '/connect' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
              </svg>
              <span>Connect with Others</span>
            </Link>
            
            <Link to="/concert-connect" className={`sidebar-button ${location.pathname === '/concert-connect' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
              </svg>
              <span>Concert Connect</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Communication</h3>
            <Link to="/messages" className={`sidebar-button ${location.pathname === '/messages' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
              </svg>
              <span>Messages</span>
            </Link>

            <Link to="/notifications" className={`sidebar-button ${location.pathname === '/notifications' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
              </svg>
              <span>Notifications</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Account</h3>

            <Link to="/profile" className={`sidebar-button ${location.pathname === '/profile' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
              <span>Profile</span>
            </Link> 

            <Link to="/settings" className={`sidebar-button ${location.pathname === '/settings' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              <span>Settings</span>
            </Link>
          </div>
        </div>
        <div className="logout-container">
          <Link to="/" className="sidebar-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
            </svg>
            <button onClick={handleLogout}>Logout</button>
          </Link>
        </div>
      </div>
      
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <div className="welcome-message">Welcome, {profile?.display_name}!</div>
          </div>
            
          <div className="user-actions">
            <button className="user-button">
            </button>
          </div>
        </header>
        
        {/* Rest of the content */}
        <div className='main-content-display'>
          <div>
            <h2>Your Top 20 Songs</h2>
            {topTracks.length > 0 ? (
              <ul>
                {topTracks.map((track) => (
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
              </ul>
            ) : (
              <p>No top tracks found.</p>
            )}
          </div>
          <div>
            <h2>Your top 5 genres</h2>
            {top5Genres ?  top5Genres.map((genre, index) => (
                <p key={index}>{genre}</p>
            )):<h4>Loading!</h4>}
          </div>
          <div>
            <button onClick={matchSongs}>Find 5 matching songs</button>
            <h2>We found 5 songs that you might like!</h2>
            {matchingSongs && (
            <div>
              {matchingSongs && <MatchedSongs matchingSongs={matchingSongs} token={spotifyAuthService.getStoredToken()} />}
            </div>
            )}
          </div>
          <div>
            <button onClick={matchUser}>Find your match</button>
            <p>{matchingUser}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

