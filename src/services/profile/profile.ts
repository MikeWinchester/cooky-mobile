import { useAuthStore } from "../../store/useAuthStore";
import { getAuthHeaders } from "../../utils/auth";
import type { User } from "../../services/auth/login";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_AUTH_PATH = process.env.EXPO_PUBLIC_API_AUTH_URL;

if (!API_BASE_URL || !API_AUTH_PATH) {
  throw new Error("Missing API envs");
}

// Mantener withAuth para compatibilidad con código existente
const withAuth = (extra?: HeadersInit): HeadersInit => {
  const token = useAuthStore.getState().token;
  return {
    Accept: "application/json",
    ...(extra || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helpers
function extractUser(payload: unknown): User {
  const p = payload as any;
  if (p?.data?.user) return p.data.user as User;
  if (p?.user) return p.user as User;
  throw new Error("Invalid profile response structure");
}

// GET /auth/me
export async function getMe(): Promise<User> {
  const res = await fetch(`${API_BASE_URL}${API_AUTH_PATH}/me`, {
    method: "GET",
    headers: withAuth(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} al cargar perfil`);
  return extractUser(data);
}

// PUT /auth/me  
export type UpdateProfileDto = Partial<
  Pick<User, "name" | "dietary_restrictions" | "banned_ingredients" | "favorite_ingredients" | "allergies">
>;

export async function updateMe(payload: UpdateProfileDto): Promise<User> {
  
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("No hay campos válidos para actualizar");
  }
  const res = await fetch(`${API_BASE_URL}${API_AUTH_PATH}/me`, {
    method: "PUT",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} al actualizar perfil`);
  return extractUser(data);
}

// PUT /auth/me/favorites 
export interface FavoritesResponse {
  favorite_ingredients: string[];
  message?: string;
}
export async function updateFavorites(favorite_ingredients: string[]): Promise<FavoritesResponse> {
  const res = await fetch(`${API_BASE_URL}${API_AUTH_PATH}/me/favorites`, {
    method: "PUT",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ favorite_ingredients }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} al actualizar favoritos`);

  return (data?.data ?? data) as FavoritesResponse;
}

// PUT /auth/me/allergies 
export interface AllergiesResponse { allergies: string[]; message?: string; }
export async function updateAllergies(allergies: string[]): Promise<AllergiesResponse> {
  const res = await fetch(`${API_BASE_URL}${API_AUTH_PATH}/me/allergies`, {
    method: "PUT",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ allergies }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} al actualizar alergias`);
  return (data?.data ?? data) as AllergiesResponse;
}

// PUT /auth/me/dietary-restrictions
export interface DietaryResponse { dietary_restrictions: string[]; message?: string; }
export async function updateDietaryRestrictions(dietary_restrictions: string[]): Promise<DietaryResponse> {
  const res = await fetch(`${API_BASE_URL}${API_AUTH_PATH}/me/dietary-restrictions`, {
    method: "PUT",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ dietary_restrictions }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} al actualizar restricciones`);
  return (data?.data ?? data) as DietaryResponse;
}

// PUT /auth/me/banned-ingredients 
export interface BannedResponse { banned_ingredients: string[]; message?: string; }
export async function updateBannedIngredients(banned_ingredients: string[]): Promise<BannedResponse> {
  const res = await fetch(`${API_BASE_URL}${API_AUTH_PATH}/me/banned-ingredients`, {
    method: "PUT",
    headers: withAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ banned_ingredients }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} al actualizar prohibidos`);
  return (data?.data ?? data) as BannedResponse;
}
