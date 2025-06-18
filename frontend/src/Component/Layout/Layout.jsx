// src/Component/Layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh", padding: "1rem" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
