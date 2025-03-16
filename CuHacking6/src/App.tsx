// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LaunchPage from './LaunchPage';
import Stats from './Stats';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;