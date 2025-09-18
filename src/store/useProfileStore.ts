import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMe,
  updateMe,
  updateFavorites,
  updateAllergies,
  updateDietaryRestrictions,
  updateBannedIngredients,
  type UpdateProfileDto,
} from "../services/profile/profile";
import type { User } from "../services/auth/login";
import { normalizeDietaryRestrictions } from "../utils/dietaryUtils";

type Status = "idle" | "loading" | "success" | "error";

interface ProfileState {
  profile: User | null;
  status: Status;
  error: string | null;

  fetchProfile: () => Promise<void>;
  saveProfile: (data: UpdateProfileDto) => Promise<void>;

  saveFavorites: (items: string[]) => Promise<void>;
  saveAllergies: (items: string[]) => Promise<void>;
  saveDietaryRestrictions: (items: string[]) => Promise<void>;
  saveBannedIngredients: (items: string[]) => Promise<void>;

  clearError: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(persist(
  (set, get) => ({
    profile: null,
    status: "idle",
    error: null,

    async fetchProfile() {
      set({ status: "loading", error: null });
      try {
        const me = await getMe();
        set({ profile: me, status: "success" });
      } catch (e: unknown) {
        set({ status: "error", error: e instanceof Error ? e.message : "No se pudo cargar el perfil" });
      }
    },

    async saveProfile(data) {
      set({ status: "loading", error: null });
      try {
        const updated = await updateMe(data);
        set({ profile: updated, status: "success" });
      } catch (e: unknown) {
        set({ status: "error", error: e instanceof Error ? e.message : "No se pudo actualizar el perfil" });
      }
    },

    async saveFavorites(items) {
      set({ status: "loading", error: null });
      try {
        const res = await updateFavorites(items);
        const curr = get().profile;
        set({
          profile: curr ? { ...curr, favorite_ingredients: res.favorite_ingredients } : curr,
          status: "success"
        });
      } catch (e: unknown) {
        set({ status: "error", error: e instanceof Error ? e.message : "No se pudo actualizar favoritos" });
      }
    },

    async saveAllergies(items) {
      set({ status: "loading", error: null });
      try {
        const res = await updateAllergies(items);
        const curr = get().profile;
        set({
          profile: curr ? { ...curr, allergies: res.allergies } : curr,
          status: "success"
        });
      } catch (e: unknown) {
        set({ status: "error", error: e instanceof Error ? e.message : "No se pudo actualizar alergias" });
      }
    },

    async saveDietaryRestrictions(items) {
      set({ status: "loading", error: null });
      try {
        // Normalizar las restricciones antes de enviar al backend
        const normalizedItems = normalizeDietaryRestrictions(items);
        console.log('🔄 Normalizando restricciones:', items, '->', normalizedItems);
        
        const res = await updateDietaryRestrictions(normalizedItems);
        const curr = get().profile;
        set({
          profile: curr ? { ...curr, dietary_restrictions: res.dietary_restrictions } : curr,
          status: "success"
        });
      } catch (e: unknown) {
        set({ status: "error", error: e instanceof Error ? e.message : "No se pudo actualizar restricciones" });
      }
    },

    async saveBannedIngredients(items) {
      set({ status: "loading", error: null });
      try {
        const res = await updateBannedIngredients(items);
        const curr = get().profile;
        set({
          profile: curr ? { ...curr, banned_ingredients: res.banned_ingredients } : curr,
          status: "success"
        });
      } catch (e: unknown) {
        set({ status: "error", error: e instanceof Error ? e.message : "No se pudo actualizar prohibidos" });
      }
    },

    clearError() { set({ error: null }); },
    reset() { set({ profile: null, status: "idle", error: null }); },
  }),
  { 
    name: "profile-store",
    storage: createJSONStorage(() => AsyncStorage),
  }
));
