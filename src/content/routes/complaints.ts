export const COMPLAINTS_ROUTES = [
  {
    "id": "complaints",
    "group": "complaints",
    "composition": "hub",
    "label": {
      "en": "Report options",
      "hi": "रिपोर्ट विकल्प"
    },
    "eyebrow": {
      "en": "Report options",
      "hi": "रिपोर्ट विकल्प"
    },
    "title": {
      "en": "Choose how to report",
      "hi": "रिपोर्ट करने का तरीका चुनें"
    },
    "intro": {
      "en": "Prepare a demo report, organise evidence, or continue to the official portal.",
      "hi": "डेमो रिपोर्ट तैयार करें, साक्ष्य व्यवस्थित करें या आधिकारिक पोर्टल पर जाएँ।"
    },
    "items": [
      {
        "title": {
          "en": "Women and children",
          "hi": "महिलाएँ और बच्चे"
        },
        "body": {
          "en": "Choose whether to continue with or without your name.",
          "hi": "चुनें कि नाम के साथ या बिना नाम के आगे बढ़ना है।"
        },
        "route": "women-children"
      },
      {
        "title": {
          "en": "Financial fraud",
          "hi": "वित्तीय धोखाधड़ी"
        },
        "body": {
          "en": "Organise the incident, evidence, and timeline in a guided flow.",
          "hi": "निर्देशित प्रक्रिया में घटना, साक्ष्य और समयरेखा व्यवस्थित करें।"
        },
        "route": "act-now"
      },
      {
        "title": {
          "en": "Other cybercrime",
          "hi": "अन्य साइबर अपराध"
        },
        "body": {
          "en": "Prepare the key details for another type of cybercrime.",
          "hi": "किसी अन्य साइबर अपराध के मुख्य विवरण तैयार करें।"
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
      "en": "Report concerning a woman or child",
      "hi": "महिला या बच्चे से जुड़ी रिपोर्ट"
    },
    "intro": {
      "en": "Choose whether to continue without your name or with your details.",
      "hi": "चुनें कि नाम साझा किए बिना या अपने विवरण के साथ आगे बढ़ना है।"
    },
    "items": [
      {
        "title": {
          "en": "Without sharing your name",
          "hi": "नाम साझा किए बिना"
        },
        "body": {
          "en": "Prepare the report without adding your name or contact details.",
          "hi": "अपना नाम या संपर्क विवरण जोड़े बिना रिपोर्ट तैयार करें।"
        },
        "route": "anonymous-report"
      },
      {
        "title": {
          "en": "With your details",
          "hi": "अपने विवरण के साथ"
        },
        "body": {
          "en": "Add example contact details and prepare a fuller report.",
          "hi": "उदाहरण संपर्क विवरण जोड़कर अधिक पूरी रिपोर्ट तैयार करें।"
        },
        "route": "registered-report"
      },
      {
        "title": {
          "en": "Someone in immediate danger?",
          "hi": "कोई तत्काल खतरे में है?"
        },
        "body": {
          "en": "Contact local emergency services directly.",
          "hi": "स्थानीय आपात सेवाओं से सीधे संपर्क करें।"
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
      "en": "Without my name",
      "hi": "नाम साझा किए बिना"
    },
    "eyebrow": {
      "en": "Without my name",
      "hi": "नाम साझा किए बिना"
    },
    "title": {
      "en": "Report without sharing your name",
      "hi": "नाम साझा किए बिना रिपोर्ट करें"
    },
    "intro": {
      "en": "Use demo information only. The draft clears when this page reloads.",
      "hi": "केवल डेमो जानकारी दें। पेज रीलोड होने पर मसौदा मिट जाएगा।"
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
      "en": "Demo report prepared",
      "hi": "डेमो रिपोर्ट तैयार है"
    }
  },
  {
    "id": "registered-report",
    "group": "complaints",
    "composition": "form",
    "label": {
      "en": "With my details",
      "hi": "मेरे विवरण के साथ"
    },
    "eyebrow": {
      "en": "With my details",
      "hi": "मेरे विवरण के साथ"
    },
    "title": {
      "en": "Report with your details",
      "hi": "अपने विवरण के साथ रिपोर्ट करें"
    },
    "intro": {
      "en": "Use the example contact details shown. Do not enter real personal information.",
      "hi": "दिए गए उदाहरण संपर्क विवरण उपयोग करें। वास्तविक व्यक्तिगत जानकारी न भरें।"
    },
    "items": [],
    "fields": [
      {
        "name": "fullName",
        "type": "text",
        "label": {
          "en": "Example full name",
          "hi": "उदाहरण पूरा नाम"
        },
        "required": true,
        "minLength": 3,
        "example": "Demo Citizen"
      },
      {
        "name": "email",
        "type": "email",
        "label": {
          "en": "Example email",
          "hi": "उदाहरण ईमेल"
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
      "en": "Demo report prepared",
      "hi": "डेमो रिपोर्ट तैयार है"
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
      "en": "Organise the key facts before continuing on the official portal.",
      "hi": "आधिकारिक पोर्टल पर जाने से पहले मुख्य तथ्य व्यवस्थित करें।"
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
      "en": "Demo report prepared",
      "hi": "डेमो रिपोर्ट तैयार है"
    }
  }
];


