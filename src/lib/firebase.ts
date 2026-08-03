import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
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
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

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

