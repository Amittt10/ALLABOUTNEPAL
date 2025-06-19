import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import HeritageList from './components/HeritageList';
import HeritageAdd from './components/HeritageAdd';
import HeritageEdit from './components/HeritageEdit';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/heritage"
          element={
            <PrivateRoute>
              <HeritageList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/heritage/add"
          element={
            <PrivateRoute>
              <HeritageAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/heritage/edit/:id"
          element={
            <PrivateRoute>
              <HeritageEdit />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
