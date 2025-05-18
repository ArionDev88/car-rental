import { create } from "zustand";
import { getAllBrands } from "../controllers/cars";

export const useBrandsStore = create((set) => ({
    brands: [],
    fetchBrands: async () => {
        try {
            const data = await getAllBrands();
            set({ brands: data });
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    },
}));