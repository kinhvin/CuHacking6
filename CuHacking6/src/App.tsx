import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LaunchPage from './LaunchPage';
import Callback from './Callback';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App
