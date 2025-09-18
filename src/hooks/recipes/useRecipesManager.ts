import { useIngredients } from './useIngredients';
import { useRecipes } from './useRecipes';

/**
 * Hook combinado que integra la gestión de ingredientes y recetas
 * Útil para componentes que necesitan ambas funcionalidades
 */
export const useRecipesManager = () => {
  const ingredients = useIngredients();
  const recipes = useRecipes();

  const searchRecipesWithSelectedIngredients = async () => {
    if (ingredients.getIngredientsCount() < 2) {
      throw new Error('Debes seleccionar al menos dos ingredientes');
    }
    
    const selectedIngredients = ingredients.getIngredients();
    await recipes.searchRecipes(selectedIngredients);
  };

  const canSearchRecipes = (maxIngredients?: number) => {
    if (maxIngredients) {
      return ingredients.getIngredientsCount() >= 2 && !ingredients.isFull(maxIngredients);
    }
    return ingredients.getIngredientsCount() >= 2;
  };

  const getSearchSummary = () => {
    return {
      ingredientsCount: ingredients.getIngredientsCount(),
      selectedIngredients: ingredients.getIngredients(),
      recipesFound: recipes.getRecipesCount(),
      isSearching: recipes.isLoading,
      hasError: !!recipes.error,
      errorMessage: recipes.error
    };
  };

  const resetAll = () => {
    ingredients.clearIngredients();
    recipes.clearError();
  };

  return {
    // Ingredientes
    ingredients,    
    // Recetas
    recipes,    
    // Funciones combinadas
    searchRecipesWithSelectedIngredients,
    canSearchRecipes,
    getSearchSummary,
    resetAll,
  };
};

export default useRecipesManager;
