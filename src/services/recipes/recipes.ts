// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_RECIPE_PATH = process.env.EXPO_PUBLIC_API_RECIPES_URL;

if (!API_BASE_URL || !API_RECIPE_PATH) {
  throw new Error('API configuration is missing. Please check your environment variables.');
}

const RECIPES_ENDPOINT = `${API_BASE_URL}${API_RECIPE_PATH}/generate`;

import type { Recipe } from "../../store/useRecipesStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getAuthHeadersFromStore } from "../../utils/auth";
import { findSvgByName } from "../../utils/ingredientSvg";

interface RecipesApiResponse {
  success: boolean;
  message?: string;
  data: {
    recipes: Recipe[];
      total: number;
      generation_time?: number;
    };
}

interface RecipesRequest {
  ingredients: string[];
  preferences?: {
    dietary_restrictions?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
    cooking_time_max?: number;
    servings?: number;
  };
}

// Función para obtener el token de autenticación (mantenida para compatibilidad)
function getAuthToken(): string {
  const { token, isAuthenticated } = useAuthStore.getState();
  
  if (!isAuthenticated || !token) {
    throw new Error('Usuario no autenticado');
  }
  
  return token;
}

// Función principal para obtener recetas
export async function getRecipes(ingredients: string[]): Promise<Recipe[]> {
  if (!ingredients || ingredients.length < 2) {
    throw new Error('Debe proporcionar al menos dos ingredientes');
  }

  try {
    const requestBody: RecipesRequest = {
      ingredients: ingredients.map(ing => ing.trim().toLowerCase())
    };

    const response = await fetch(RECIPES_ENDPOINT, {
      method: 'POST',
      headers: getAuthHeadersFromStore(),
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      // Manejar diferentes tipos de errores HTTP
      switch (response.status) {
        case 401:
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        case 403:
          throw new Error('No tienes permisos para generar recetas.');
        case 429:
          throw new Error('Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.');
        case 500:
          throw new Error('Error del servidor. Intenta de nuevo más tarde.');
        default:
          throw new Error(`Error ${response.status}: No se pudieron obtener las recetas`);
      }
    }

    const data: RecipesApiResponse = await response.json();

    // Validar respuesta exitosa
    if (!data.success) {
      throw new Error(data.message || 'Error al procesar la solicitud de recetas');
    }

    // Extraer recetas de la API
    const recipes = data.data.recipes;
    console.log(`Se encontraron ${recipes.length} recetas`);
    
    // Procesar recetas: SVGs y steps
    const processedRecipes = recipes.map(recipe => {
      // Procesar steps si vienen como strings JSON
      let processedSteps = recipe.steps;
      if (Array.isArray(recipe.steps) && recipe.steps.length > 0 && typeof recipe.steps[0] === 'string') {
        try {
          processedSteps = recipe.steps.map(stepString => {
            const parsed = JSON.parse(stepString);
            return {
              order: parsed.order || 1,
              step: parsed.step || stepString,
              time: parsed.time
            };
          }).sort((a, b) => a.order - b.order);
        } catch (error) {
          console.error('Error parsing steps for recipe:', recipe.name, error);
          processedSteps = recipe.steps.map((step, index) => ({
            order: index + 1,
            step: typeof step === 'string' ? step : step.step || '',
            time: typeof step === 'object' ? step.time : undefined
          }));
        }
      }

      // Procesar ingredientes con verificación defensiva
      let processedIngredients = [];
      if (recipe.recipe_ingredients && Array.isArray(recipe.recipe_ingredients)) {
        processedIngredients = recipe.recipe_ingredients.map(ingredient => ({
          ...ingredient,
          svg: ingredient.svg || findSvgByName(ingredient.name)
        }));
      }

      return {
        ...recipe,
        steps: processedSteps,
        recipe_ingredients: processedIngredients
      };
    });
    
    return processedRecipes;

  } catch (error) {
    console.error('Error al obtener recetas:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error inesperado al obtener recetas');
  }
}

// Función para obtener recetas con preferencias adicionales
export async function getRecipesWithPreferences(
  ingredients: string[],
  preferences: RecipesRequest['preferences']
): Promise<Recipe[]> {
  if (!ingredients || ingredients.length < 2) {
    throw new Error('Debe proporcionar al menos dos ingredientes');
  }

  try {
    const requestBody: RecipesRequest = {
      ingredients: ingredients.map(ing => ing.trim().toLowerCase()),
      preferences
    };

    console.log('Buscando recetas con preferencias:', requestBody);

    const response = await fetch(RECIPES_ENDPOINT, {
      method: 'POST',
      headers: getAuthHeadersFromStore(),
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data: RecipesApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener recetas con preferencias');
    }

    // Extraer y procesar recetas
    const recipes = data.data.recipes;
    
    // Asignar SVGs a ingredientes si no los tienen
    const processedRecipes = recipes.map(recipe => {
      // Procesar ingredientes con verificación defensiva
      let processedIngredients = [];
      if (recipe.recipe_ingredients && Array.isArray(recipe.recipe_ingredients)) {
        processedIngredients = recipe.recipe_ingredients.map(ingredient => ({
          ...ingredient,
          svg: ingredient.svg || findSvgByName(ingredient.name) // Asignar SVG si no existe
        }));
      } else {
        console.warn('recipe_ingredients not found for recipe:', recipe.name);
        processedIngredients = [];
      }
      
      return {
        ...recipe,
        recipe_ingredients: processedIngredients
      };
    });
    
    return processedRecipes;

  } catch (error) {
    console.error('Error al obtener recetas con preferencias:', error);
    throw error;
  }
}

