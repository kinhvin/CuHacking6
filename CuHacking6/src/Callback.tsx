import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { spotifyAuthService } from './services/spotifyAuth';

const Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setError('Authentication failed: ' + error);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (!code) {
      setError('No authentication code received');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const getToken = async () => {
      try {
        const data = await spotifyAuthService.getAccessToken(code);
        spotifyAuthService.saveTokens(data);
        navigate('/dashboard'); // Redirect to dashboard after successful login
      } catch (err) {
        console.error('Failed to get access token:', err);
        setError('Failed to authenticate with Spotify');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    getToken();
  }, [searchParams, navigate]);

  return (
    <div className="callback-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0A0A0A'
    }}>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <h2>Connecting to Spotify...</h2>
          <div className="loading-spinner"></div>
        </>
      )}
    </div>
  );
};

export default Callback;