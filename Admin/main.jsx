import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './src/components/Login';
import Dashboard from './src/components/Dashboard';
import HeritageList from './HeritageList';
import HeritageForm from './HeritageForm';

// You can add FestivalList, FestivalForm, EventList, EventForm similarly

import { setAuthToken } from './src/api/axiosConfig'; // Make sure this file exists

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

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Dashboard onLogout={handleLogout} />}>
          <Route index element={<Navigate to="heritage" />} />
          <Route path="heritage" element={<HeritageList />} />
          <Route path="heritage/add" element={<HeritageForm />} />
          <Route path="heritage/edit/:id" element={<HeritageForm />} />
          {/* Add festival and event routes here similarly */}
        </Route>

        {/* Redirect any unknown route to /admin */}
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
};

export default App;
