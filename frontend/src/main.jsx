import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';
import './i18n';


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
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HeritageDetails from './pages/HeritageDetails';

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
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/heritage/:id" element={<HeritageDetails />} />

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
