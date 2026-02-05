import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LiveOps from './pages/LiveOps';
import Onboarding from './pages/Onboarding';
import Workflows from './pages/Workflows';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/live-ops" replace />} />
        <Route path="/live-ops" element={<LiveOps />} />
        <Route path="/onboard" element={<Onboarding />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/workflows" element={<Workflows />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
