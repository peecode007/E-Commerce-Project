import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAPGyzhn5wDub5mxo-x6xepMZ-FvagktP0",
  authDomain: "ecomm-b7692.firebaseapp.com",
  projectId: "ecomm-b7692"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, 'admin@admin.com', 'admin@123')
  .then(userCredential => userCredential.user.getIdToken())
  .then(token => {
    console.log('ID Token:', token);
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
