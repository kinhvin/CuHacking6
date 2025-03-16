// Spotify authentication service
export interface SpotifyAuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
  }
  
  class SpotifyAuthService {
    private clientId: string;
    private redirectUri: string;
    private scope: string;
    
    constructor() {
      this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      this.redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';
      this.scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-read-collaborative';
    }
    
    getAuthUrl(): string {
      const params = new URLSearchParams({
        client_id: this.clientId,
        response_type: 'code',
        redirect_uri: this.redirectUri,
        scope: this.scope,
        show_dialog: 'true'
      });
      
      return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }
    
    async getAccessToken(code: string): Promise<SpotifyAuthResponse> {
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      });
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.clientId}:${clientSecret}`)}`
        },
        body: params
      });
      
      if (!response.ok) {
        throw new Error('Failed to get access token');
      }
      
      return response.json();
    }
    
    saveTokens(data: SpotifyAuthResponse): void {
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + data.expires_in * 1000).toString());
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
    }
    
    getStoredToken(): string | null {
      const token = localStorage.getItem('spotify_access_token');
      const expiry = localStorage.getItem('spotify_token_expiry');
      
      if (token && expiry && parseInt(expiry) > Date.now()) {
        return token;
      }
      
      return null;
    }
    
    logout(): void {
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_token_expiry');
      localStorage.removeItem('spotify_refresh_token');
    }
  }
  
  export const spotifyAuthService = new SpotifyAuthService();