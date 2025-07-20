import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // For demo purposes - in production, use environment variables
  apiKey: "demo-api-key",
  authDomain: "smart-learning-system.firebaseapp.com",
  databaseURL: "https://smart-learning-system-default-rtdb.firebaseio.com",
  projectId: "smart-learning-system",
  storageBucket: "smart-learning-system.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);