import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

// Initialize Firebase using the provisioned configuration or environment variables
const config = {
  apiKey: appletConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForMultiTenantAppInitialization",
  authDomain: appletConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0041223180.firebaseapp.com",
  projectId: appletConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0041223180",
  storageBucket: appletConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0041223180.firebasestorage.app",
  messagingSenderId: appletConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "391239055640",
  appId: appletConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID || "1:391239055640:web:457ac758c86ca374f6066d"
};

const app = !getApps().length ? initializeApp(config) : getApp();
export const auth = getAuth(app);

// Use custom Firestore Database ID if specified
const firestoreDbId = appletConfig?.firestoreDatabaseId && appletConfig.firestoreDatabaseId !== '(default)' 
  ? appletConfig.firestoreDatabaseId 
  : undefined;

export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const isFirebaseConfigured = Boolean(appletConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID);
export const firebaseProjectId = config.projectId;
export const firestoreDatabaseName = firestoreDbId || '(default)';

/**
 * Recursively removes all keys with `undefined` values from an object or array,
 * ensuring it is 100% safe for Firestore operations (setDoc, updateDoc, addDoc).
 */
export function cleanFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  
  if (typeof data === 'object') {
    if (data instanceof Date) {
      return data.toISOString() as unknown as T;
    }
    
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        cleaned[key] = cleanFirestoreData(val);
      }
    }
    return cleaned as T;
  }
  
  return data;
}

