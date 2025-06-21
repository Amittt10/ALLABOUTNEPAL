// src/pages/Aboutus.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Aboutus.css';

const Aboutus = () => {
  const { t } = useTranslation(); // ✅ Get the t() translator function

  return (
    <div className="aboutus-container">
      <h1>{t('aboutUs.title')}</h1>
      <p>{t('aboutUs.description')}</p>
    </div>
  );
};

export default Aboutus;
