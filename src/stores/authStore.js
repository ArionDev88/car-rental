import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            role: null,
            userId: null,
            setAuth: (token, role, userId) => set({ token: token, role: role, userId: userId }),
            clearAuth: () => set({ token: null, role: null, userId: null }),
        }),
        {
            name: 'auth-storage', // Unique name for the localStorage key
            storage: createJSONStorage(() => localStorage), // Or sessionStorage if you prefer
            partialize: (state) => ({
                token: state.token,
                role: state.role,
                userId: state.userId,
            }), // Only persist these specific fields
        }
    )
);