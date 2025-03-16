import React, { useState, useEffect } from 'react';
import './mainMenu.css';
import { Link } from 'react-router-dom';

const MainMenu = () => {
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<string[]>([]);
  const [discoverOthers, setDiscoverOthers] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch user stats from an API or service
    // This is just a placeholder for demonstration purposes
    setRecommendedPlaylists(['Playlist 1', 'Playlist 2', 'Playlist 3', 'Playlist 4', 'Playlist 5', 'Playlist 6']);
    setDiscoverOthers(['User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6']);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className={`main-menu-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="header">
        <div className="header-left">
          <button className="sidebar-toggle-button" onClick={toggleSidebar}>☰</button>
          <div className="username">Good morning user!</div>
        </div>
        
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for songs, artists, or playlists" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </form>
        </div>
        
        <div className="profile">
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <button className="profile-button">Profile</button>
          </Link>
          <button className="settings-button">Settings</button>
        </div>
      </header>
      
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <button className="sidebar-button">Button 1</button>
          <button className="sidebar-button">Button 2</button>
          <button className="sidebar-button">Button 3</button>
          <button className="sidebar-button">Button 4</button>
        </div>
      </div>
      
      <section className="recommended-playlists">
        <h2>Recommended Playlists</h2>
        <div className="playlists-container">
          {recommendedPlaylists.map((playlist, index) => (
            <div key={index} className="playlist">
              <div className="playlist-thumbnail"></div>
              <div className="playlist-title">{playlist}</div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="discover-others">
        <h2>Discover Others</h2>
        <div className="users-container">
          {discoverOthers.map((user, index) => (
            <div key={index} className="user">
              <div className="user-avatar"></div>
              <div className="user-name">{user}</div>
            </div>
          ))}
        </div>
      </section>
      
      <footer className="footer">
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <button className="more-features-button">More Features</button>
        </Link>
        <button className="create-playlist-button">Create New Playlists</button>
      </footer>
    </div>
  );
};

export default MainMenu;