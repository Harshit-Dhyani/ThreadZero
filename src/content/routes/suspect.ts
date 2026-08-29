export const SUSPECT_ROUTES = [
  {
    "id": "official-tools",
    "group": "suspect",
    "composition": "hub",
    "label": {
      "en": "Suspect and abuse tools",
      "hi": "संदिग्ध और दुरुपयोग उपकरण"
    },
    "eyebrow": {
      "en": "Suspect and abuse tools",
      "hi": "संदिग्ध और दुरुपयोग उपकरण"
    },
    "title": {
      "en": "Check, document, and understand suspicious activity",
      "hi": "संदिग्ध गतिविधि जाँचें, दर्ज करें और समझें"
    },
    "intro": {
      "en": "These demo checks show the questions official services may ask without contacting them.",
      "hi": "ये स्थानीय उपकरण आधिकारिक सेवाओं से संपर्क किए बिना संभावित प्रश्नों का अभ्यास कराते हैं।"
    },
    "items": [
      {
        "title": {
          "en": "Check contact or account details",
          "hi": "पहचानकर्ता जाँचें"
        },
        "body": {
          "en": "Try a demo mobile, email, account, or social handle.",
          "hi": "डेमो मोबाइल, ईमेल, खाता या सोशल हैंडल जाँचें।"
        },
        "route": "check-identifier"
      },
      {
        "title": {
          "en": "Check a website or app",
          "hi": "वेबसाइट या ऐप जाँचें"
        },
        "body": {
          "en": "Review an example URL against a demo record.",
          "hi": "उदाहरण URL को डेमो रिकॉर्ड से जाँचें।"
        },
        "route": "check-website"
      },
      {
        "title": {
          "en": "Report a suspect",
          "hi": "संदिग्ध रिपोर्ट करें"
        },
        "body": {
          "en": "Prepare a local suspect-information draft.",
          "hi": "स्थानीय संदिग्ध-सूचना मसौदा तैयार करें।"
        },
        "route": "report-suspect"
      },
      {
        "title": {
          "en": "Social-platform abuse",
          "hi": "सोशल प्लेटफ़ॉर्म दुरुपयोग"
        },
        "body": {
          "en": "Find safe evidence steps and platform categories.",
          "hi": "सुरक्षित साक्ष्य चरण और प्लेटफ़ॉर्म श्रेणियाँ देखें।"
        },
        "route": "report-abuse"
      },
      {
        "title": {
          "en": "Mobile connections",
          "hi": "मोबाइल कनेक्शन"
        },
        "body": {
          "en": "Understand a TAFCOP-style check through demo data.",
          "hi": "डेमो डेटा से TAFCOP-जैसी जाँच समझें।"
        },
        "route": "mobile-connections"
      },
      {
        "title": {
          "en": "Appeal guidance",
          "hi": "अपील मार्गदर्शन"
        },
        "body": {
          "en": "Prepare an illustrative grievance appeal.",
          "hi": "एक उदाहरणात्मक शिकायत अपील तैयार करें।"
        },
        "route": "appeal"
      }
    ],
    "fields": [],
    "sources": [
      "officialSuspectSearch",
      "officialSuspectWebsite",
      "officialSuspectReport",
      "officialReportAbuse",
      "officialTafcop",
      "officialGac"
    ],
    "result": null
  },
  {
    "id": "check-identifier",
    "group": "suspect",
    "composition": "form",
    "label": {
      "en": "Contact and account check",
      "hi": "पहचानकर्ता जाँच"
    },
    "eyebrow": {
      "en": "Contact and account check",
      "hi": "पहचानकर्ता जाँच"
    },
    "title": {
      "en": "Check demo contact or account details",
      "hi": "डेमो पहचानकर्ता जाँचें"
    },
    "intro": {
      "en": "This demo check recognises demo@example.test only.",
      "hi": "यह डेमो जाँच केवल demo@example.test को पहचानती है।"
    },
    "items": [],
    "fields": [
      {
        "name": "identifierType",
        "type": "select",
        "label": {
          "en": "Detail type",
          "hi": "पहचानकर्ता प्रकार"
        },
        "required": true,
        "options": [
          {
            "en": "Email",
            "hi": "ईमेल"
          },
          {
            "en": "Mobile",
            "hi": "मोबाइल"
          },
          {
            "en": "Account",
            "hi": "खाता"
          },
          {
            "en": "Social handle",
            "hi": "सोशल हैंडल"
          }
        ]
      },
      {
        "name": "identifier",
        "type": "text",
        "label": {
          "en": "Demo contact or account detail",
          "hi": "डेमो पहचानकर्ता"
        },
        "required": true,
        "pattern": "^demo@example\\.test$",
        "example": "demo@example.test"
      }
    ],
    "sources": [
      "officialSuspectSearch"
    ],
    "result": {
      "en": "Illustrative match found in the local demo fixture",
      "hi": "स्थानीय डेमो फ़िक्स्चर में उदाहरणात्मक मिलान मिला"
    }
  },
  {
    "id": "check-website",
    "group": "suspect",
    "composition": "form",
    "label": {
      "en": "Website and app check",
      "hi": "वेबसाइट और ऐप जाँच"
    },
    "eyebrow": {
      "en": "Website and app check",
      "hi": "वेबसाइट और ऐप जाँच"
    },
    "title": {
      "en": "Check a website or app address",
      "hi": "वेबसाइट या ऐप पता जाँचें"
    },
    "intro": {
      "en": "Try an example address here, then use the official repository for a real check.",
      "hi": "यहाँ उदाहरण पता आज़माएँ, फिर वास्तविक जाँच के लिए आधिकारिक रिपॉज़िटरी उपयोग करें।"
    },
    "items": [],
    "fields": [
      {
        "name": "website",
        "type": "url",
        "label": {
          "en": "Website or app address",
          "hi": "वेबसाइट या ऐप पता"
        },
        "required": true,
        "pattern": "^https://example\\.test/?$",
        "example": "https://example.test"
      }
    ],
    "sources": [
      "officialSuspectWebsite"
    ],
    "result": {
      "en": "Illustrative caution record found",
      "hi": "उदाहरणात्मक सावधानी रिकॉर्ड मिला"
    }
  },
  {
    "id": "report-suspect",
    "group": "suspect",
    "composition": "form",
    "label": {
      "en": "Suspect report",
      "hi": "संदिग्ध रिपोर्ट"
    },
    "eyebrow": {
      "en": "Suspect report",
      "hi": "संदिग्ध रिपोर्ट"
    },
    "title": {
      "en": "Prepare suspect information",
      "hi": "संदिग्ध जानकारी तैयार करें"
    },
    "intro": {
      "en": "Record only demo contact or account details and observations.",
      "hi": "केवल डेमो संपर्क या खाता विवरण और अवलोकन दर्ज करें।"
    },
    "items": [],
    "fields": [
      {
        "name": "identifier",
        "type": "text",
        "label": {
          "en": "Demo contact or account detail",
          "hi": "डेमो संपर्क या खाता विवरण"
        },
        "required": true,
        "example": "demo@example.test"
      },
      {
        "name": "description",
        "type": "textarea",
        "label": {
          "en": "What made it suspicious?",
          "hi": "यह संदिग्ध क्यों लगा?"
        },
        "required": true,
        "minLength": 24
      }
    ],
    "sources": [
      "officialSuspectReport"
    ],
    "result": {
      "en": "Suspect-information draft prepared locally",
      "hi": "डेमो संदिग्ध-सूचना मसौदा तैयार"
    }
  },
  {
    "id": "report-abuse",
    "group": "suspect",
    "composition": "directory",
    "label": {
      "en": "Social-platform abuse",
      "hi": "सोशल-प्लेटफ़ॉर्म दुरुपयोग"
    },
    "eyebrow": {
      "en": "Social-platform abuse",
      "hi": "सोशल-प्लेटफ़ॉर्म दुरुपयोग"
    },
    "title": {
      "en": "Report abuse without losing evidence",
      "hi": "साक्ष्य खोए बिना दुरुपयोग रिपोर्ट करें"
    },
    "intro": {
      "en": "Preserve the profile URL, timestamps, message context, and screenshots before blocking or reporting.",
      "hi": "ब्लॉक या रिपोर्ट करने से पहले प्रोफ़ाइल URL, समय, संदेश संदर्भ और स्क्रीनशॉट सुरक्षित रखें।"
    },
    "items": [
      {
        "title": {
          "en": "Preserve",
          "hi": "सुरक्षित रखें"
        },
        "body": {
          "en": "Capture the full context, not only one message.",
          "hi": "केवल एक संदेश नहीं, पूरा संदर्भ रखें।"
        },
        "route": ""
      },
      {
        "title": {
          "en": "Use platform tools",
          "hi": "प्लेटफ़ॉर्म उपकरण"
        },
        "body": {
          "en": "Choose impersonation, threats, fraud, or harassment accurately.",
          "hi": "प्रतिरूपण, धमकी, धोखाधड़ी या उत्पीड़न सही चुनें।"
        },
        "route": ""
      },
      {
        "title": {
          "en": "Prepare a complaint",
          "hi": "शिकायत तैयार करें"
        },
        "body": {
          "en": "Use the local complaint hub when the incident needs a fuller record.",
          "hi": "घटना के विस्तृत रिकॉर्ड के लिए स्थानीय शिकायत हब उपयोग करें।"
        },
        "route": "complaints"
      }
    ],
    "fields": [],
    "sources": [
      "officialReportAbuse"
    ],
    "result": null
  },
  {
    "id": "mobile-connections",
    "group": "suspect",
    "composition": "form",
    "label": {
      "en": "Mobile connections",
      "hi": "मोबाइल कनेक्शन"
    },
    "eyebrow": {
      "en": "Mobile connections",
      "hi": "मोबाइल कनेक्शन"
    },
    "title": {
      "en": "Review demo mobile connections",
      "hi": "डेमो मोबाइल कनेक्शन देखें"
    },
    "intro": {
      "en": "This is a demo explanation, not TAFCOP and not a telecom lookup.",
      "hi": "यह डेमो व्याख्या है, TAFCOP या दूरसंचार खोज नहीं।"
    },
    "items": [],
    "fields": [
      {
        "name": "mobile",
        "type": "text",
        "label": {
          "en": "Demo mobile number",
          "hi": "डेमो मोबाइल नंबर"
        },
        "required": true,
        "pattern": "^9000000000$",
        "example": "9000000000"
      }
    ],
    "sources": [
      "officialTafcop"
    ],
    "result": {
      "en": "Two illustrative connections are shown in this demo",
      "hi": "इस डेमो में दो उदाहरणात्मक कनेक्शन दिखाए गए हैं"
    }
  },
  {
    "id": "appeal",
    "group": "suspect",
    "composition": "form",
    "label": {
      "en": "Appeal practice",
      "hi": "अपील अभ्यास"
    },
    "eyebrow": {
      "en": "Appeal practice",
      "hi": "अपील अभ्यास"
    },
    "title": {
      "en": "Prepare a demo appeal",
      "hi": "डेमो अपील तैयार करें"
    },
    "intro": {
      "en": "This does not file an appeal with GAC or any platform.",
      "hi": "यह GAC या किसी प्लेटफ़ॉर्म पर अपील दर्ज नहीं करता।"
    },
    "items": [],
    "fields": [
      {
        "name": "reference",
        "type": "text",
        "label": {
          "en": "Demo complaint reference",
          "hi": "डेमो शिकायत संदर्भ"
        },
        "required": true,
        "pattern": "^APPEAL-DEMO-001$",
        "example": "APPEAL-DEMO-001"
      },
      {
        "name": "reason",
        "type": "textarea",
        "label": {
          "en": "Why should it be reconsidered?",
          "hi": "पुनर्विचार क्यों होना चाहिए?"
        },
        "required": true,
        "minLength": 24
      }
    ],
    "sources": [
      "officialGac"
    ],
    "result": {
      "en": "Appeal draft prepared locally",
      "hi": "डेमो अपील मसौदा तैयार"
    }
  }
];


