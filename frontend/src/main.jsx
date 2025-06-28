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
import FestivalCalendar from './pages/FestivalCalendar';
import FestivalDetail from './pages/FestivalDetail';
import FestivalDetailBySlug from "./pages/FestivalDetailBySlug";
import FestivalDetailById from "./pages/FestivalDetailById";
import FestivalsHighlight from './pages/FestivalsHighlight';
import PlaceDetail from './pages/Places/PlaceDetail';



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
        <Route path="/festival-detail" element={<FestivalDetail />} />
        <Route path="/festival-detail/:id" element={<FestivalDetailById />} />
        <Route path="/festivals/:id" element={<FestivalDetailById />} />
        <Route path="/festival-calendar" element={<FestivalCalendar />} />
        <Route path="/festivals/:slug" element={<FestivalDetailBySlug />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/profile" element={<Profile />} />        
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/heritage/:id" element={<HeritageDetails />} />
        <Route path="/festivals-highlight" element={<FestivalsHighlight />} />

         {/* ✅ Search and detail routes */}
          <Route path="/search" element={<SearchResults />} />

        {/* ✅ Places routes */}
        <Route path="/places/:placeId" element={<PlaceDetail />} />


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
