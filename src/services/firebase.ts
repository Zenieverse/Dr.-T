import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { firebaseRuntimeConfig as firebaseConfigData } from '../config/firebaseRuntimeConfig';

// Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp({
    projectId: firebaseConfigData.projectId,
    appId: firebaseConfigData.appId,
    apiKey: firebaseConfigData.apiKey,
    authDomain: firebaseConfigData.authDomain,
    storageBucket: firebaseConfigData.storageBucket,
    messagingSenderId: firebaseConfigData.messagingSenderId,
  });
} else {
  app = getApp();
}

// Initialize Firestore with custom database ID if specified
export const db: Firestore = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.warn('Firebase Google Sign-In note:', error);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn('Firebase Sign-Out error:', error);
  }
}

export function subscribeAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getFirebaseIdToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

export { app };

// Data interfaces
export interface FirestoreHealthRecord {
  id?: string;
  userId: string;
  type: 'symptom' | 'lab' | 'medication' | 'wearable' | 'encounter';
  title: string;
  value: string;
  unit?: string;
  category: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  timestamp: any;
  notes?: string;
  createdAt?: any;
}

export interface FirestoreConsultation {
  id?: string;
  userId: string;
  title: string;
  triageTier: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  messagesCount: number;
  soapSummary?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreSkinAnalysis {
  id?: string;
  userId: string;
  overallScore: number;
  hydrationLevel: number;
  barrierIntegrity: number;
  concerns: string[];
  recommendations: string[];
  timestamp: any;
}

export interface FirestoreCloudAuditLog {
  id?: string;
  service: 'Firestore' | 'Cloud Run' | 'Pub/Sub' | 'Cloud Storage' | 'GKE';
  event: string;
  status: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  latencyMs: number;
  timestamp: any;
}

const GUEST_RECORDS_KEY = 'drt_firestore_records';
const GUEST_CONSULTATIONS_KEY = 'drt_firestore_consultations';
const DEFAULT_GUEST_RECORDS: FirestoreHealthRecord[] = [
  {
    id: 'guest_rec_1',
    userId: 'guest_demo',
    type: 'lab',
    title: 'Comprehensive Metabolic & Iron Panel',
    value: 'Ferritin 34 ng/mL',
    category: 'Metabolic & Biomarkers',
    severity: 'mild',
    timestamp: '2026-08-25T09:15:00.000Z',
    notes: 'Guest Sandbox sample biomarker record (synced locally).',
    createdAt: '2026-08-25T09:15:00.000Z',
  },
  {
    id: 'guest_rec_2',
    userId: 'guest_demo',
    type: 'wearable',
    title: 'Overnight HRV & Recovery',
    value: '52 ms RMSSD',
    category: 'Clinical Stream',
    severity: 'normal',
    timestamp: '2026-08-26T06:30:00.000Z',
    notes: 'Guest Sandbox continuous wearable trend.',
    createdAt: '2026-08-26T06:30:00.000Z',
  },
];

const localRecordListeners = new Set<(records: FirestoreHealthRecord[]) => void>();

function readLocalHealthRecords(): FirestoreHealthRecord[] {
  try {
    const raw = localStorage.getItem(GUEST_RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    localStorage.setItem(GUEST_RECORDS_KEY, JSON.stringify(DEFAULT_GUEST_RECORDS));
    return [...DEFAULT_GUEST_RECORDS];
  } catch {
    return [...DEFAULT_GUEST_RECORDS];
  }
}

function writeLocalHealthRecords(records: FirestoreHealthRecord[]): void {
  try {
    localStorage.setItem(GUEST_RECORDS_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors
  }
  localRecordListeners.forEach((cb) => cb(records));
}

// 1. Health Records Service
export const healthRecordsService = {
  async addRecord(record: Omit<FirestoreHealthRecord, 'id' | 'createdAt'>): Promise<string> {
    if (auth.currentUser) {
      try {
        const colRef = collection(db, 'healthRecords');
        const docRef = await addDoc(colRef, {
          ...record,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });
        return docRef.id;
      } catch (err) {
        console.warn('Firestore addRecord offline/fallback:', err);
      }
    }

    const localId = 'loc_' + Date.now();
    const cached = readLocalHealthRecords();
    const next = [{ id: localId, ...record, createdAt: new Date().toISOString() }, ...cached];
    writeLocalHealthRecords(next);
    return localId;
  },

  async getRecordsByUser(userId: string): Promise<FirestoreHealthRecord[]> {
    if (auth.currentUser) {
      try {
        const effectiveUid = auth.currentUser.uid;
        const colRef = collection(db, 'healthRecords');
        const q = query(colRef, where('userId', '==', effectiveUid), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        const list: FirestoreHealthRecord[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) });
        });
        if (list.length > 0) {
          writeLocalHealthRecords(list);
          return list;
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using cached records:', err);
      }
    }
    return readLocalHealthRecords();
  },

  subscribeRecords(userId: string, callback: (records: FirestoreHealthRecord[]) => void) {
    if (auth.currentUser) {
      try {
        const effectiveUid = auth.currentUser.uid;
        const colRef = collection(db, 'healthRecords');
        const q = query(colRef, where('userId', '==', effectiveUid), orderBy('createdAt', 'desc'), limit(50));
        return onSnapshot(q, (snapshot) => {
          const records: FirestoreHealthRecord[] = [];
          snapshot.forEach((d) => {
            records.push({ id: d.id, ...(d.data() as any) });
          });
          callback(records);
        }, (error) => {
          console.warn('Firestore snapshot listener fallback:', error);
          callback(readLocalHealthRecords());
        });
      } catch (e) {
        console.warn('Could not establish real-time listener:', e);
      }
    }

    // Guest Sandbox mode: immediate local hydrate + reactive updates
    localRecordListeners.add(callback);
    callback(readLocalHealthRecords());
    return () => {
      localRecordListeners.delete(callback);
    };
  }
};

// 2. Consultation Sessions Service
export const consultationService = {
  async saveConsultation(consultation: Omit<FirestoreConsultation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (auth.currentUser) {
      try {
        const colRef = collection(db, 'consultations');
        const docRef = await addDoc(colRef, {
          ...consultation,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return docRef.id;
      } catch (err) {
        console.warn('Firestore saveConsultation offline/fallback:', err);
      }
    }

    const localId = 'con_' + Date.now();
    try {
      const cached = JSON.parse(localStorage.getItem(GUEST_CONSULTATIONS_KEY) || '[]');
      cached.unshift({ id: localId, ...consultation, createdAt: new Date().toISOString() });
      localStorage.setItem(GUEST_CONSULTATIONS_KEY, JSON.stringify(cached));
    } catch {
      // Ignore storage quota errors
    }
    return localId;
  },

  async getRecentConsultations(userId: string): Promise<FirestoreConsultation[]> {
    if (auth.currentUser) {
      try {
        const colRef = collection(db, 'consultations');
        const q = query(colRef, where('userId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(20));
        const snap = await getDocs(q);
        const list: FirestoreConsultation[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
        return list;
      } catch (err) {
        console.warn('Firestore getRecentConsultations fallback:', err);
      }
    }
    try {
      const cached = localStorage.getItem(GUEST_CONSULTATIONS_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }
};

// 3. Skin Analyses Service
export const skinAnalysisService = {
  async saveAnalysis(analysis: Omit<FirestoreSkinAnalysis, 'id'>): Promise<string> {
    if (auth.currentUser) {
      try {
        const colRef = collection(db, 'skinAnalyses');
        const docRef = await addDoc(colRef, {
          ...analysis,
          userId: auth.currentUser.uid,
          timestamp: serverTimestamp(),
        });
        return docRef.id;
      } catch (err) {
        console.warn('Firestore saveAnalysis fallback:', err);
      }
    }
    return 'skin_' + Date.now();
  }
};

// 4. Cloud Infrastructure Audit Logs Service
export const cloudAuditService = {
  async logCloudEvent(event: Omit<FirestoreCloudAuditLog, 'id' | 'timestamp'>): Promise<void> {
    if (!auth.currentUser) return;
    try {
      const colRef = collection(db, 'cloudAuditLogs');
      await addDoc(colRef, {
        ...event,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.debug('Cloud audit log note:', err);
    }
  }
};
