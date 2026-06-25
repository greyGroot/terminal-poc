import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminView from './views/AdminView';
import IpadView from './views/IpadView';
import TvView from './views/TvView';

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
    </Routes>
  );
}

export default App;
