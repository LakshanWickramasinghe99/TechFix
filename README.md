# TechVoice: Voice-Activated E-Commerce Platform for Electronics

## Overview
TechVoice is a modern e-commerce platform specializing in electronics, powered by voice-activated search and personalized recommendations. The platform allows users to browse, search, and purchase products using voice commands, while admins manage inventory, orders, and user profiles efficiently.

---

## Key Features
### 🛒 **Product Management** *(Nalinda)*
- Admins can **insert, update, or delete** products with details like name, price, specs, and stock.
- **Validation**: Ensures price > 0, stock ≥ 0, and valid image URLs.
- **Reports**: Generates inventory reports (e.g., low-stock alerts, best-selling items).

### 👤 **User Profiles** *(Senuri)*
- Users can update personal info or delete accounts.
- **Validation**: Validates email format and password strength (8+ chars with symbols).
- **Reports**: Tracks user activity logs (e.g., purchase history).

### 📦 **Order Management** *(Tharaka)*
- Users can **create, update, or cancel** orders.
- **Validation**: Ensures order quantity > 0.
- **Reports**: Generates product comparison reports.

### 🎙️ **Unique Voice Feature** *(Yevin)*
- **Voice-Activated Search**: Users search for products by speaking; results display in real-time.
- **Personalized Recommendations**: ML-driven suggestions based on user behavior.

---

## Technologies Used
### 🖥️ **Frontend**
- React.js + Vite  
- TailwindCSS  

### ⚙️ **Backend**
- Node.js/Express.js  

### 🗃️ **Database**
- MongoDB  

### 🔐 **Authentication**
- JWT (JSON Web Tokens)  

### � **Voice Integration**
- Web Speech API  
- Google Cloud Speech-to-Text  

### 🤖 **Machine Learning**
- Custom ML algorithms for recommendations  

---

## Getting Started

### Prerequisites
- Node.js (v16+)  
- MongoDB Atlas or local instance  
- Google Cloud API key (for Speech-to-Text)  

