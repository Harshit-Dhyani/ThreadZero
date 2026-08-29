export const COMPLAINTS_ROUTES = [
  {
    "id": "complaints",
    "group": "complaints",
    "composition": "hub",
    "label": {
      "en": "Complaint services",
      "hi": "शिकायत सेवाएँ"
    },
    "eyebrow": {
      "en": "Complaint services",
      "hi": "शिकायत सेवाएँ"
    },
    "title": {
      "en": "Choose the right complaint path",
      "hi": "सही शिकायत मार्ग चुनें"
    },
    "intro": {
      "en": "Start locally with clear preparation. Nothing here reaches a government system.",
      "hi": "स्पष्ट तैयारी के साथ स्थानीय रूप से शुरू करें। यहाँ से कोई जानकारी सरकारी प्रणाली तक नहीं जाती।"
    },
    "items": [
      {
        "title": {
          "en": "Women and children",
          "hi": "महिलाएँ और बच्चे"
        },
        "body": {
          "en": "Understand anonymous and registered options.",
          "hi": "गुमनाम और पंजीकृत विकल्प समझें।"
        },
        "route": "women-children"
      },
      {
        "title": {
          "en": "Financial fraud",
          "hi": "वित्तीय धोखाधड़ी"
        },
        "body": {
          "en": "Prepare evidence through the complete guided flow.",
          "hi": "पूर्ण निर्देशित प्रवाह में साक्ष्य तैयार करें।"
        },
        "route": "act-now"
      },
      {
        "title": {
          "en": "Other cybercrime",
          "hi": "अन्य साइबर अपराध"
        },
        "body": {
          "en": "Create a synthetic complaint draft.",
          "hi": "एक सिंथेटिक शिकायत मसौदा बनाएँ।"
        },
        "route": "other-cybercrime"
      }
    ],
    "fields": [],
    "sources": [
      "officialComplaint"
    ],
    "result": null
  },
  {
    "id": "women-children",
    "group": "complaints",
    "composition": "guidance",
    "label": {
      "en": "Women and children",
      "hi": "महिलाएँ और बच्चे"
    },
    "eyebrow": {
      "en": "Women and children",
      "hi": "महिलाएँ और बच्चे"
    },
    "title": {
      "en": "Reporting options for women and children",
      "hi": "महिलाओं और बच्चों के लिए रिपोर्टिंग विकल्प"
    },
    "intro": {
      "en": "Choose an anonymous practice route or a registered practice route. Both remain local simulations.",
      "hi": "गुमनाम या पंजीकृत अभ्यास मार्ग चुनें। दोनों स्थानीय सिमुलेशन हैं।"
    },
    "items": [
      {
        "title": {
          "en": "Report anonymously",
          "hi": "गुमनाम रिपोर्ट"
        },
        "body": {
          "en": "Practice describing an incident without identity fields.",
          "hi": "पहचान फ़ील्ड के बिना घटना बताने का अभ्यास करें।"
        },
        "route": "anonymous-report"
      },
      {
        "title": {
          "en": "Registered complaint",
          "hi": "पंजीकृत शिकायत"
        },
        "body": {
          "en": "Practice a fuller complaint with synthetic contact details.",
          "hi": "सिंथेटिक संपर्क विवरण के साथ पूरी शिकायत का अभ्यास करें।"
        },
        "route": "registered-report"
      },
      {
        "title": {
          "en": "Immediate safety",
          "hi": "तत्काल सुरक्षा"
        },
        "body": {
          "en": "If anyone is in immediate danger, contact local emergency services directly.",
          "hi": "तत्काल खतरे में स्थानीय आपात सेवा से सीधे संपर्क करें।"
        },
        "route": ""
      }
    ],
    "fields": [],
    "sources": [
      "officialComplaint"
    ],
    "result": null
  },
  {
    "id": "anonymous-report",
    "group": "complaints",
    "composition": "form",
    "label": {
      "en": "Anonymous practice",
      "hi": "गुमनाम अभ्यास"
    },
    "eyebrow": {
      "en": "Anonymous practice",
      "hi": "गुमनाम अभ्यास"
    },
    "title": {
      "en": "Prepare an anonymous complaint draft",
      "hi": "गुमनाम शिकायत मसौदा तैयार करें"
    },
    "intro": {
      "en": "Use fictional details only. This draft is erased when the page reloads.",
      "hi": "केवल काल्पनिक विवरण दें। पेज रीलोड होने पर मसौदा मिट जाएगा।"
    },
    "items": [],
    "fields": [
      {
        "name": "incidentDate",
        "type": "date",
        "label": {
          "en": "When did it happen?",
          "hi": "यह कब हुआ?"
        },
        "required": true
      },
      {
        "name": "category",
        "type": "select",
        "label": {
          "en": "What best describes it?",
          "hi": "इसका सबसे सही विवरण क्या है?"
        },
        "required": true,
        "options": [
          {
            "en": "Financial fraud",
            "hi": "वित्तीय धोखाधड़ी"
          },
          {
            "en": "Threat or harassment",
            "hi": "धमकी या उत्पीड़न"
          },
          {
            "en": "Identity misuse",
            "hi": "पहचान का दुरुपयोग"
          },
          {
            "en": "Other cybercrime",
            "hi": "अन्य साइबर अपराध"
          }
        ]
      },
      {
        "name": "description",
        "type": "textarea",
        "label": {
          "en": "What happened?",
          "hi": "क्या हुआ?"
        },
        "required": true,
        "minLength": 24
      }
    ],
    "sources": [
      "officialComplaint"
    ],
    "result": {
      "en": "Anonymous draft prepared locally",
      "hi": "गुमनाम मसौदा स्थानीय रूप से तैयार"
    }
  },
  {
    "id": "registered-report",
    "group": "complaints",
    "composition": "form",
    "label": {
      "en": "Registered practice",
      "hi": "पंजीकृत अभ्यास"
    },
    "eyebrow": {
      "en": "Registered practice",
      "hi": "पंजीकृत अभ्यास"
    },
    "title": {
      "en": "Prepare a registered complaint draft",
      "hi": "पंजीकृत शिकायत मसौदा तैयार करें"
    },
    "intro": {
      "en": "Use the synthetic examples shown; do not enter real personal information.",
      "hi": "दिए गए सिंथेटिक उदाहरणों का उपयोग करें; वास्तविक व्यक्तिगत जानकारी न भरें।"
    },
    "items": [],
    "fields": [
      {
        "name": "fullName",
        "type": "text",
        "label": {
          "en": "Synthetic full name",
          "hi": "सिंथेटिक पूरा नाम"
        },
        "required": true,
        "minLength": 3,
        "example": "Demo Citizen"
      },
      {
        "name": "email",
        "type": "email",
        "label": {
          "en": "Synthetic email",
          "hi": "सिंथेटिक ईमेल"
        },
        "required": true,
        "example": "citizen@example.test"
      },
      {
        "name": "incidentDate",
        "type": "date",
        "label": {
          "en": "When did it happen?",
          "hi": "यह कब हुआ?"
        },
        "required": true
      },
      {
        "name": "category",
        "type": "select",
        "label": {
          "en": "What best describes it?",
          "hi": "इसका सबसे सही विवरण क्या है?"
        },
        "required": true,
        "options": [
          {
            "en": "Financial fraud",
            "hi": "वित्तीय धोखाधड़ी"
          },
          {
            "en": "Threat or harassment",
            "hi": "धमकी या उत्पीड़न"
          },
          {
            "en": "Identity misuse",
            "hi": "पहचान का दुरुपयोग"
          },
          {
            "en": "Other cybercrime",
            "hi": "अन्य साइबर अपराध"
          }
        ]
      },
      {
        "name": "description",
        "type": "textarea",
        "label": {
          "en": "What happened?",
          "hi": "क्या हुआ?"
        },
        "required": true,
        "minLength": 24
      }
    ],
    "sources": [
      "officialComplaint"
    ],
    "result": {
      "en": "Registered draft prepared locally",
      "hi": "पंजीकृत मसौदा स्थानीय रूप से तैयार"
    }
  },
  {
    "id": "other-cybercrime",
    "group": "complaints",
    "composition": "form",
    "label": {
      "en": "Other cybercrime",
      "hi": "अन्य साइबर अपराध"
    },
    "eyebrow": {
      "en": "Other cybercrime",
      "hi": "अन्य साइबर अपराध"
    },
    "title": {
      "en": "Prepare another cybercrime complaint",
      "hi": "अन्य साइबर अपराध शिकायत तैयार करें"
    },
    "intro": {
      "en": "Organise the basic facts before using an official channel.",
      "hi": "आधिकारिक माध्यम उपयोग करने से पहले मूल तथ्य व्यवस्थित करें।"
    },
    "items": [],
    "fields": [
      {
        "name": "incidentDate",
        "type": "date",
        "label": {
          "en": "When did it happen?",
          "hi": "यह कब हुआ?"
        },
        "required": true
      },
      {
        "name": "category",
        "type": "select",
        "label": {
          "en": "What best describes it?",
          "hi": "इसका सबसे सही विवरण क्या है?"
        },
        "required": true,
        "options": [
          {
            "en": "Financial fraud",
            "hi": "वित्तीय धोखाधड़ी"
          },
          {
            "en": "Threat or harassment",
            "hi": "धमकी या उत्पीड़न"
          },
          {
            "en": "Identity misuse",
            "hi": "पहचान का दुरुपयोग"
          },
          {
            "en": "Other cybercrime",
            "hi": "अन्य साइबर अपराध"
          }
        ]
      },
      {
        "name": "description",
        "type": "textarea",
        "label": {
          "en": "What happened?",
          "hi": "क्या हुआ?"
        },
        "required": true,
        "minLength": 24
      }
    ],
    "sources": [
      "officialComplaint"
    ],
    "result": {
      "en": "Cybercrime draft prepared locally",
      "hi": "साइबर अपराध मसौदा स्थानीय रूप से तैयार"
    }
  }
];


