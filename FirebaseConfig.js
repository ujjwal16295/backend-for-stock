import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBTfhuG7hNYrxSYLagpRW3vOcTKI5i2PY0",
  authDomain: "stockmarket-61d33.firebaseapp.com",
  projectId: "stockmarket-61d33",
  storageBucket: "stockmarket-61d33.appspot.com",
  messagingSenderId: "239566915861",
  appId: "1:239566915861:web:806d2b5fcf7408953c011c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db=getFirestore(app)

export const auth=getAuth(app)