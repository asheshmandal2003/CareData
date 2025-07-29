require("dotenv").config();
const mongoose = require("mongoose");
const LabTest = require("../models/labTest");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caredata";

const labTestsData = [
  {
    name: "Complete Blood Count (CBC)",
    description:
      "Measures red/white blood cells, hemoglobin, hematocrit and platelets.",
    category: "Hematology",
    price: 500,
    preparation: "No special preparation needed.",
    duration: "30 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timing: "08:00 AM - 04:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "Same day",
  },
  {
    name: "Lipid Profile",
    description:
      "Measures cholesterol types (LDL, HDL) and triglycerides for heart disease risk evaluation.",
    category: "Cardiology",
    price: 1200,
    preparation: "12 hours fasting required before test.",
    duration: "45 mins",
    sampleType: "Blood",
    fastingRequired: true,
    availability: {
      weekdays: ["Monday", "Wednesday", "Friday"],
      timing: "08:00 AM - 03:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "24 hours",
  },
  {
    name: "Thyroid Stimulating Hormone (TSH) Test",
    description:
      "Checks thyroid gland function by measuring TSH hormone levels.",
    category: "Endocrinology",
    price: 800,
    preparation: "No fasting required.",
    duration: "30 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Tuesday", "Thursday"],
      timing: "10:00 AM - 02:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "24-48 hours",
  },
  {
    name: "Blood Sugar - Fasting",
    description:
      "Measures fasting glucose levels to check for diabetes or pre-diabetes.",
    category: "Endocrinology",
    price: 400,
    preparation: "Fasting for 8-10 hours required.",
    duration: "20 mins",
    sampleType: "Blood",
    fastingRequired: true,
    availability: {
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timing: "07:00 AM - 12:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "Same day",
  },
  {
    name: "HbA1c (Glycated Hemoglobin) Test",
    description: "Reflects average blood sugar levels over past 3 months.",
    category: "Endocrinology",
    price: 1000,
    preparation: "No fasting needed.",
    duration: "30 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Wednesday", "Friday"],
      timing: "08:00 AM - 04:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "24 hours",
  },
  {
    name: "Liver Function Test (LFT)",
    description: "Tests enzymes and proteins related to liver health.",
    category: "Hepatology",
    price: 1500,
    preparation: "No alcohol 24 hours before test.",
    duration: "45 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Tuesday", "Thursday"],
      timing: "09:00 AM - 01:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "48 hours",
  },
  {
    name: "Kidney Function Test (KFT)",
    description:
      "Measures creatinine, urea and electrolytes to assess kidney performance.",
    category: "Nephrology",
    price: 1300,
    preparation: "No special preparation required.",
    duration: "30 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Wednesday", "Friday"],
      timing: "08:30 AM - 03:30 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "48 hours",
  },
  {
    name: "Urine Routine and Microscopy",
    description:
      "Checks for urinary infections, kidney pathology and overall renal health.",
    category: "Nephrology",
    price: 500,
    preparation: "Collect morning urine sample.",
    duration: "15 mins",
    sampleType: "Urine",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timing: "07:00 AM - 04:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "Same day",
  },
  {
    name: "Vitamin D Test",
    description: "Measures vitamin D levels essential for bone health.",
    category: "Nutrition",
    price: 1800,
    preparation: "No fasting required.",
    duration: "30 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Tuesday", "Thursday"],
      timing: "09:00 AM - 02:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "48 hours",
  },
  {
    name: "Calcium Test",
    description:
      "Measures calcium levels for bone and muscle function assessment.",
    category: "Nutrition",
    price: 700,
    preparation: "No fasting required.",
    duration: "25 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Wednesday"],
      timing: "08:00 AM - 01:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "24-48 hours",
  },
  {
    name: "Electrolyte Panel",
    description:
      "Measures sodium, potassium, chloride to assess electrolyte balance.",
    category: "General",
    price: 900,
    preparation: "No fasting needed.",
    duration: "30 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Tuesday", "Thursday"],
      timing: "08:00 AM - 04:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "24 hours",
  },
  {
    name: "Prostate Specific Antigen (PSA) Test",
    description: "Screen for prostate abnormalities including cancer.",
    category: "Urology",
    price: 2000,
    preparation: "No ejaculation for 48 hours and no vigorous exercise prior.",
    duration: "30 mins",
    sampleType: "Blood",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Friday"],
      timing: "09:00 AM - 02:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "48 hours",
  },
  {
    name: "Pap Smear Test",
    description: "Screening test for cervical cancer.",
    category: "Gynecology",
    price: 1500,
    preparation:
      "Avoid intercourse, douching and vaginal meds 48 hours before test.",
    duration: "20 mins",
    sampleType: "Cervical swab",
    fastingRequired: false,
    availability: {
      weekdays: ["Tuesday", "Thursday"],
      timing: "10:00 AM - 03:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "72 hours",
  },
  {
    name: "COVID-19 PCR Test",
    description: "Detects active COVID-19 infection by RT-PCR.",
    category: "Virology",
    price: 2500,
    preparation: "No eating/drinking 2 hours before sample collection.",
    duration: "1 hour",
    sampleType: "Nasal swab",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Tuesday", "Wednesday"],
      timing: "8:00 AM - 12:00 PM",
    },
    labName: "CareData Lab",
    logoUrl: "",
    typicalResultsTime: "Same day",
  },
  {
    name: "Chest X-Ray",
    description: "Radiographic imaging to diagnose chest problems.",
    category: "Radiology",
    price: 700,
    preparation: "No special preparation.",
    duration: "15 mins",
    sampleType: "Imaging",
    fastingRequired: false,
    availability: {
      weekdays: ["Monday", "Wednesday", "Friday"],
      timing: "9:00 AM - 05:00 PM",
    },
    labName: "CareData Radiology",
    logoUrl: "",
    typicalResultsTime: "Same day",
  },
];

async function seedLabTests() {
  try {
    await mongoose.connect(MONGO_URI);

    // Remove existing documents if any (optional)
    await LabTest.deleteMany({});
    console.log("Old LabTest data removed.");

    await LabTest.insertMany(labTestsData);
    console.log("LabTests seeded successfully.");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding LabTests:", err);
    mongoose.connection.close();
  }
}

seedLabTests();
