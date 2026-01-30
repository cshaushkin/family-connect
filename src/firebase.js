import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATuBaYuiglCbnXfXjJ-MaZUNvoDpPhkxs",
  authDomain: "family-connect-7fd5d.firebaseapp.com",
  projectId: "family-connect-7fd5d",
  storageBucket: "family-connect-7fd5d.firebasestorage.app",
  messagingSenderId: "1009788315603",
  appId: "1:1009788315603:web:be055c4afab96029b07126"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);