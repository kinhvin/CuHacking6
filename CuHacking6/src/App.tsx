// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LaunchPage from './LaunchPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;