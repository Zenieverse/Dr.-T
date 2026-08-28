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
import firebaseConfigData from '../../firebase-applet-config.json';

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

// 1. Health Records Service
export const healthRecordsService = {
  async addRecord(record: Omit<FirestoreHealthRecord, 'id' | 'createdAt'>): Promise<string> {
    try {
      const colRef = collection(db, 'healthRecords');
      const docRef = await addDoc(colRef, {
        ...record,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.warn('Firestore addRecord offline/fallback:', err);
      // Fallback local storage persistence if network offline
      const localId = 'loc_' + Date.now();
      const cached = JSON.parse(localStorage.getItem('drt_firestore_records') || '[]');
      cached.unshift({ id: localId, ...record, createdAt: new Date().toISOString() });
      localStorage.setItem('drt_firestore_records', JSON.stringify(cached));
      return localId;
    }
  },

  async getRecordsByUser(userId: string): Promise<FirestoreHealthRecord[]> {
    try {
      const colRef = collection(db, 'healthRecords');
      const q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      const list: FirestoreHealthRecord[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      if (list.length > 0) {
        localStorage.setItem('drt_firestore_records', JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, using cached records:', err);
    }
    // Return cached/initial local records
    const cached = localStorage.getItem('drt_firestore_records');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  subscribeRecords(userId: string, callback: (records: FirestoreHealthRecord[]) => void) {
    try {
      const colRef = collection(db, 'healthRecords');
      const q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const records: FirestoreHealthRecord[] = [];
        snapshot.forEach((doc) => {
          records.push({ id: doc.id, ...(doc.data() as any) });
        });
        callback(records);
      }, (error) => {
        console.warn('Firestore snapshot listener error:', error);
      });
    } catch (e) {
      console.warn('Could not establish real-time listener:', e);
      return () => {};
    }
  }
};

// 2. Consultation Sessions Service
export const consultationService = {
  async saveConsultation(consultation: Omit<FirestoreConsultation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const colRef = collection(db, 'consultations');
      const docRef = await addDoc(colRef, {
        ...consultation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.warn('Firestore saveConsultation offline/fallback:', err);
      const localId = 'con_' + Date.now();
      const cached = JSON.parse(localStorage.getItem('drt_firestore_consultations') || '[]');
      cached.unshift({ id: localId, ...consultation, createdAt: new Date().toISOString() });
      localStorage.setItem('drt_firestore_consultations', JSON.stringify(cached));
      return localId;
    }
  },

  async getRecentConsultations(userId: string): Promise<FirestoreConsultation[]> {
    try {
      const colRef = collection(db, 'consultations');
      const q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      const list: FirestoreConsultation[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
      return list;
    } catch (err) {
      console.warn('Firestore getRecentConsultations fallback:', err);
      const cached = localStorage.getItem('drt_firestore_consultations');
      return cached ? JSON.parse(cached) : [];
    }
  }
};

// 3. Skin Analyses Service
export const skinAnalysisService = {
  async saveAnalysis(analysis: Omit<FirestoreSkinAnalysis, 'id'>): Promise<string> {
    try {
      const colRef = collection(db, 'skinAnalyses');
      const docRef = await addDoc(colRef, {
        ...analysis,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.warn('Firestore saveAnalysis fallback:', err);
      return 'skin_' + Date.now();
    }
  }
};

// 4. Cloud Infrastructure Audit Logs Service
export const cloudAuditService = {
  async logCloudEvent(event: Omit<FirestoreCloudAuditLog, 'id' | 'timestamp'>): Promise<void> {
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
