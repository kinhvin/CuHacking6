import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuthService } from './services/spotifyAuth';

interface UserProfile {
  display_name: string;
  email: string;
  images: Array<{url: string}>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = spotifyAuthService.getStoredToken();
    
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        spotifyAuthService.logout();
        navigate('/');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    spotifyAuthService.logout();
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome to Spotimates, {profile?.display_name}</h1>
        <button onClick={handleLogout}>Log out</button>
      </header>
      <main>
        {profile?.images?.[0]?.url && (
          <img 
            src={profile.images[0].url} 
            alt="Profile" 
            className="profile-image" 
          />
        )}
        <p>Email: {profile?.email}</p>
        
        {/* Display music recommendations and other features here */}
      </main>
    </div>
  );
};

export default Dashboard;