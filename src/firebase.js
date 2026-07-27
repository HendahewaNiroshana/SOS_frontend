import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBx6PVv6o3TDpDmw40UESn2N0mIrcYgxOU",
  authDomain: "quizbattle-dcbd1.firebaseapp.com",
  databaseURL: "https://quizbattle-dcbd1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizbattle-dcbd1",
  storageBucket: "quizbattle-dcbd1.firebasestorage.app",
  messagingSenderId: "201183537404",
  appId: "1:201183537404:web:fa8edb0f959fe6efb70f79"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);