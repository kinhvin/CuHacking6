// App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LaunchPage from './LaunchPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LaunchPage />
    </BrowserRouter>
  );
};

export default App;