import { initializeApp } from "firebase/app";
import firebaseConfig from "@/config/firebase";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(firebase);
export const auth = getAuth();
export const storage = getStorage();
