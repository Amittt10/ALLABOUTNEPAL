import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HeritageList from './components/HeritageList';
import HeritageForm from './components/HeritageForm';
// Add imports for FestivalList, FestivalForm, EventList, EventForm as needed

import { setAuthToken } from './api/axiosConfig';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAuthToken(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Routes>
          <Route path="/admin" element={<Dashboard onLogout={handleLogout} />}>
            <Route index element={<Navigate to="heritage" replace />} />
            <Route path="heritage" element={<HeritageList />} />
            <Route path="heritage/add" element={<HeritageForm />} />
            <Route path="heritage/edit/:id" element={<HeritageForm />} />
            {/* Add Festival and Event routes similarly */}
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
