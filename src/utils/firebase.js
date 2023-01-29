// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIjYb6IjcOxVsoKGtTC1RNRDUw1aTjhBE",
  authDomain: "stock-prodigy.firebaseapp.com",
  projectId: "stock-prodigy",
  storageBucket: "stock-prodigy.appspot.com",
  messagingSenderId: "209068419277",
  appId: "1:209068419277:web:843da2ff8fdc3abc4ba184",
  measurementId: "G-JLZKRP5E8G",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

export const provider = new GoogleAuthProvider();
