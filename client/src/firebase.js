// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-71bf5.firebaseapp.com",
  projectId: "realestate-71bf5",
  storageBucket: "realestate-71bf5.firebasestorage.app",
  messagingSenderId: "244690951316",
  appId: "1:244690951316:web:cee283d985e2d3f3d56881",
  measurementId: "G-HD6M07Z2PH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);