import { useState } from 'react';
import './profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
  // Mock data - in a real app, this would come from an API
  const userData = {
    username: 'musiclover123',
    displayName: 'Alex Johnson',
    followers: 248,
    following: 157,
    topArtists: ['Taylor Swift', 'The Weeknd', 'Kendrick Lamar', 'Dua Lipa', 'Arctic Monkeys'],
    topGenres: ['Pop', 'Hip-Hop', 'R&B', 'Indie Rock', 'Electronic'],
    recentlyPlayed: [
      { name: 'Blinding Lights', artist: 'The Weeknd' },
      { name: 'Anti-Hero', artist: 'Taylor Swift' },
      { name: 'As It Was', artist: 'Harry Styles' },
      { name: 'Bad Habit', artist: 'Steve Lacy' },
      { name: 'Unholy', artist: 'Sam Smith, Kim Petras' }
    ],
    playlists: [
      'Workout Mix 2023',
      'Chill Vibes',
      'Road Trip Classics',
      'Study Focus',
      'Party Anthems'
    ]
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <Link to="/dashboard" className="back-button">
          &larr; Back to Main Menu
        </Link>
      </header>

      <div className="user-profile">
        <div className="profile-avatar"></div>
        <div className="profile-info">
          <h1>{userData.displayName}</h1>
          <p className="username">@{userData.username}</p>
          <div className="follow-stats">
            <span>{userData.followers} Followers</span>
            <span className="dot-separator">•</span>
            <span>{userData.following} Following</span>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stats-card">
          <h2>Top Artists</h2>
          <ul>
            {userData.topArtists.map((artist, index) => (
              <li key={index}>{artist}</li>
            ))}
          </ul>
        </div>

        <div className="stats-card">
          <h2>Top Genres</h2>
          <ul>
            {userData.topGenres.map((genre, index) => (
              <li key={index}>{genre}</li>
            ))}
          </ul>
        </div>

        <div className="stats-card">
          <h2>Recently Played</h2>
          <ul>
            {userData.recentlyPlayed.map((track, index) => (
              <li key={index}>
                <span className="track-name">{track.name}</span>
                <span className="track-artist">{track.artist}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="stats-card">
          <h2>Playlists</h2>
          <ul>
            {userData.playlists.map((playlist, index) => (
              <li key={index}>{playlist}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;