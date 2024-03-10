// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-6c0d9.firebaseapp.com",
  projectId: "mern-blog-6c0d9",
  storageBucket: "mern-blog-6c0d9.appspot.com",
  messagingSenderId: "398937963738",
  appId: "1:398937963738:web:1a0ea0a2da7a7dc12df9e3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);