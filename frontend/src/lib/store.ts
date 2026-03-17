/**
 * Zustand Store for Client State Management
 * Handles UI state, user preferences, and client-side data
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'payer_individual' | 'payer_company' | 'amil' | 'admin' | 'super_admin';
  is_verified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// Auth Store with middleware to always sync isAuthenticated
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Rehydrate: Sync isAuthenticated with user and token after loading from localStorage
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          // Always set isAuthenticated based on whether user and token exist
          const isAuthenticated = !!(state.user && state.token);
          // Update state synchronously if needed
          if (state.isAuthenticated !== isAuthenticated) {
            // Use getState and setState to update
            const currentState = useAuthStore.getState();
            useAuthStore.setState({ 
              ...currentState,
              user: state.user,
              token: state.token,
              isAuthenticated 
            });
          }
        }
      },
    }
  )
);

// Middleware to always sync isAuthenticated with user and token
// This ensures isAuthenticated is always correct even if state gets out of sync
useAuthStore.subscribe(
  (state) => {
    const computedAuth = !!(state.user && state.token);
    if (state.isAuthenticated !== computedAuth) {
      useAuthStore.setState({ isAuthenticated: computedAuth });
    }
  }
);

// Selector hook for computed isAuthenticated (always syncs with user and token)
export const useIsAuthenticated = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  return !!(user && token);
};

// Hook to check if store has been hydrated from localStorage
export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    // If already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    return () => { unsub(); };
  }, []);
  return hasHydrated;
};

// UI Store
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

