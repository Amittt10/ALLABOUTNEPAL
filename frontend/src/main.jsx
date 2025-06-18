import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext'; // named import

import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import Home from './pages/Home/Home';
import CulturalHeritage from './pages/CulturalHeritage';
import Quiz from './pages/Quiz';
import Aboutus from './pages/Aboutus';
import Festivals from './pages/Festivals';
import Profile from './pages/Profile';

import Layout from './Component/Layout/Layout';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cultural-heritage" element={<CulturalHeritage />} />
          <Route path="/festivals" element={<Festivals />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
