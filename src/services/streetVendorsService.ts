import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  increment,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { StreetVendor } from '../components/streetvendors/types';

const VENDOR_CONTRIBUTIONS_COLLECTION = 'street_vendor_contributions';
const LOCAL_STORAGE_CONTRIBUTIONS_KEY = 'dr_t_street_vendor_contributions_v1';

// In-memory fallback cache
let inMemoryContributions: StreetVendor[] = [];

function getStoredContributions(): StreetVendor[] {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_CONTRIBUTIONS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {
    // fallback
  }
  return inMemoryContributions;
}

function setStoredContributions(items: StreetVendor[]) {
  inMemoryContributions = items;
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_CONTRIBUTIONS_KEY, JSON.stringify(items));
    }
  } catch {
    // fallback
  }
}

export class StreetVendorsService {
  /**
   * Realtime subscription to community contributions from Dr. T platform
   * Powered by Firebase Firestore onSnapshot
   */
  static subscribeToRealtimeContributions(
    onVendorsUpdate: (vendors: StreetVendor[]) => void,
    onError?: (error: any) => void
  ): () => void {
    try {
      const q = query(
        collection(db, VENDOR_CONTRIBUTIONS_COLLECTION)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteVendors: StreetVendor[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteVendors.push({
              id: docSnap.id,
              ...data
            } as StreetVendor);
          });

          // Update local cache
          if (remoteVendors.length > 0) {
            setStoredContributions(remoteVendors);
          }
          onVendorsUpdate(remoteVendors);
        },
        (err) => {
          console.warn('[StreetVendorsService] Firestore realtime snapshot error, using cached contributions:', err);
          if (onError) onError(err);
          onVendorsUpdate(getStoredContributions());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('[StreetVendorsService] Realtime listener initialization failed:', err);
      onVendorsUpdate(getStoredContributions());
      return () => {};
    }
  }

  /**
   * Save a newly contributed street vendor to Firestore in real-time
   */
  static async saveContribution(vendor: StreetVendor): Promise<void> {
    const enrichedVendor: StreetVendor = {
      ...vendor,
      source: vendor.source || 'drt_community',
      contributedAt: vendor.contributedAt || new Date().toISOString()
    };

    // Optimistically update local cache
    const current = getStoredContributions();
    const existingIdx = current.findIndex(v => v.id === enrichedVendor.id);
    if (existingIdx >= 0) {
      current[existingIdx] = enrichedVendor;
    } else {
      current.unshift(enrichedVendor);
    }
    setStoredContributions(current);

    // Save to Firestore
    try {
      await setDoc(doc(db, VENDOR_CONTRIBUTIONS_COLLECTION, enrichedVendor.id), enrichedVendor, { merge: true });
    } catch (err) {
      console.warn('[StreetVendorsService] Firestore save contribution failed, preserved locally:', err);
    }
  }

  /**
   * Like / Send Love to a Street Vendor (realtime increment)
   */
  static async likeVendor(vendorId: string, currentLikes: number): Promise<void> {
    // Update local cache
    const current = getStoredContributions();
    const target = current.find(v => v.id === vendorId);
    if (target) {
      target.likesCount = (target.likesCount || currentLikes) + 1;
      setStoredContributions(current);
    }

    try {
      const docRef = doc(db, VENDOR_CONTRIBUTIONS_COLLECTION, vendorId);
      await updateDoc(docRef, {
        likesCount: increment(1)
      });
    } catch (err) {
      // If doc does not exist yet (e.g. initial seed vendor), create with incremented likes
      try {
        await setDoc(doc(db, VENDOR_CONTRIBUTIONS_COLLECTION, vendorId), {
          id: vendorId,
          likesCount: currentLikes + 1,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('[StreetVendorsService] Like update failed:', e);
      }
    }
  }

  /**
   * Verify a street vendor (community confirmation vote)
   */
  static async verifyVendor(vendorId: string, currentVerifications: number): Promise<void> {
    const current = getStoredContributions();
    const target = current.find(v => v.id === vendorId);
    if (target) {
      target.verifiedByCount = (target.verifiedByCount || currentVerifications) + 1;
      target.verified = true;
      setStoredContributions(current);
    }

    try {
      const docRef = doc(db, VENDOR_CONTRIBUTIONS_COLLECTION, vendorId);
      await updateDoc(docRef, {
        verifiedByCount: increment(1),
        verified: true,
        verificationDate: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      try {
        await setDoc(doc(db, VENDOR_CONTRIBUTIONS_COLLECTION, vendorId), {
          id: vendorId,
          verifiedByCount: currentVerifications + 1,
          verified: true,
          verificationDate: new Date().toISOString().split('T')[0]
        }, { merge: true });
      } catch (e) {
        console.warn('[StreetVendorsService] Verification update failed:', e);
      }
    }
  }

  /**
   * Fetch live synchronization updates from ganhmuusinh.vn via server proxy
   */
  static async syncFromGanhMuuSinh(): Promise<{
    vendors: StreetVendor[];
    isExternalLive: boolean;
    timestamp: string;
    source: string;
    statusMessageVI: string;
    statusMessageEN: string;
  }> {
    try {
      const res = await fetch('/api/street-vendors/sync-ganhmuusinh');
      if (res.ok) {
        const data = await res.json();
        return {
          vendors: data.vendors || [],
          isExternalLive: Boolean(data.isExternalLive),
          timestamp: data.timestamp || new Date().toISOString(),
          source: data.source || 'https://ganhmuusinh.vn/',
          statusMessageVI: data.statusMessageVI || 'Đồng bộ từ ganhmuusinh.vn thành công',
          statusMessageEN: data.statusMessageEN || 'Successfully synced from ganhmuusinh.vn'
        };
      }
    } catch (err) {
      console.warn('[StreetVendorsService] Fetching ganhmuusinh.vn sync failed, falling back:', err);
    }

    return {
      vendors: [],
      isExternalLive: false,
      timestamp: new Date().toISOString(),
      source: 'https://ganhmuusinh.vn/',
      statusMessageVI: 'Đang kết nối lại với ganhmuusinh.vn...',
      statusMessageEN: 'Reconnecting to ganhmuusinh.vn...'
    };
  }
}
