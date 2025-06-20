import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import Home from './pages/Home/Home';
import CulturalHeritage from './pages/CulturalHeritage';
import Quiz from './pages/Quiz';
import Aboutus from './pages/Aboutus';
import Festivals from './pages/Festivals';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';

import Layout from './Component/Layout/Layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
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
        <Route path="/search" element={<SearchResults />} />
      </Route>
    </>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
);

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
