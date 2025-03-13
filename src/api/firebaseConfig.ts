// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc1deiIoIwU54xdCZUG28UI3yB-rBboYo",
  authDomain: "mindcaf-app.firebaseapp.com",
  databaseURL: "https://mindcaf-app-default-rtdb.firebaseio.com",
  projectId: "mindcaf-app",
  storageBucket: "mindcaf-app.firebasestorage.app",
  messagingSenderId: "183711751066",
  appId: "1:183711751066:web:55962354117dd52539f823",
  measurementId: "G-1RM235H9ZF"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

export { database };

// Initialize Firestore
export const db = getFirestore(app);

// Use the `collection` function with the Firestore instance
