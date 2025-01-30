import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlJXUrZYCrhuBtlx2nN_luSClIwY8nQwQ",
  authDomain: "my-fav-playground.firebaseapp.com",
  projectId: "my-fav-playground",
  storageBucket: "my-fav-playground.firebasestorage.app",
  messagingSenderId: "416484288520",
  appId: "1:416484288520:web:158aad42439f05f7a009bd",
  measurementId: "G-9LLPRS3YC2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
};
