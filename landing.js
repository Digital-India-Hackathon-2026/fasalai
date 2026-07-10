document.addEventListener("DOMContentLoaded", () => {
  const navLoginBtn = document.getElementById("navLoginBtn");
  const continueFarmerBtn = document.getElementById("continueFarmerBtn");
  const languageSelect = document.getElementById("languageSelect");

  const goToLogin = () => {
    window.location.href = "login.html";
  };

  const translations = {
    en: {
      navAbout: "About",
      navHow: "How It Works",
      navFAQ: "FAQ",
      navContact: "Contact Us",
      heroTitle: "Smart Farmer Portal",
      heroLead: "Empowering farmers with skill-based, collateral-free loan assessments.",
      heroSub: "By shifting focus from rigid credit histories to your real-world agricultural expertise, we unlock transparent financing for landowners and lease-takers alike.",
      aboutHeading: "About Smart Farmer Portal",
      howHeading: "How It Works",
      faqHeading: "Frequently Asked Questions",
      contactHeading: "Contact Us"
    },
    hi: {
      navAbout: "के बारे में",
      navHow: "यह कैसे काम करता है",
      navFAQ: "अक्सर पूछे जाने वाले प्रश्न",
      navContact: "संपर्क करें",
      heroTitle: "स्मार्ट किसान पोर्टल",
      heroLead: "किसानों को कौशल-आधारित, बिना गिरवी ऋण आकलन के साथ सशक्त बनाना।",
      heroSub: "कठोर क्रेडिट इतिहास से ध्यान हटाकर, हम आपके वास्तविक कृषि अनुभव के आधार पर पारदर्शी वित्तपोषण खोलते हैं।",
      aboutHeading: "स्मार्ट किसान पोर्टल के बारे में",
      howHeading: "यह कैसे काम करता है",
      faqHeading: "अक्सर पूछे जाने वाले प्रश्न",
      contactHeading: "संपर्क करें"
    },
    te: {
      navAbout: "గురించి",
      navHow: "ఇది ఎలా పనిచేస్తుంది",
      navFAQ: "ప్రశ్నలు",
      navContact: "మాకు సంప్రదించండి",
      heroTitle: "స్మార్ట్ ఫార్మర్ పోర్టల్",
      heroLead: "నైపుణ్యాలను ఆధారపడి, ఋణాన్ని నిరబద్ధంగా అంచనా వేయడం రైతులను సాధికారత చేస్తుంది.",
      heroSub: "కఠినమైన క్రెడిట్ చరిత్రలపై దృష్టిని మార్చి, మీ వాస్తవ వ్యవసాయ అనుభవంపై ఆధారంగా పారదర్శక ఆర్థిక సహాయాన్ని అందిస్తున్నాం.",
      aboutHeading: "స్మార్ట్ ఫార్మర్ పోర్టల్ గురించి",
      howHeading: "ఇది ఎలా పనిచేస్తుంది",
      faqHeading: "సాధారణ ప్రశ్నలు",
      contactHeading: "మాకు సంప్రదించండి"
    },
    es: {
      navAbout: "Acerca de",
      navHow: "Cómo Funciona",
      navFAQ: "Preguntas",
      navContact: "Contáctanos",
      heroTitle: "Portal del Agricultor Inteligente",
      heroLead: "Empoderando a los agricultores con evaluaciones de préstamos sin garantía basadas en habilidades.",
      heroSub: "Al cambiar el enfoque de los historiales de crédito rígidos a su experiencia agrícola real, desbloqueamos financiamiento transparente.",
      aboutHeading: "Acerca del Portal del Agricultor Inteligente",
      howHeading: "Cómo Funciona",
      faqHeading: "Preguntas Frecuentes",
      contactHeading: "Contáctanos"
    }
  };

  const applyLanguage = (lang) => {
    const selected = translations[lang] || translations.en;
    Object.keys(selected).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = selected[key];
      }
    });
  };

  const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
  if (languageSelect) {
    languageSelect.value = savedLanguage;
    languageSelect.addEventListener("change", (event) => {
      const nextLang = event.target.value;
      localStorage.setItem("selectedLanguage", nextLang);
      applyLanguage(nextLang);
    });
  }

  applyLanguage(savedLanguage);

  if (navLoginBtn) {
    navLoginBtn.addEventListener("click", goToLogin);
  }

  if (continueFarmerBtn) {
    continueFarmerBtn.addEventListener("click", goToLogin);
  }
});
