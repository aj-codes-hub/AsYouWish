// src/firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,  // ← YEH IMPORT KAREIN
  signInWithEmailAndPassword       // ← OPTIONAL: login ke liye
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDP8pfMuEracNOANmoaqSSlOESNJVz7QFg",
  authDomain: "as-you-wish-auth.firebaseapp.com",
  projectId: "as-you-wish-auth",
  storageBucket: "as-you-wish-auth.firebasestorage.app",
  messagingSenderId: "181720290076",
  appId: "1:181720290076:web:c85f0de0d234da84bf20d9",
  measurementId: "G-TTGZBE04BT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ✅ SIGNUP FUNCTION
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email,
    };
  } catch (error: any) {
    console.error("Signup Error:", error.code, error.message);
    throw error;
  }
};

// ✅ LOGIN FUNCTION (optional)
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email,
    };
  } catch (error: any) {
    console.error("Login Error:", error.code, error.message);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return {
    id: result.user.uid,
    name: result.user.displayName || 'User',
    email: result.user.email || '',
    photoURL: result.user.photoURL || '',
    provider: 'google' as const,
  };
};

export const signOutUser = async () => {
  await signOut(auth);
};

export { auth };