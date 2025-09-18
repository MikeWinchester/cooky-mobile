import { useLocalSearchParams } from 'expo-router';
import HomeRecipe from '../../src/pages/recipes/HomeRecipe';
import RecipesFree from '../../src/pages/recipes/RecipesFree';

export default function RecipePage() {
  const { showRecipes } = useLocalSearchParams();
  
  // Si showRecipes es true, mostrar la lista de recetas
  if (showRecipes === 'true') {
    return <RecipesFree />;
  }
  
  // Por defecto, mostrar la página de inicio de recetas
  return <HomeRecipe />;
}
