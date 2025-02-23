# **Fluention** 🗣️💬  

Fluention is an AI-powered speech therapy platform designed to assist individuals with speech and language impairments. Using cutting-edge AI and neuroscience-backed methods, Fluention enhances pronunciation, articulation, and speech clarity—helping users express themselves confidently.  

---

## **Table of Contents**
- [Inspiration](#inspiration)
- [What It Does](#what-it-does)
- [How We Built It](#how-we-built-it)
- [Challenges We Ran Into](#challenges-we-ran-into)
- [Accomplishments That We're Proud Of](#accomplishments-that-were-proud-of)
- [What We Learned](#what-we-learned)
- [What's Next for Fluention](#whats-next-for-fluention)
- [How to Run the Project](#how-to-run-the-project)
- [Tech Stack](#tech-stack)
- [Contributors](#contributors)
- [License](#license)

---

## **Inspiration**  
At Fluention, we believe everyone deserves to be heard and understood. Inspired by personal experiences with loved ones who have developmental and speech disorders, we witnessed the frustration of being unable to express thoughts clearly. Traditional speech therapy can be expensive, time-consuming, and difficult to access, leaving many individuals without the resources they need.  

Fluention was created to bridge this gap using AI-powered speech therapy techniques that analyze pronunciation, articulation, and sentence formation. Our mission is to provide **a structured, accessible, and interactive learning experience** that helps users train their speech anywhere, anytime.

---

## **What It Does**  
Fluention is not a standard language translator—it is an AI-driven **speech therapy and communication enhancement tool**. We offer **two main functions**:

### **1. AI Speech Language Pathologist Assistant**  
A science-backed pronunciation training system inspired by research from top university hospitals. This module **assesses, corrects, and enhances speech clarity through real-time AI feedback.**  

#### **Key Features:**  
✅ **Oral & Breath Control Training** - AI-powered **Lip and Tongue Analyzer** tracks articulation using **Mediapipe** and provides visual feedback.  
✅ **Receptive & Expressive Language Development** - AI analyzes speech, converts it to text, and provides pronunciation and grammar feedback.  
✅ **Vocabulary Enhancement** - Gamified exercises to improve word recognition and communication skills.  
✅ **Contextual Communication Skills** - A voice-based AI assistant helps users **practice real-life conversations** with real-time corrections.  

### **2. AI-Powered Language Disorder Translator**  
Individuals with speech disorders often struggle with sentence structuring. Our AI-powered translator **converts unclear speech and fragmented sentences into structured, understandable text**, making communication more fluid.  

---

## **How We Built It**  
Fluention integrates various AI and machine learning techniques to create an interactive and effective speech training tool.  

### **Technologies Used:**  
🛠 **Frontend:** Next.js, React, CSS, Figma for UI/UX design  
🛠 **Backend:** Python, Flask  
🛠 **AI Models:** Mediapipe (lip movement tracking), Speech-to-Text APIs  
🛠 **Machine Learning:** Reinforcement Learning for speech-to-text analysis  

### **Implementation Details:**  
🎯 **Lip and Tongue Analyzer** (Mediapipe, OpenCV) - Tracks mouth and tongue movements for speech articulation training.  
🎯 **Speech Recognition** - AI detects pronunciation errors and suggests corrections.  
🎯 **Voice Assistant Friend** - AI-powered chatbot that engages users in conversation-based exercises.  
🎯 **Real-Time Pronunciation Game** - Gamified learning experience to encourage speech improvement.  

---

## **Challenges We Ran Into**  
🚧 **Limited speech impairment datasets** for AI training made model accuracy a challenge.  
🚧 **Ensuring real-time feedback** while processing multiple AI functions without lag.  
🚧 **Fine-tuning AI models** to differentiate between subtle pronunciation errors.  
🚧 **Seamless integration** of multiple APIs for speech analysis and tracking.  

---

## **Accomplishments That We're Proud Of**  
🏆 Successfully built an **AI-powered lip-sync pronunciation trainer**.  
🏆 Integrated **five different APIs** to create a smooth speech training experience.  
🏆 Developed a fully functional **speech therapy assistant in under 36 hours**.  
🏆 Created **real-time feedback mechanisms** that accurately analyze and improve pronunciation.  
🏆 Made **AI-based speech training accessible** to those who need it most.  

---

## **What We Learned**  
📌 How to train AI for **speech recognition and pronunciation correction**.  
📌 The challenges **individuals with speech impairments** face and how AI can support them.  
📌 Best practices for **real-time AI-powered speech processing**.  

---

## **What's Next for Fluention**  
🚀 Implement **Machine Learning-based lip tracking** for improved accuracy.  
🚀 Enhance **tongue movement detection** using deep learning techniques.  
🚀 Expand AI training **with more diverse speech impairment datasets**.  
🚀 Introduce **personalized AI conversation partners** for enhanced communication practice.  
🚀 Develop a **competitive pronunciation game** with rewards.  
🚀 Add **slow-motion mouth movement analysis** for detailed pronunciation guidance.  

---

## **How to Run the Project**  
### **Prerequisites**  
Ensure you have the following installed on your system:  
✅ **Next.js** (for frontend)  
✅ **Python 3** (for backend)  
✅ **Virtual environment (optional but recommended)**  
✅ **Mediapipe, OpenCV, Flask, and Speech-to-Text API keys**  

### **Steps to Run Locally**  
1️⃣ **Clone the Repository**  
```bash
git clone https://github.com/your-username/fluention.git
cd fluention
