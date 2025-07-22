// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPGyzhn5wDub5mxo-x6xepMZ-FvagktP0",
  authDomain: "ecomm-b7692.firebaseapp.com",
  projectId: "ecomm-b7692"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
