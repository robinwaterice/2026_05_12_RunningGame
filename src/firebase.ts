import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWon40wCn_y-JLpamramDdW7ChGQ-GhXY",
  authDomain: "chameleon-runner-3697e.firebaseapp.com",
  projectId: "chameleon-runner-3697e",
  storageBucket: "chameleon-runner-3697e.firebasestorage.app",
  messagingSenderId: "98329052293",
  appId: "1:98329052293:web:4e1fdea13b66924d1355ec",
  measurementId: "G-XR3L77NW4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
