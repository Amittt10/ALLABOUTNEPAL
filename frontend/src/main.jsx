// src/index.jsx (or src/main.jsx)
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import Home from './pages/Home/Home';
import CulturalHeritage from './pages/CulturalHeritage';
import Festivals from './pages/Festivals';
import Quiz from './pages/Quiz';
import Aboutus from './pages/Aboutus';

import Layout from './Component/Layout/Layout';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Routes>
      {/* Routes without layout (no header/footer) */}
      <Route path="/register" element={<UserSignup />} />
      <Route path="/login" element={<UserLogin />} />

      {/* Routes with layout (includes header + footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cultural-heritage" element={<CulturalHeritage />} />
        <Route path="/festivals" element={<Festivals />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<Aboutus />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
