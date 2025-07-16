import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FAQSection.css";

const FAQSection = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question_en: "What is the purpose of this website?",
      answer_en: "It showcases Nepal’s cultural heritage, festivals, and places.",
      question_np: "यो वेबसाइटको उद्देश्य के हो?",
      answer_np: "यो प्लेटफर्मले नेपालका सम्पदा, पर्वहरू र स्थानहरू देखाउँछ।",
    },
    {
      question_en: "Is the content in Nepali?",
      answer_en: "Yes, use the language switcher at the top.",
      question_np: "के सामग्री नेपालीमा छ?",
      answer_np: "हो, माथिको भाषा स्विचर प्रयोग गर्नुहोस्।",
    },
  ];

  return (
    <>
      <button className="faq-float-btn" onClick={() => setIsOpen(!isOpen)}>
        ❓ FAQ
      </button>

      {isOpen && (
        <div className="faq-popup-card">
  <div className="faq-header">
    {i18n.language === "np" ? "प्रश्नहरू" : "FAQ"}
    <button className="faq-close-btn" onClick={() => setIsOpen(false)}>×</button>
  </div>
  <div className="faq-content">
    {faqs.map((faq, index) => (
      <div key={index} className="faq-item">
        <div className="faq-question" onClick={() => toggleFAQ(index)}>
          {i18n.language === "np" ? faq.question_np : faq.question_en}
          <span className="faq-toggle">{openIndex === index ? "-" : "+"}</span>
        </div>
        {openIndex === index && (
          <div className="faq-answer">
            {i18n.language === "np" ? faq.answer_np : faq.answer_en}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

      )}
    </>
  );
};

export default FAQSection;
