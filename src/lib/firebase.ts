import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

// Initialize Firebase
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigData.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigData.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigData.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigData.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);

// Use initializeFirestore with experimentalAutoDetectLongPolling to prevent 10s backend gRPC connection timeouts in container/iframe environments
export const db: Firestore = (() => {
  try {
    const settings = { experimentalAutoDetectLongPolling: true };
    if (firebaseConfig.firestoreDatabaseId) {
      return initializeFirestore(app, settings, firebaseConfig.firestoreDatabaseId);
    }
    return initializeFirestore(app, settings);
  } catch (err) {
    console.warn('initializeFirestore fallback to default getFirestore:', err);
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'viewer' | 'demo';
  createdAt: string;
  lastLogin: string;
}

// Sync or create user profile in Firestore
export async function syncUserProfile(
  user: User,
  desiredRole: 'admin' | 'editor' | 'viewer' | 'demo' = 'admin'
): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      const updatedProfile: UserProfile = {
        ...data,
        name: user.displayName || data.name || user.email?.split('@')[0] || 'Admin User',
        email: user.email || data.email || '',
        photoURL: user.photoURL || data.photoURL || '',
        lastLogin: new Date().toISOString(),
      };
      await updateDoc(userRef, {
        name: updatedProfile.name,
        photoURL: updatedProfile.photoURL,
        lastLogin: updatedProfile.lastLogin,
      });
      return updatedProfile;
    } else {
      const newProfile: UserProfile = {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Admin User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        role: desiredRole,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err) {
    console.warn('Firestore sync failed, using fallback profile:', err);
    return {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Admin User',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: desiredRole,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
  }
}

// Log activity to Firestore
export async function logAdminActivity(action: string, performedBy: string, details: string) {
  try {
    await addDoc(collection(db, 'activityLogs'), {
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString(),
      serverTime: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Could not log activity to Firestore:', e);
  }
}

// Helper to format Firebase errors nicely
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return 'Domain Unauthorized: This web domain is not in your Firebase Authorized Domains list. Please add this domain in Firebase Console (Authentication > Settings > Authorized domains) or use "Instant Admin Sign In (Judge Mode)".';
    case 'auth/popup-blocked':
      return 'Google Sign-In popup was blocked by your browser or iframe security rules. Try allowing pop-ups for this site, or click "Instant Admin Sign In (Judge Mode)" below for 1-click access.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In popup was closed before completing authentication.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    default:
      return 'Authentication failed. Please try again or use Instant Judge Access.';
  }
}

export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
};

export { collection, getDocs, doc, getDoc, setDoc, updateDoc };

