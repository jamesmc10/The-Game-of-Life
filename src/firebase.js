import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5LxYV-OqyNIvGY6fF9vV9wkF0eWR5Yek",
  authDomain: "the-game-of-life-3d2ec.firebaseapp.com",
  projectId: "the-game-of-life-3d2ec",
  storageBucket: "the-game-of-life-3d2ec.firebasestorage.app",
  messagingSenderId: "364651210456",
  appId: "1:364651210456:web:e2a35491153d755dcf99ad",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
