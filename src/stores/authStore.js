import { create } from "zustand";

export const useAuthStore = create((set) => ({
    token: null,
    role: null,
    userId: null,
    setToken: (token) => set({ token }),
    setRole: (role) => set({ role }),
    setUserId: (userId) => set({ userId }),
    clearAuth: () => set({ token: null, role: null, userId: null }),
}));