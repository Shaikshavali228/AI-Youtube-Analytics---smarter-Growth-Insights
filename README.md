# 🎥 **AI YouTube Analytics Tools – Smarter Growth Insights**

An **AI-powered YouTube analytics and content optimization platform** designed to help content creators improve video visibility, engagement, and workflow efficiency.  
This system integrates multiple AI modules to automate thumbnail creation, content generation, keyword extraction, and performance analytics.

---

## 📌 **Project Overview**

The **AI YouTube Analytics Tools – Smarter Growth Insights** platform provides an integrated environment where creators can generate optimized content, analyze video performance, and identify trending strategies using artificial intelligence.

The system combines **Natural Language Processing (NLP)**, **Image Generation Models**, and **Data Analytics** to simplify the content creation process and improve channel growth outcomes.

The platform consists of **nine major modules**, including authentication and eight AI-based functional features that support creators throughout the content lifecycle.

---

## 🚀 **Features**

- 🔐 **Secure User Authentication**
- 🖼️ **AI Thumbnail Generation**
- 🔍 **Thumbnail Similarity Search**
- 📝 **AI Content Generator** (Titles, Tags, Descriptions)
- 📈 **Trending Keyword Extraction**
- ⚙️ **Video Optimization Suggestions**
- 📊 **Outlier Detection for High-performing Videos**
- 📅 **Weekly Channel Report Generation**
- 🎬 **AI Video Script Generator**

---

## 🧩 **System Modules**

- **User Authentication and Billing**
- **AI Thumbnail Generator**
- **AI Thumbnail Search**
- **AI Content Generator**
- **Trending Keyword Extractor**
- **Video Optimization**
- **Outlier Detection**
- **Weekly Channel Report**
- **AI Video Script Generator**

---

## 🏗️ **System Architecture**

The system follows a **three-tier architecture**:

### **1️⃣ Presentation Layer**
- Built using **Next.js**
- Provides interactive user interface
- Handles user inputs and outputs

### **2️⃣ Application Layer**
- Processes AI requests
- Executes feature modules
- Manages workflows

### **3️⃣ Data Layer**
- Stores user data and analytics
- Handles database operations

---

## 🛠️ **Tech Stack**

### **Frontend**
- Next.js  
- HTML5  
- CSS3  
- JavaScript  

### **Backend**
- Node.js  
- Prisma ORM  
- Inngest  

### **Database**
- Neon DB (**PostgreSQL**)

### **AI & APIs**
- Gemini API  
- Replicate API  
- Bright Data  
- CLIP Model  

### **Authentication**
- Clerk Authentication  

### **Storage**
- ImageKit  

### **Payment Integration**
- Stripe  

---

## ⚙️ **Installation Guide**

### **Prerequisites**

Make sure the following are installed:

- Node.js  
- npm or yarn  
- Git  
- PostgreSQL / Neon DB  
- API Keys (Gemini, Replicate, Clerk, Bright Data)

---

### **Step 1 — Clone Repository**

```bash
git clone https://github.com/your-username/ai-youtube-analytics-tools.git
cd ai-youtube-analytics-tools

Step 2 — Install Dependencies
npm install
Step 3 — Setup Environment Variables
Create a .env file and add:

NEXT_PUBLIC_CLERK_KEY=your_clerk_key
GEMINI_API_KEY=your_gemini_key
REPLICATE_API_KEY=your_replicate_key
BRIGHTDATA_API_KEY=your_brightdata_key
DATABASE_URL=your_neon_database_url
STRIPE_SECRET_KEY=your_stripe_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
Step 4 — Run the Application
npm run dev
Open in browser:

http://localhost:3000
📊 Results
The system demonstrated improved efficiency in content creation and optimization. AI-generated thumbnails, scripts, and metadata were relevant and visually effective. Trending keyword suggestions enhanced video discoverability, while optimization tools improved metadata quality. Outlier detection successfully identified high-performing videos, and weekly reports provided clear performance insights. Overall, the platform reduced manual effort and improved workflow efficiency.
