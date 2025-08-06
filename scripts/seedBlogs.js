require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/blog"); // Adjust the path if needed

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caredata";

const blogsData = [
  {
    title: "Understanding Hypertension: Causes, Symptoms & Prevention",
    summary:
      "Hypertension, or high blood pressure, is a widespread condition. Learn about its causes, warning signs, and effective prevention strategies.",
    content: `
      <h2>What is Hypertension?</h2>
      <p>Hypertension is a chronic medical condition where the blood pressure in the arteries is persistently elevated. This increases the risk of heart disease, stroke, and other complications.</p>
      
      <h3>Common Causes</h3>
      <ul>
        <li><strong>Genetic Factors:</strong> Family history plays a significant role in risk.</li>
        <li><strong>Poor Diet:</strong> High salt intake, excessive alcohol, and processed foods contribute.</li>
        <li><strong>Lack of Physical Activity:</strong> Sedentary lifestyle can raise blood pressure.</li>
        <li><strong>Stress:</strong> Chronic stress affects the heart and vessels.</li>
        <li><strong>Obesity:</strong> Excess weight strains the cardiovascular system.</li>
      </ul>

      <h3>Recognizing Symptoms</h3>
      <p>Hypertension is known as the “silent killer” because it often has no symptoms until serious damage is done. Symptoms, when present, can include headaches, shortness of breath, or nosebleeds.</p>

      <h3>Prevention Tips</h3>
      <p>Preventing hypertension involves lifestyle changes:</p>
      <ul>
        <li>Adopt a balanced, low-sodium diet rich in fruits and vegetables.</li>
        <li>Engage in at least 30 minutes of moderate exercise most days.</li>
        <li>Maintain a healthy weight.</li>
        <li>Manage stress through relaxation techniques or counseling.</li>
        <li>Limit alcohol consumption and avoid tobacco use.</li>
        <li>Regularly check and monitor your blood pressure.</li>
      </ul>
    `,
    image: "/image/hypertension.jpg",
    category: "Cardiology",
    author: "Dr. Samantha Lee",
    publishedAt: new Date("2025-07-20"),
  },
  {
    title:
      "Pediatric Health: Ensuring Healthy Growth & Development in Early Childhood",
    summary:
      "Discover the essential aspects of pediatric care to support your child’s physical, emotional, and cognitive development during the critical early years.",
    content: `
      <h2>Why Pediatric Care is Crucial</h2>
      <p>Early childhood is a period of rapid growth and development. Regular pediatric care ensures that children meet developmental milestones and receive timely vaccinations and interventions.</p>

      <h3>Key Areas of Focus</h3>
      <ul>
        <li><strong>Nutrition:</strong> Balanced diets with essential nutrients promote strong bones and brain development.</li>
        <li><strong>Immunizations:</strong> Protect children from preventable diseases like measles and polio.</li>
        <li><strong>Developmental Monitoring:</strong> Tracking cognitive, motor, emotional, and social milestones helps identify delays early.</li>
        <li><strong>Behavioral Health:</strong> Support for behavioral issues and mental health from a young age sets a foundation for lifelong wellbeing.</li>
      </ul>

      <h3>Parenting Tips</h3>
      <ol>
        <li>Establish regular well-child visits with your pediatrician.</li>
        <li>Ensure a clean, safe, and stimulating environment for exploration.</li>
        <li>Encourage age-appropriate play and social interaction.</li>
        <li>Monitor screen time and encourage physical activity.</li>
        <li>Communicate openly with your child and provide emotional support.</li>
      </ol>
    `,
    image: "/image/pediatric.jpg",
    category: "Pediatric",
    author: "Dr. Ananya Roy",
    publishedAt: new Date("2025-07-10"),
  },
  {
    title: "Managing Diabetes: Comprehensive Lifestyle and Treatment Guide",
    summary:
      "Diabetes affects millions worldwide. Learn how diet, exercise, medication, and monitoring can help manage this chronic condition effectively.",
    content: `
      <h2>Understanding Diabetes</h2>
      <p>Diabetes mellitus is a group of diseases characterized by high blood sugar levels resulting from defects in insulin production, insulin action, or both.</p>

      <h3>Types of Diabetes</h3>
      <ul>
        <li><strong>Type 1 Diabetes:</strong> Autoimmune destruction of insulin-producing cells.</li>
        <li><strong>Type 2 Diabetes:</strong> Insulin resistance often linked to obesity and lifestyle.</li>
        <li><strong>Gestational Diabetes:</strong> Occurs during pregnancy and may increase future diabetes risk.</li>
      </ul>

      <h3>Management Strategies</h3>
      <p>Effective diabetes management requires a multi-faceted approach:</p>
      <ul>
        <li><strong>Blood Sugar Monitoring:</strong> Regular glucose checks to maintain target levels.</li>
        <li><strong>Healthy Eating:</strong> Focus on whole foods, low in refined sugars and high in fiber.</li>
        <li><strong>Physical Activity:</strong> Exercise enhances insulin sensitivity.</li>
        <li><strong>Medications:</strong> Insulin or oral hypoglycemics as prescribed.</li>
        <li><strong>Stress Reduction and Sleep:</strong> Key to improving overall control.</li>
      </ul>

      <h3>Complications to Watch For</h3>
      <p>If unmanaged, diabetes can cause heart disease, kidney failure, nerve damage, and vision loss. Regular checkups and lifestyle adherence prevent most complications.</p>
    `,
    image: "/image/diabetes.jpg",
    category: "Endocrinology",
    author: "Dr. John Patel",
    publishedAt: new Date("2025-07-15"),
  },
  {
    title:
      "The Importance of Mental Health: Recognizing and Addressing Common Disorders",
    summary:
      "Mental health is vital to overall wellbeing. Understand common disorders, their symptoms, and how to seek appropriate help.",
    content: `
      <h2>What is Mental Health?</h2>
      <p>Mental health includes emotional, psychological, and social wellbeing that affects how we think, feel, and act.</p>

      <h3>Common Mental Health Disorders</h3>
      <ul>
        <li><strong>Depression:</strong> Persistent feelings of sadness and loss of interest.</li>
        <li><strong>Anxiety Disorders:</strong> Excessive fear or worry disrupting daily life.</li>
        <li><strong>Bipolar Disorder:</strong> Mood swings between mania and depression.</li>
        <li><strong>Post-Traumatic Stress Disorder (PTSD):</strong> Reaction to traumatic events.</li>
      </ul>

      <h3>Signs and Symptoms</h3>
      <p>Signs include changes in mood, energy, eating habits, sleeping patterns, or withdrawing from social activities.</p>

      <h3>Getting Help</h3>
      <p>Mental health disorders are treatable. Seek professional counseling, therapy, or medications when needed. Support from family and friends is also essential.</p>
    `,
    image: "/image/mental-health.jpg",
    category: "Psychology",
    author: "Dr. Meera Singh",
    publishedAt: new Date("2025-07-22"),
  },
  {
    title: "Healthy Aging: Tips to Maintain Vitality in Your Golden Years",
    summary:
      "Aging gracefully is possible with the right habits. Learn lifestyle tips that help maintain physical, mental, and social health as you age.",
    content: `
      <h2>The Challenges of Aging</h2>
      <p>Aging brings changes in strength, metabolism, bone density, and cognitive function, increasing risk of chronic diseases.</p>

      <h3>Key Strategies for Healthy Aging</h3>
      <ul>
        <li><strong>Nutrition:</strong> Diet rich in antioxidants, vitamins, and minerals supports organ function.</li>
        <li><strong>Exercise:</strong> Regular physical activity maintains muscle strength and balance.</li>
        <li><strong>Cognitive Engagement:</strong> Stay mentally active with hobbies, reading, and social interaction.</li>
        <li><strong>Preventive Care:</strong> Regular health screenings and vaccinations.</li>
        <li><strong>Sleep Quality:</strong> Aim for 7-8 hours of restful sleep nightly.</li>
      </ul>

      <h3>Social Connection</h3>
      <p>Remaining socially involved reduces risk of depression and cognitive decline.</p>

      <h3>Final Thoughts</h3>
      <p>Healthy aging is a holistic process requiring attention to body, mind, and community to enjoy a fulfilling life.</p>
    `,
    image: "/image/healthy-aging.jpg",
    category: "Geriatrics",
    author: "Dr. Arjun Mehta",
    publishedAt: new Date("2025-07-25"),
  },
];

async function seedBlogs() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    await Blog.deleteMany({});
    console.log("Old blog data removed.");

    await Blog.insertMany(blogsData);
    console.log("Blogs seeded successfully.");

    await mongoose.connection.close();
    console.log("Connection closed.");
  } catch (err) {
    console.error("Error seeding blogs:", err);
    await mongoose.connection.close();
  }
}

seedBlogs();
