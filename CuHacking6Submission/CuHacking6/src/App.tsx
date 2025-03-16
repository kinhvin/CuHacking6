import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LaunchPage from './LaunchPage';
import SignUp from './signUp';
import Dashboard from './dashboard';
import Profile from './profile';
import Messages from './messages';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;