import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isMockFirebase, getCachedAuth } from './firebase';
import { isVerifiedAdmin } from './adminPolicy.mjs';
import { SERVICES } from './servicesData.mjs';
import { serviceEditPayload } from './serviceOverrides.mjs';

export async function updateServiceDoc(id: string, data: unknown) {
  requireAdmin();
  if (!SERVICES.some(service => service.id === id)) throw new Error('등록된 서비스를 선택해 주세요.');
  await setDoc(doc(db, 'services', id), serviceEditPayload(data), { merge: true });
}

function requireAdmin() {
  if (isMockFirebase || !db || !isVerifiedAdmin(getCachedAuth()?.currentUser)) {
    throw new Error('인증된 관리자만 저장할 수 있습니다.');
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const auth = getCachedAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Mock database state & listeners
let mockPortfolioListeners: ((items: any[]) => void)[] = [];

function getLocalPortfolioItems(): any[] {
  const stored = localStorage.getItem('neutiul_portfolio_items');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse local portfolio items:", e);
    }
  }
  return [];
}

// Company Info Operations
export async function getCompanyInfo() {
  const oldLogo1 = 'https://i.ibb.co/kVzK83Kf/image.png';
  const oldLogo2 = 'https://i.ibb.co/Ldcq4XMr/image.png';
  const newLogo = 'https://www.neutiul.com/images/logo.webp';

  if (isMockFirebase) {
    const stored = localStorage.getItem('neutiul_company_info');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.logo === oldLogo1 || parsed.logo === oldLogo2 || !parsed.logo)) {
          parsed.logo = newLogo;
          localStorage.setItem('neutiul_company_info', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse local company info:", e);
      }
    }
    return null;
  }

  const path = 'company/info';
  try {
    const docRef = doc(db, 'company', 'info');
    const d = await getDoc(docRef);
    if (d.exists()) {
      const data = d.data();
      if (data && (data.logo === oldLogo1 || data.logo === oldLogo2 || !data.logo)) {
        data.logo = newLogo;
      }
      return data;
    }
    return null;
  } catch (error) {
    console.warn("Company info document does not exist yet:", error);
    return null;
  }
}

export async function updateCompanyInfoDoc(data: any) {
  requireAdmin();

  const path = 'company/info';
  try {
    const docRef = doc(db, 'company', 'info');
    await setDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Portfolio Operations
export async function getPortfolioItems() {
  if (isMockFirebase) {
    return getLocalPortfolioItems();
  }

  const path = 'portfolio';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function addPortfolioItem(data: any) {
  requireAdmin();

  const path = 'portfolio';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePortfolioItem(id: string, data: any) {
  requireAdmin();

  const path = `portfolio/${id}`;
  try {
    await updateDoc(doc(db, 'portfolio', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePortfolioItem(id: string) {
  requireAdmin();

  const path = `portfolio/${id}`;
  try {
    await deleteDoc(doc(db, 'portfolio', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Live Subscribe Portfolio Items
export function subscribePortfolioItems(callback: (items: any[]) => void): () => void {
  if (isMockFirebase) {
    mockPortfolioListeners.push(callback);
    callback(getLocalPortfolioItems());
    return () => {
      mockPortfolioListeners = mockPortfolioListeners.filter(cb => cb !== callback);
    };
  } else {
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(items);
      },
      (error) => {
        console.warn("Firestore portfolio list error, falling back to local items:", error);
        callback(getLocalPortfolioItems());
        handleFirestoreError(error, OperationType.LIST, 'portfolio');
      }
    );
  }
}
