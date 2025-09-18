import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para parsear steps JSON strings a objetos Step
export function parseSteps(stepsArray: string[]): Step[] {
  return stepsArray.map(stepString => {
    try {
      const parsed = JSON.parse(stepString);
      return {
        order: parsed.order || 1,
        step: parsed.step || '',
        time: parsed.time
      };
    } catch (error) {
      console.error('Error parsing step:', stepString, error);
      return {
        order: 1,
        step: stepString,
        time: undefined
      };
    }
  }).sort((a, b) => a.order - b.order); // Ordenar por order
}

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    svg: string;
    is_optional: boolean;
}

export interface Step {
    order: number;
    step: string;
    time?: number;
}

import type { Recipe } from '../types';

interface RecipesState {
    success: boolean;
    message?: string;
    recipes: Recipe[];
    isLoading: boolean;
    error: string | null;
    ingredients: string[];
    lastSearchedIngredients: string[];
    searchRecipes: (ingredients: string[]) => Promise<void>;
    addIngredient: (ingredientName: string) => void;
    getIngredients: () => string[];
    removeIngredient: (ingredientName: string) => void;
    clearIngredients: () => void;
    clearError: () => void;
    hasIngredient: (ingredientName: string) => boolean;
    getIngredientsCount: () => number;
}

export const useRecipesStore = create<RecipesState>()(
    persist(
        (set, get) => ({
            success: false,
            message: '',
            recipes: [],
            isLoading: false,
            error: null,
            ingredients: [],
            lastSearchedIngredients: [],

            searchRecipes: async (ingredients: string[]) => {
                if (ingredients.length < 2) {
                    set({ error: 'Debes seleccionar al menos dos ingredientes' });
                    return;
                }

                set({ isLoading: true, error: null, lastSearchedIngredients: ingredients });

                try {
                    const { getRecipes } = await import('../services/recipes/recipes');
                    const recipesData = await getRecipes(ingredients);

                    set({
                        recipes: recipesData,
                        isLoading: false,
                        error: null
                    });
                } catch (error) {
                    console.error('Error searching recipes:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Error al buscar recetas',
                        isLoading: false,
                        recipes: []
                    });
                }
            },

            addIngredient: (ingredientName) => {
                const currentIngredients = get().ingredients;
                if (!currentIngredients.includes(ingredientName)) {
                    set(state => ({
                        ingredients: [...state.ingredients, ingredientName]
                    }));
                }
            },

            getIngredients: () => {
                return get().ingredients;
            },

            removeIngredient: (ingredientName) => {
                set(state => ({
                    ingredients: state.ingredients.filter(ing => ing !== ingredientName)
                }));
            },

            clearIngredients: () => {
                set({ ingredients: [] });
            },

            clearError: () => {
                set({ error: null });
            },

            hasIngredient: (ingredientName) => {
                return get().ingredients.includes(ingredientName);
            },

            getIngredientsCount: () => {
                return get().ingredients.length;
            }
        }),
        {
            name: 'recipes-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                ingredients: state.ingredients,
                lastSearchedIngredients: state.lastSearchedIngredients,
                recipes: state.recipes
            })
        }
    )
);

