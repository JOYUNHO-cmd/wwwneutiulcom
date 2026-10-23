import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite';
import { dbLite, isMockFirebase } from './firebaseLite';
import { selectRecommendedPortfolio } from './recommendedPortfolio.mjs';
import type { PortfolioItem } from '../types';

// One fresh read per page visit. No auth initialization, live listener or
// localStorage fallback: deleted/unpublished records must not reappear locally.
export async function getPublicPortfolioItems(): Promise<PortfolioItem[]> {
  if (isMockFirebase || !dbLite) return [];
  const snapshot = await getDocs(query(collection(dbLite, 'portfolio'), orderBy('createdAt', 'desc')));
  return selectRecommendedPortfolio(snapshot.docs.map(item => ({ ...item.data(), id: item.id })));
}
