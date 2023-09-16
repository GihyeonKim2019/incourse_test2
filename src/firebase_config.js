// firebase_config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkcvDwSFYkqAfclarIAdWrP1kaSIX3nxI",
  authDomain: "incourse-test.firebaseapp.com",
  projectId: "incourse-test",
  storageBucket: "incourse-test.appspot.com",
  messagingSenderId: "347890592542",
  appId: "1:347890592542:web:ad83bc846810cb5937770f",
  measurementId: "G-C7T5HM3QCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

// Get services
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => signInWithPopup(auth, provider);
