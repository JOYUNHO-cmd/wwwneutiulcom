import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, signOut, onIdTokenChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';
import { isVerifiedAdmin } from '../lib/adminPolicy.mjs';

export interface AdminUser { email: string; displayName: string; photoURL: string; }
interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  login: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // The old UI-only session must never grant authority.
    try { localStorage.removeItem('neutiul_admin_session'); } catch { /* Storage may be disabled. */ }
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    getFirebaseAuth().then(auth => {
      if (cancelled) return;
      if (!auth) { setLoading(false); return; }
      unsubscribe = onIdTokenChanged(auth, firebaseUser => {
        if (cancelled) return;
        setUser(isVerifiedAdmin(firebaseUser) ? {
          email: firebaseUser!.email!,
          displayName: firebaseUser!.displayName || '느티울 관리자',
          photoURL: firebaseUser!.photoURL || '',
        } : null);
        setLoading(false);
      }, () => {
        if (!cancelled) { setUser(null); setLoading(false); }
      });
    }).catch(() => {
      if (!cancelled) { setUser(null); setLoading(false); }
    });
    return () => { cancelled = true; unsubscribe?.(); };
  }, []);
  const authenticate = async (email?: string, password?: string) => {
    setLoading(true);
    setUser(null);
    try {
      const auth = await getFirebaseAuth();
      if (!auth) throw new Error('인증 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.');
      const result = email !== undefined
        ? await signInWithEmailAndPassword(auth, email.trim(), password || '')
        : await signInWithPopup(auth, new GoogleAuthProvider());
      if (!isVerifiedAdmin(result.user)) {
        await signOut(auth);
        throw new Error('인증된 관리자 계정으로 로그인해 주세요.');
      }
    } finally { setLoading(false); }
  };
  const loginWithCredentials = async (email: string, password: string) => {
    try { await authenticate(email, password); return true; }
    catch { return false; }
  };
  const logout = async () => {
    setUser(null);
    const auth = await getFirebaseAuth();
    if (auth) await signOut(auth);
  };
  return <AuthContext.Provider value={{ user, isAdmin: user !== null, loading, loginWithCredentials, logout, login: () => authenticate() }}>
    {children}
  </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
