import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, syncUserProfile, UserProfile, signOut } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userRole: 'admin' | 'editor' | 'viewer' | 'demo';
  isLoading: boolean;
  isAdminModalOpen: boolean;
  openAdminModal: (notice?: string) => void;
  closeAdminModal: () => void;
  pendingNotice: string | null;
  loginAsDemo: () => void;
  loginAsHackathonAdmin: () => void;
  logout: () => Promise<void>;
  updateUserRoleInContext: (role: 'admin' | 'editor' | 'viewer' | 'demo') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'viewer' | 'demo'>('demo');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await syncUserProfile(firebaseUser, 'admin');
          setUserProfile(profile);
          setUserRole(profile.role || 'admin');
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setUserRole('admin');
        }
      } else {
        setUser(null);
        setUserProfile(null);
        // Default to demo mode if not authenticated via Firebase
        setUserRole('demo');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAdminModal = (notice?: string) => {
    setPendingNotice(notice || null);
    setIsAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setPendingNotice(null);
  };

  const loginAsDemo = () => {
    setUserRole('demo');
    setIsAdminModalOpen(false);
    setPendingNotice(null);
  };

  const loginAsHackathonAdmin = () => {
    setUserRole('admin');
    setUserProfile({
      uid: 'hackathon-admin-uid',
      name: 'Hackathon Admin (Judge)',
      email: 'admin@productiq.ai',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });
    setIsAdminModalOpen(false);
    setPendingNotice(null);
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setUser(null);
    setUserProfile(null);
    setUserRole('demo');
    setIsAdminModalOpen(false);
  };

  const updateUserRoleInContext = (role: 'admin' | 'editor' | 'viewer' | 'demo') => {
    setUserRole(role);
    if (userProfile) {
      setUserProfile({ ...userProfile, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        userRole,
        isLoading,
        isAdminModalOpen,
        openAdminModal,
        closeAdminModal,
        pendingNotice,
        loginAsDemo,
        loginAsHackathonAdmin,
        logout,
        updateUserRoleInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
