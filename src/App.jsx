import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminView from './views/AdminView';
import IpadView from './views/IpadView';
import TvView from './views/TvView';
import Tv3dView from './views/Tv3dView';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/admin');
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/admin" element={<AdminView />} />
      <Route path="/ipad" element={<IpadView />} />
      <Route path="/tv" element={<TvView />} />
      <Route path="/tv-3d" element={<Tv3dView />} />
    </Routes>
  );
}

export default App;
