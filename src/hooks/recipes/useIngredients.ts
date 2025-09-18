import { useRecipesStore } from '../../store/useRecipesStore';

export const useIngredients = () => {
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    hasIngredient,
    getIngredients,
    getIngredientsCount,
  } = useRecipesStore();

  const toggleIngredient = (ingredientName: string) => {
    if (hasIngredient(ingredientName)) {
      removeIngredient(ingredientName);
      return false; // Removed
    } else {
      addIngredient(ingredientName);
      return true; // Added
    }
  };

  const canAddMore = (maxIngredients: number) => {
    return getIngredientsCount() < maxIngredients;
  };

  const getRemainingSlots = (maxIngredients: number) => {
    return maxIngredients - getIngredientsCount();
  };

  const isEmpty = () => {
    return getIngredientsCount() === 0;
  };

  const isFull = (maxIngredients: number) => {
    return getIngredientsCount() >= maxIngredients;
  };

  return {
    ingredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    hasIngredient,
    getIngredients,
    getIngredientsCount,
    toggleIngredient,
    canAddMore,
    getRemainingSlots,
    isEmpty,
    isFull,
  };
};

export default useIngredients;
