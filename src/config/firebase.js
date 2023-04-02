import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtvOuJ1qHacVH0Xv1BBTJQl9VaIvb_Rtk",
  authDomain: "eldar-portfolio.firebaseapp.com",
  projectId: "eldar-portfolio",
  storageBucket: "eldar-portfolio.appspot.com",
  messagingSenderId: "166604757151",
  appId: "1:166604757151:web:eb5875c33c4a99405beaaa"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);