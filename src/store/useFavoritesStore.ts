import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getSavedRecipes, saveRecipe, removeSavedRecipe, isRecipeSaved } from '../services/recipes/favorites';

interface SavedRecipe {
    recipe_id: string;
    user_id: string;
    saved_at: string;
}

interface FavoritesState {
    success: boolean;
    message?: string;
    savedRecipes: SavedRecipe[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    getSavedRecipes: () => Promise<void>;
    saveRecipe: (recipe_id: string) => Promise<void>;
    removeSavedRecipe: (recipe_id: string) => Promise<void>;
    isRecipeSaved: (recipe_id: string) => Promise<boolean>;
    clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            success: false,
            message: undefined,
            savedRecipes: [],
            isLoading: false,
            error: null,

            async getSavedRecipes() {
                set({ isLoading: true, error: null });
                try {
                    const recipes = await getSavedRecipes();
                    set({
                        savedRecipes: recipes,
                        success: true,
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al obtener recetas guardadas',
                        success: false,
                        isLoading: false
                    });
                }
            },

            async saveRecipe(recipe_id: string) {
                set({ isLoading: true, error: null });
                try {
                    const savedRecipe = await saveRecipe(recipe_id);
                    const currentRecipes = get().savedRecipes;
                    set({
                        savedRecipes: [...currentRecipes, savedRecipe],
                        success: true,
                        message: 'Receta guardada exitosamente',
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al guardar receta',
                        success: false,
                        isLoading: false
                    });
                }
            },

            async removeSavedRecipe(recipe_id: string) {
                set({ isLoading: true, error: null });
                try {
                    await removeSavedRecipe(recipe_id);
                    const currentRecipes = get().savedRecipes;
                    set({
                        savedRecipes: currentRecipes.filter(recipe => recipe.recipe_id !== recipe_id),
                        success: true,
                        message: 'Receta eliminada de favoritos',
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al eliminar receta',
                        success: false,
                        isLoading: false
                    });
                }
            },

            async isRecipeSaved(recipe_id: string) {
                try {
                    return await isRecipeSaved(recipe_id);
                } catch (error) {
                    console.error('Error checking if recipe is saved:', error);
                    return false;
                }
            },

            clearError() {
                set({ error: null });
            }
        }),
        {
            name: 'favorites-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                savedRecipes: state.savedRecipes
            })
        }
    )
);

