# Aura Properties 🏡✨

A modern, comprehensive web application for real estate listings, built on the MERN stack (MongoDB, Express.js, React.js, Node.js). Aura Properties allows users to easily browse, search, and filter premium real estate properties, while providing a sleek, business-ready, and highly responsive user experience. 

## 🚀 Features

- **Modern & Sleek UI:** A fully redesigned, dynamic user interface built with React, Tailwind CSS, and Framer Motion for smooth micro-animations.
- **Advanced Authentication:** Secure user sign-up, sign-in, and sign-out functionality, featuring both traditional email/password and **Google OAuth** integration via Firebase.
- **Property Listings & Management:** Users can view rich details of available properties, including high-quality image galleries, descriptions, location details, and accurate pricing displayed in **Indian Rupees (₹)**.
- **Powerful Search & Filter:** Easily find the perfect property using advanced search queries and filters (e.g., location, property type, price range, furnished, parking availability).
- **Responsive Layout:** Optimized for all devices—from desktop to mobile—ensuring a seamless browsing experience everywhere.
- **User Profiles:** Authenticated users can manage their profiles, update their information, and oversee their own property listings.

## 🛠️ Technologies Used

### Frontend
- **React.js** (via Vite)
- **Tailwind CSS** (for styling and responsive design)
- **Redux Toolkit & Redux Persist** (for global state management)
- **React Router** (for dynamic routing)
- **Framer Motion** (for UI animations)
- **Firebase** (for Google Auth and cloud storage)
- **Swiper** (for image carousels)
- **Lucide React & React Icons** (for modern, scalable SVG icons)

### Backend
- **Node.js** & **Express.js** (RESTful API architecture)
- **MongoDB** & **Mongoose** (Database and ODM)
- **JSON Web Tokens (JWT)** (Secure authentication sessions)
- **Bcrypt.js** (Password hashing and security)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aura-properties.git
   cd aura-properties
   ```

2. **Install Server Dependencies:**
   ```bash
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

4. **Environment Variables Setup:**
   Create a `.env` file in the `api` configuration and root directory based on your structure, and add the required variables below:
   
   **Backend (`api/.env`):**
   ```env
   MONGO=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   
   **Frontend (`client/.env`):**
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   ```

5. **Start the Application:**
   Run the backend development server from the root folder:
   ```bash
   npm run dev
   ```
   Open a separate terminal, navigate to the `client` folder, and start the frontend:
   ```bash
   cd client
   npm run dev
   ```


