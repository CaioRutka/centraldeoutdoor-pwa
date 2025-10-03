import { create } from 'zustand';
import { api } from '../services/api';
import { storage } from '../services/storage';

interface StoredUser {
  _id: string;
  email: string;
  role: string;
  profile: { name: string; company: string; position: string; phone: string; cpf: string };
}

interface AuthState {
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.login(email, password);
      const { user, token } = res;
      await storage.setToken(token);
      await storage.setUser(user);
      api.setToken(token);
      api.setCurrentUserEmail(user.email);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: e.message || 'Erro de login' });
      throw e;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await storage.clear();
    api.setToken(null);
    api.setCurrentUserEmail(null);
    set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });
    const token = await storage.getToken();
    const user = await storage.getUser();
    if (token && user) {
      api.setToken(token);
      api.setCurrentUserEmail(user.email);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));


