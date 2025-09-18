import { useLocalSearchParams } from 'expo-router';
import RecipesDetails from '../../../src/pages/recipes/RecipesDetails';

export default function RecipeDetailsPage() {
  const { idRecipe } = useLocalSearchParams();
  console.log('RecipeDetailsPage - idRecipe from params:', idRecipe);
  
  return <RecipesDetails />;
}
