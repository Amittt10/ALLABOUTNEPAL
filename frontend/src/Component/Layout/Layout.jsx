// src/Component/Layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ScrollToTop from "../ScrollToTop";  // import your ScrollToTop component

const Layout = () => {
  return (
    <>
      <ScrollToTop />    {/* Add it here */}
      <Header />
      <main style={{ minHeight: "80vh", padding: "1rem" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
