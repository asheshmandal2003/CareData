require("dotenv").config();
const mongoose = require("mongoose");
const DoctorDetails = require("../models/doctorDetails");
const User = require("../models/user");

// --- Uses passport-local-mongoose for hashing password
const defaultPassword = "password123";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caredata";

// -- Array of 15 complete doctor+user objects
const doctorEntries = [
  {
    user: {
      fullName: "Dr. Soumya Mahapatra",
      emailId: "dr.mahapatra@heartplus.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, MD (Cardiology)",
      speciality: "Cardiology",
      subSpecialities: ["Interventional Cardiology", "Arrhythmia"],
      clinicName: "Heart Plus Clinic",
      clinicAddress: "15 Jubilee Road, Kolkata",
      fees: 1200,
      location: "Kolkata",
      contactNumber: "+91 9810011001",
      email: "dr.mahapatra@heartplus.com",
      language: ["English", "Bengali", "Hindi"],
      aboutDoctor:
        "Acclaimed for advanced cardiac intervention; 17 years of experience in heart diseases, emergencies, and preventive care.",
      experience: 17,
      regId: "KMC-CARD-110",
      awards: ["State Gold Medalist 2019", "Best Interventionist 2021"],
      certifications: ["FACC", "FSCAI"],
      services: ["ECG", "Angioplasty", "Pacemaker Implant"],
      consultationTypes: ["In-Person", "Online"],
      clinicTimings: [
        { day: "Monday", open: "09:00 AM", close: "06:00 PM" },
        { day: "Wednesday", open: "09:00 AM", close: "06:00 PM" },
      ],
      socialLinks: {
        website: "https://heartplusclinic.com",
        linkedin: "https://linkedin.com/in/mahapatracardio",
        facebook: "https://facebook.com/heartplusclinic",
      },
    },
  },
  {
    user: {
      fullName: "Dr. Rajneesh Kumar",
      emailId: "dr.rajneesh@orthocare.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, MS (Orthopedics)",
      speciality: "Orthopedic Surgery",
      subSpecialities: ["Joint Replacement", "Sports Medicine"],
      clinicName: "OrthoCare Hospital",
      clinicAddress: "Block-C, 22 Lake Road, Delhi",
      fees: 950,
      location: "Delhi",
      contactNumber: "+91 9992221122",
      email: "dr.rajneesh@orthocare.com",
      language: ["English", "Hindi", "Punjabi"],
      aboutDoctor:
        "Expert in hip, knee, and trauma surgeries with 12 years of surgical practice.",
      experience: 12,
      regId: "DMC-ORTHO-202",
      awards: ["IOA Young Doctor Award"],
      certifications: ["Fellow Arthroplasty"],
      services: ["Knee Replacement", "Hip Replacement", "Sports Rehab"],
      consultationTypes: ["In-Person", "Online"],
      clinicTimings: [
        { day: "Tuesday", open: "10:00 AM", close: "05:00 PM" },
        { day: "Friday", open: "11:00 AM", close: "04:00 PM" },
      ],
      socialLinks: {},
    },
  },
  {
    user: {
      fullName: "Dr. Sarita Reddy",
      emailId: "dr.sarita@endosugar.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, MD, DM (Endocrinology)",
      speciality: "Endocrinology",
      subSpecialities: ["Diabetes", "Thyroid Disorders"],
      clinicName: "Sugar & Hormone Centre",
      clinicAddress: "61 Main Street, Hyderabad",
      fees: 1000,
      location: "Hyderabad",
      contactNumber: "+91 9445678920",
      email: "dr.sarita@endosugar.com",
      language: ["English", "Telugu"],
      aboutDoctor:
        "Renowned diabetes specialist. Focus on thyroid, metabolic, and adolescent endocrine care.",
      experience: 14,
      regId: "HMC-ENDO-2121",
      awards: ["Best Diabetologist Telangana 2020"],
      certifications: [],
      services: [
        "Diabetes Consult",
        "Thyroid Function Test",
        "Hormone Profile",
      ],
      consultationTypes: ["In-Person"],
      clinicTimings: [
        { day: "Monday", open: "09:30 AM", close: "03:00 PM" },
        { day: "Thursday", open: "10:30 AM", close: "03:30 PM" },
      ],
      socialLinks: {},
    },
  },
  {
    user: {
      fullName: "Dr. Arjun Shetty",
      emailId: "dr.arjun@cityms.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, MS (General Surgery)",
      speciality: "General Surgery",
      subSpecialities: ["Laparoscopic Surgery"],
      clinicName: "City Multi-speciality",
      clinicAddress: "18 Gandhi Road, Pune",
      fees: 850,
      location: "Pune",
      contactNumber: "+91 9012348211",
      email: "dr.arjun@cityms.com",
      language: ["English", "Hindi", "Marathi"],
      aboutDoctor:
        "Minimal access surgery, hernia, appendectomy, and emergency trauma expert.",
      experience: 10,
      regId: "MMC-SURG-098",
      awards: ["Pune Best Laparoscopic Surgeon 2018"],
      certifications: ["FIAGES", "FALS"],
      services: ["Laparoscopic Hernia", "Appendix Surgery", "Gall Bladder"],
      consultationTypes: ["In-Person"],
      clinicTimings: [
        { day: "Saturday", open: "11:00 AM", close: "04:00 PM" },
        { day: "Wednesday", open: "01:00 PM", close: "05:00 PM" },
      ],
      socialLinks: {},
    },
  },
  {
    user: {
      fullName: "Dr. Lalita Rao",
      emailId: "dr.lalita@kidswellness.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, DNB (Pediatrics)",
      speciality: "Pediatrics",
      subSpecialities: ["Child Nutrition", "Neonatology"],
      clinicName: "Kids' Wellness Hub",
      clinicAddress: "14 Child Lane, Bangalore",
      fees: 900,
      location: "Bangalore",
      contactNumber: "+91 9845321003",
      email: "dr.lalita@kidswellness.com",
      language: ["English", "Kannada"],
      aboutDoctor:
        "Specialized in child nutrition and growth consultation. 8 years in pediatric practice.",
      experience: 8,
      regId: "KMC-PED-344",
      awards: [],
      certifications: ["Pediatric ALS", "Immunization Specialist"],
      services: ["Development Checkup", "Vaccination", "Neonatal Screening"],
      consultationTypes: ["In-Person", "Online", "Home Visit"],
      clinicTimings: [
        { day: "Monday", open: "10:00 AM", close: "02:00 PM" },
        { day: "Thursday", open: "11:00 AM", close: "02:00 PM" },
      ],
      socialLinks: {},
    },
  },
  {
    user: {
      fullName: "Dr. Devayan Mandal",
      emailId: "devayan922@gmail.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, MS (General Surgery), MCh (Neurosurgery)",
      speciality: "Neurosurgery",
      subSpecialities: [
        "Brain Tumor Surgery",
        "Minimally Invasive Spine Surgery",
        "Neurotrauma",
      ],
      clinicName: "NeuroCare Advanced Center",
      clinicAddress: "22 Meditech Road, Bangalore",
      fees: 1_600,
      location: "Bangalore",
      contactNumber: "+91 9886001234",
      email: "devayan922@gmail.com",
      language: ["English", "Hindi", "Bengali"],
      aboutDoctor:
        "Top neurosurgeon with expertise in advanced brain and spine surgeries. Over 15 years of surgical experience and multiple successful complex neuro cases.",
      experience: 15,
      regId: "KMC-NS-556",
      awards: [
        "Best Neurosurgeon 2022 - India Healthcare Awards",
        "Excellence in Spine Surgery 2023",
      ],
      certifications: [
        "Neuroendoscopic Surgery Fellowship",
        "Advanced Spine Surgery Certification",
      ],
      services: [
        "Brain Tumor Removal",
        "Microsurgery for Spine",
        "Epilepsy Surgery",
        "Neurocritical Care",
        "Stroke Management",
      ],
      consultationTypes: ["In-Person", "Online"],
      clinicTimings: [
        { day: "Tuesday", open: "09:00 AM", close: "01:00 PM" },
        { day: "Friday", open: "02:00 PM", close: "05:00 PM" },
      ],
      socialLinks: {},
    },
  },
  {
    user: {
      fullName: "Dr. Sunaina Kamble",
      emailId: "dr.sunaina@glowskinclinic.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, MD (Dermatology)",
      speciality: "Dermatology",
      subSpecialities: ["Laser Treatment", "Aesthetics"],
      clinicName: "Glow Skin Clinic",
      clinicAddress: "134 Park Street, Mumbai",
      fees: 1100,
      location: "Mumbai",
      contactNumber: "+91 9767889231",
      email: "dr.sunaina@glowskinclinic.com",
      language: ["English", "Marathi", "Hindi"],
      aboutDoctor:
        "Cosmetic and clinical dermatologist with decade of experience in laser and acne solutions.",
      experience: 10,
      regId: "MMC-DERM-826",
      awards: ["Cosmetic Dermatologist 2016"],
      certifications: ["Laser Therapy Fellowship"],
      services: ["Laser Treatment", "Chemical Peel", "Acne Care"],
      consultationTypes: ["In-Person", "Online"],
      clinicTimings: [
        { day: "Tuesday", open: "12:00 PM", close: "08:00 PM" },
        { day: "Friday", open: "10:00 AM", close: "07:00 PM" },
      ],
      socialLinks: {},
    },
  },
  {
    user: {
      fullName: "Dr. Shanthi Iyer",
      emailId: "dr.shanthi@mothershope.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, MS (Obstetrics & Gynecology)",
      speciality: "Gynecology",
      subSpecialities: ["Fertility", "High Risk Pregnancy"],
      clinicName: "Mother's Hope",
      clinicAddress: "27 Lotus St, Chennai",
      fees: 1050,
      location: "Chennai",
      contactNumber: "+91 9006557822",
      email: "dr.shanthi@mothershope.com",
      language: ["English", "Tamil"],
      aboutDoctor:
        "Specialist in reproductive medicine and maternal care. 13 years of experience.",
      experience: 13,
      regId: "CMC-GYN-1006",
      awards: ["Fertility Star 2022"],
      certifications: ["Reproductive Endocrinology"],
      services: ["Fertility Assessment", "Antenatal", "Gynae Surgery"],
      consultationTypes: ["In-Person", "Online"],
      clinicTimings: [
        { day: "Monday", open: "10:00 AM", close: "06:00 PM" },
        { day: "Wednesday", open: "10:00 AM", close: "06:00 PM" },
      ],
      socialLinks: {},
    },
  },
  {
    user: {
      fullName: "Dr. Abhishek Saha",
      emailId: "dr.abhishek@mindcompanions.com",
      entryType: "doctor",
    },
    details: {
      education: "MBBS, DNB (Psychiatry)",
      speciality: "Psychiatry",
      subSpecialities: ["Child Psychiatry", "Addiction"],
      clinicName: "MindCompanions",
      clinicAddress: "1 Netaji Road, Kolkata",
      fees: 800,
      location: "Kolkata",
      contactNumber: "+91 9874711111",
      email: "dr.abhishek@mindcompanions.com",
      language: ["English", "Hindi", "Bengali"],
      aboutDoctor:
        "Counseling and addiction/child psychiatry expert; 11 years experience; focus on holistic mental health.",
      experience: 11,
      regId: "KMC-PSY-078",
      awards: ["State Mental Health Honor 2018"],
      certifications: ["Diploma in CBT"],
      services: ["Sleep Issues", "Addiction Therapy", "Child Counseling"],
      consultationTypes: ["In-Person", "Online"],
      clinicTimings: [
        { day: "Saturday", open: "09:00 AM", close: "02:00 PM" },
        { day: "Thursday", open: "02:00 PM", close: "06:00 PM" },
      ],
      socialLinks: {},
    },
  },
  /* ... add more entries up to 15+ with various fields filled out ... */
];

// MAIN seed function
async function seedDoctorUsers() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Optionally clear old:
    await User.deleteMany({ entryType: "doctor" });
    await DoctorDetails.deleteMany({});

    for (const doc of doctorEntries) {
      // Create the DoctorDetails first
      const details = new DoctorDetails(doc.details);
      await details.save();

      // Register the user (so password is hashed)
      const userData = {
        ...doc.user,
        username: doc.user.fullName,
        doctorDetails: details._id,
      };
      const user = new User(userData);
      await User.register(user, defaultPassword);
      console.log(`Added: ${user.fullName} (username "${user.username}")`);
    }

    console.log("All complete!");
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDoctorUsers();
