// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_AUTH_PATH = process.env.EXPO_PUBLIC_API_AUTH_URL;

if (!API_BASE_URL || !API_AUTH_PATH) {
    throw new Error('API configuration is missing. Please check your environment variables.');
}

import { getAuthHeadersFromStore } from '../../utils/auth';

// ========================================
// INTERFACES
// ========================================

interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

interface SaveRecipeRequest {
    recipe_id: string;
}

interface SavedRecipe {
    recipe_id: string;
    user_id: string;
    saved_at: string;
}

function handleHttpError(status: number, errorText: string): never {
    switch (status) {
        case 400:
            throw new Error('Datos inválidos.');
        case 401:
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        case 403:
            throw new Error('No tienes permisos para realizar esta acción.');
        case 404:
            throw new Error('Recurso no encontrado.');
        case 429:
            throw new Error('Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.');
        case 500:
            throw new Error('Error del servidor. Intenta de nuevo más tarde.');
        default:
            throw new Error(`Error ${status}: ${errorText || 'No se pudo completar la operación'}`);
    }
}

async function apiRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
): Promise<T> {
    try {
        const response = await fetch(endpoint, {
            headers: getAuthHeadersFromStore(),
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            handleHttpError(response.status, errorText);
        }

        const data: ApiResponse<T> = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al procesar la solicitud');
        }

        return data.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error inesperado en la solicitud');
    }
}

// ========================================
// FAVORITES OPERATIONS
// ========================================

// GET /recipes/saved - Obtener recetas guardadas
export async function getSavedRecipes(): Promise<SavedRecipe[]> {
    const data = await apiRequest<{ recipes: SavedRecipe[] }>(`${API_BASE_URL}/recipes/saved`, {
        method: 'GET'
    });
    
    return data.recipes || [];
}

// POST /recipes/save - Guardar receta
export async function saveRecipe(recipe_id: string): Promise<SavedRecipe> {
    if (!recipe_id?.trim()) {
        throw new Error('ID de receta requerido');
    }
    
    console.log('Guardando receta:', recipe_id);
    
    const requestBody: SaveRecipeRequest = { recipe_id };
    
    const data = await apiRequest<{ recipe: SavedRecipe }>(`${API_BASE_URL}/recipes/save`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
    });
    
    return data.recipe;
}

// DELETE /recipes/saved/:recipe_id - Eliminar receta guardada
export async function removeSavedRecipe(recipe_id: string): Promise<string> {
    if (!recipe_id?.trim()) {
        throw new Error('ID de receta requerido');
    }
    
    console.log('Eliminando receta guardada:', recipe_id);
    
    const data = await apiRequest<{ message: string }>(`${API_BASE_URL}/recipes/saved/${recipe_id}`, {
        method: 'DELETE'
    });
    
    return data.message;
}

// Verificar si una receta está guardada usando la lista completa
export async function isRecipeSaved(recipe_id: string): Promise<boolean> {
    if (!recipe_id?.trim()) {
        return false;
    }
    
    try {
        // Obtener todas las recetas guardadas y verificar si la receta está en la lista
        const savedRecipes = await getSavedRecipes();
        return savedRecipes.some(savedRecipe => savedRecipe.recipe_id === recipe_id);
    } catch (error) {
        console.error('Error checking if recipe is saved:', error);
        return false;
    }
}
