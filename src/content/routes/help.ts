export const HELP_ROUTES = [
  {
    "id": "faq",
    "group": "help",
    "composition": "guidance",
    "label": {
      "en": "FAQ",
      "hi": "सामान्य प्रश्न"
    },
    "eyebrow": {
      "en": "FAQ",
      "hi": "सामान्य प्रश्न"
    },
    "title": {
      "en": "Questions citizens ask before reporting",
      "hi": "रिपोर्ट से पहले नागरिकों के प्रश्न"
    },
    "intro": {
      "en": "Clear answers about evidence, demo data, and official next steps.",
      "hi": "साक्ष्य, डेमो डेटा और आधिकारिक अगले कदमों के स्पष्ट उत्तर।"
    },
    "items": [
      {
        "title": {
          "en": "Does this submit a complaint?",
          "hi": "क्या यह शिकायत जमा करता है?"
        },
        "body": {
          "en": "No. It prepares demo information in this browser and never contacts NCRP.",
          "hi": "नहीं। यह इस ब्राउज़र में डेमो जानकारी तैयार करता है और NCRP से संपर्क नहीं करता।"
        },
        "route": ""
      },
      {
        "title": {
          "en": "Can I continue without every file?",
          "hi": "क्या हर फ़ाइल के बिना आगे बढ़ सकते हैं?"
        },
        "body": {
          "en": "Yes. Mark missing evidence and preserve what is available.",
          "hi": "हाँ। गायब साक्ष्य चिन्हित करें और उपलब्ध सामग्री सुरक्षित रखें।"
        },
        "route": ""
      },
      {
        "title": {
          "en": "What should I do after financial fraud?",
          "hi": "वित्तीय धोखाधड़ी के बाद क्या करें?"
        },
        "body": {
          "en": "Call 1930 manually and use cybercrime.gov.in as soon as possible.",
          "hi": "जितनी जल्दी हो 1930 पर स्वयं कॉल करें और cybercrime.gov.in उपयोग करें।"
        },
        "route": ""
      }
    ],
    "fields": [],
    "sources": [
      "officialFaq"
    ],
    "result": null
  },
  {
    "id": "contact",
    "group": "help",
    "composition": "directory",
    "label": {
      "en": "Contact",
      "hi": "संपर्क"
    },
    "eyebrow": {
      "en": "Contact",
      "hi": "संपर्क"
    },
    "title": {
      "en": "Find the right kind of help",
      "hi": "सही प्रकार की मदद खोजें"
    },
    "intro": {
      "en": "Choose urgent financial-fraud action, official portal feedback, State/UT grievance contacts, or feedback about this concept.",
      "hi": "तत्काल वित्तीय धोखाधड़ी कार्रवाई, आधिकारिक पोर्टल प्रतिक्रिया, राज्य/केंद्रशासित प्रदेश शिकायत संपर्क या इस अवधारणा की प्रतिक्रिया चुनें।"
    },
    "items": [
      {
        "title": {
          "en": "Financial fraud",
          "hi": "वित्तीय धोखाधड़ी"
        },
        "body": {
          "en": "Call 1930 manually and prepare the transaction evidence.",
          "hi": "1930 पर स्वयं कॉल करें और लेन-देन साक्ष्य तैयार करें।"
        },
        "route": "incident"
      },
      {
        "title": {
          "en": "Concept feedback",
          "hi": "अवधारणा प्रतिक्रिया"
        },
        "body": {
          "en": "Practice giving local feedback; nothing is sent to NCRP.",
          "hi": "स्थानीय प्रतिक्रिया देने का अभ्यास करें; NCRP को कुछ नहीं भेजा जाता।"
        },
        "route": "feedback"
      },
      {
        "title": {
          "en": "Grievance guidance",
          "hi": "शिकायत मार्गदर्शन"
        },
        "body": {
          "en": "Understand escalation and public notices.",
          "hi": "एस्केलेशन और सार्वजनिक सूचना समझें।"
        },
        "route": "grievance"
      }
    ],
    "fields": [],
    "sources": [
      "officialContacts",
      "officialFeedback"
    ],
    "result": null
  },
  {
    "id": "feedback",
    "group": "help",
    "composition": "form",
    "label": {
      "en": "Feedback",
      "hi": "प्रतिक्रिया"
    },
    "eyebrow": {
      "en": "Feedback",
      "hi": "प्रतिक्रिया"
    },
    "title": {
      "en": "Share feedback about this concept",
      "hi": "इस कॉन्सेप्ट पर प्रतिक्रिया दें"
    },
    "intro": {
      "en": "This local concept form sends nothing. For official NCRP login, registration, or portal suggestions, use the cited official feedback page.",
      "hi": "यह स्थानीय अवधारणा फ़ॉर्म कुछ नहीं भेजता। आधिकारिक NCRP लॉगिन, पंजीकरण या पोर्टल सुझाव के लिए दिए गए आधिकारिक प्रतिक्रिया पेज का उपयोग करें।"
    },
    "items": [],
    "fields": [
      {
        "name": "topic",
        "type": "select",
        "label": {
          "en": "Topic",
          "hi": "विषय"
        },
        "required": true,
        "options": [
          {
            "en": "Navigation",
            "hi": "नेविगेशन"
          },
          {
            "en": "Reporting flow",
            "hi": "रिपोर्टिंग प्रवाह"
          },
          {
            "en": "Learning content",
            "hi": "सीखने की सामग्री"
          },
          {
            "en": "Accessibility",
            "hi": "सुगम्यता"
          }
        ]
      },
      {
        "name": "rating",
        "type": "select",
        "label": {
          "en": "Rating",
          "hi": "रेटिंग"
        },
        "required": true,
        "options": [
          {
            "en": "Needs work",
            "hi": "सुधार चाहिए"
          },
          {
            "en": "Useful",
            "hi": "उपयोगी"
          },
          {
            "en": "Very clear",
            "hi": "बहुत स्पष्ट"
          }
        ]
      },
      {
        "name": "message",
        "type": "textarea",
        "label": {
          "en": "Feedback",
          "hi": "प्रतिक्रिया"
        },
        "required": true,
        "minLength": 12
      }
    ],
    "sources": [
      "officialFeedback"
    ],
    "result": {
      "en": "Feedback recorded for this session",
      "hi": "इस सत्र के लिए प्रतिक्रिया दर्ज"
    }
  },
  {
    "id": "grievance",
    "group": "help",
    "composition": "legal",
    "label": {
      "en": "Grievance guidance",
      "hi": "शिकायत मार्गदर्शन"
    },
    "eyebrow": {
      "en": "Grievance guidance",
      "hi": "शिकायत मार्गदर्शन"
    },
    "title": {
      "en": "Understand grievance and escalation routes",
      "hi": "शिकायत और एस्केलेशन मार्ग समझें"
    },
    "intro": {
      "en": "Different issues belong to different systems. Read the notice and verify the destination before sharing information.",
      "hi": "अलग मुद्दे अलग प्रणालियों से संबंधित हैं। जानकारी साझा करने से पहले सूचना और गंतव्य सत्यापित करें।"
    },
    "items": [
      {
        "title": {
          "en": "Portal complaint",
          "hi": "पोर्टल शिकायत"
        },
        "body": {
          "en": "Use the current NCRP nodal or grievance contact listed by the official portal.",
          "hi": "आधिकारिक पोर्टल पर वर्तमान NCRP नोडल या शिकायत संपर्क देखें।"
        },
        "route": ""
      },
      {
        "title": {
          "en": "Government grievance",
          "hi": "सरकारी शिकायत"
        },
        "body": {
          "en": "CPGRAMS scope may differ from cybercrime reporting.",
          "hi": "CPGRAMS का दायरा साइबर अपराध रिपोर्टिंग से अलग हो सकता है।"
        },
        "route": ""
      },
      {
        "title": {
          "en": "Keep a record",
          "hi": "रिकॉर्ड रखें"
        },
        "body": {
          "en": "Save acknowledgement, date, destination, and response.",
          "hi": "पावती, तारीख, गंतव्य और उत्तर सुरक्षित रखें।"
        },
        "route": ""
      }
    ],
    "fields": [],
    "sources": [
      "officialContacts",
      "officialCpgramsNotice"
    ],
    "result": null
  }
];


