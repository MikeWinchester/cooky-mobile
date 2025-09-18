// Main types export file

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaces de la API real - sincronizadas con useRecipesStore
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

//ya no se usara el atributo premium
export interface Recipe {
  recipe_id?: string;
  user_id?: string;
  prompt?: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  recipe_ingredients?: Ingredient[]; // Para compatibilidad con el store
  steps: Step[];
  cooking_time?: number;
  servings?: number;
  dietary_info?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  model_version?: string;
  image?: string;
  image_url?: string;
  is_cached?: boolean;
  cached_until?: string;
  feedback?: any;
  created_at?: string;
  commonIngredientsCount?: number;
  sustitucion?: string;
  personalizacion?: string;
}

// Export component types
export * from './components';
