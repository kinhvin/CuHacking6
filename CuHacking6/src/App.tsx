import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LaunchPage from './LaunchPage';
import SignUp from './signUp';
import MainMenu from './mainMenu';
import Profile from './profile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;