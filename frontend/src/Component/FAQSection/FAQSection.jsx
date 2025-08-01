import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FAQSection.css";
//comment
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
    answer_en: "This platform showcases Nepal’s cultural heritage, festivals, and travel-worthy places.",
    question_np: "यो वेबसाइटको उद्देश्य के हो?",
    answer_np: "यो प्लेटफर्मले नेपालका सम्पदा, पर्वहरू र भ्रमणयोग्य स्थानहरू देखाउँछ।"
  },
  {
    question_en: "How can I explore places and festivals?",
    answer_en: "You can use the homepage sections, map, or top navigation to explore by category or region.",
    question_np: "म स्थानहरू र पर्वहरू कसरी हेर्न सक्छु?",
    answer_np: "तपाईं होमपेज, नक्सा वा मेनुबाट प्रदेश वा श्रेणी अनुसार हेर्न सक्नुहुन्छ।"
  },
  {
    question_en: "Is this website available in Nepali?",
    answer_en: "Yes, you can switch between English and Nepali using the language toggle at the top.",
    question_np: "के यो वेबसाइट नेपालीमा उपलब्ध छ?",
    answer_np: "हो, तपाईं माथिको भाषा स्विचरबाट अंग्रेजी र नेपालीमा परिवर्तन गर्न सक्नुहुन्छ।"
  },
  {
    question_en: "Where is the information sourced from?",
    answer_en: "Information is collected from verified sources, government data, and local contributors.",
    question_np: "जानकारी कहाँबाट लिइएको हो?",
    answer_np: "जानकारी प्रमाणित स्रोत, सरकारी डाटा, र स्थानीय योगदानकर्ताबाट सङ्कलन गरिएको हो।"
  },
  {
    question_en: "Can I suggest corrections or contribute information?",
    answer_en: "Yes! You can contact us through the form to suggest updates or add missing content.",
    question_np: "के म जानकारीमा सुधार वा नयाँ जानकारी दिन सक्छु?",
    answer_np: "हो! तपाईं सम्पर्क फारम प्रयोग गरेर जानकारी अद्यावधिक वा थप्न सक्नुहुन्छ।"
  },
  {
    question_en: "Do you provide tourism services or bookings?",
    answer_en: "Currently, we do not offer bookings. This site is for informational and educational purposes only.",
    question_np: "के तपाईंहरूले पर्यटकीय सेवा वा बुकिङ प्रदान गर्नुहुन्छ?",
    answer_np: "हाल यो वेबसाइट केवल जानकारी तथा शैक्षिक उद्देश्यका लागि हो, बुकिङ सेवा छैन।"
  },
  {
    question_en: "How often is the content updated?",
    answer_en: "We update content regularly based on events, discoveries, and user feedback.",
    question_np: "सामग्री कहिले अद्यावधिक हुन्छ?",
    answer_np: "घटना, नयाँ जानकारी वा प्रयोगकर्ता प्रतिक्रिया अनुसार सामग्री नियमित रूपमा अद्यावधिक गरिन्छ।"
  },
  {
    question_en: "Can I use the content for my project or research?",
    answer_en: "Yes, but proper credit and citation to the source is required.",
    question_np: "के म यो सामग्री परियोजना वा अनुसन्धानमा प्रयोग गर्न सक्छु?",
    answer_np: "हो, तर स्रोतलाई क्रेडिट दिनु आवश्यक हुन्छ।"
  },
  {
    question_en: "Do you cover all festivals of Nepal?",
    answer_en: "We are working to include as many festivals as possible. You can suggest if one is missing.",
    question_np: "के यो वेबसाइटमा सबै नेपाली पर्व समावेश छन्?",
    answer_np: "हामी धेरै पर्वहरू समेट्ने प्रयास गर्दैछौं। तपाईंले नभएको पर्व सुझाव दिन सक्नुहुन्छ।"
  },
  {
    question_en: "Can I share this website with others?",
    answer_en: "Absolutely! Please share it with anyone interested in Nepal's heritage and culture.",
    question_np: "के म यो वेबसाइट अरूलाई सेयर गर्न सक्छु?",
    answer_np: "अवश्य! यो वेबसाइट नेपाली संस्कृति रुचाउने सबैलाई सेयर गर्नुहोस्।"
  }
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
