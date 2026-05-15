import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBedzyDPgIuN1IfFzFiY1dcHjTorg3bh1M",
  authDomain: "event-booking-system-5ff21.firebaseapp.com",
  projectId: "event-booking-system-5ff21",
  storageBucket: "event-booking-system-5ff21.firebasestorage.app",
  messagingSenderId: "607627525797",
  appId: "1:607627525797:web:e0ff6f42695558a437974c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider =
  new GoogleAuthProvider();