import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAkI_Bw7AU_95p-HiMyAmRwDkhdCbI5aGw",
    authDomain: "react-urpex-auth.firebaseapp.com",
    projectId: "react-urpex-auth",
    storageBucket: "react-urpex-auth.firebasestorage.app",
    messagingSenderId: "800353959642",
    appId: "1:800353959642:web:c6dd04b28ad57af9722fe3"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();