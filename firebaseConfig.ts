
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQdp6ZdH2B9OfdM1mZw0Rocy_9IL9CnJY",
  authDomain: "thesource-bolivia-app.firebaseapp.com",
  projectId: "thesource-bolivia-app",
  storageBucket: "thesource-bolivia-app.firebasestorage.app",
  messagingSenderId: "160309591714",
  appId: "1:160309591714:web:974fe0e05b687cb803a1fb",
  measurementId: "G-Q0ZJY1X2JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { storage, auth, db, googleProvider, facebookProvider, signInWithPopup };
