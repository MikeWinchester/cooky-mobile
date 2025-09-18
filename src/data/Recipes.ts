import chickentomatoe from "../assets/images/recipes/pollot.png"
import salteado from "../assets/images/recipes/salteado.png"
import perso from "../assets/images/recipes/personalizado.jpg"
import mediterraneo from "../assets/images/recipes/mediterraneo.jpg"
import guiso from "../assets/images/recipes/guiso.png"
import ensalada from "../assets/images/recipes/ensalada.png"
import type { Recipe, Ingredient, Step } from "../store/useRecipesStore";

// Legacy interfaces for existing data
export interface IngredienteDetalle {
  id: number;
  ingredientName: string;
  amount: string;
  icon: string;
}

export interface instruction {
  numero: number;
  description: string;
  time?: string;
}

export interface Receta {
  id: number;
  recipetitle: string;
  image: string;
  preparationTime: string;
  difficulty: string;
  coincidencia: number;
  ingredientesNumero: number;
  ingredientes: string[];
  ingredientesList: IngredienteDetalle[];
  instructions: instruction[];
  premium: boolean;
  sustitucion: string;
  personalizacion: string;
  aiTag: string;
}

// Adaptadores para convertir entre formatos legacy y nuevos
export function convertLegacyToNewRecipe(legacyRecipe: Receta): Recipe {
  const ingredients: Ingredient[] = legacyRecipe.ingredientesList.map((ing, index) => ({
    name: ing.id || index, // Usar ID o índice como identificador
    quantity: ing.amount,
    unit: extractUnit(ing.amount),
    icon: ing.icon,
    is_optional: false
  }));

  const steps: Step[] = legacyRecipe.instructions.map((inst) => ({
    order: inst.numero,
    step: inst.description,
    time: inst.time
  }));

  return {
    name: legacyRecipe.recipetitle,
    description: `Receta ${legacyRecipe.recipetitle} con ${legacyRecipe.ingredientesNumero} ingredientes`,
    ingredients,
    steps,
    cooking_time: parseTime(legacyRecipe.preparationTime),
    servings: 4, // Default serving size
    dietary_info: [],
    difficulty: mapDifficulty(legacyRecipe.difficulty),
    image: legacyRecipe.image,
    sustitucion: legacyRecipe.sustitucion,
    personalizacion: legacyRecipe.personalizacion
  };
}

export function convertNewToLegacyRecipe(newRecipe: Recipe, id: number): Receta {
  const ingredientesList: IngredienteDetalle[] = newRecipe.ingredients.map((ing, index) => ({
    id: typeof ing.name === 'number' ? ing.name : index + 1,
    ingredientName: getIngredientName(ing.name),
    amount: `${ing.quantity} ${ing.unit}`.trim(),
    icon: ing.icon
  }));

  const instructions: instruction[] = newRecipe.steps.map((step) => ({
    numero: step.order,
    description: step.step,
    time: step.time
  }));

  return {
    id,
    recipetitle: newRecipe.name,
    image: newRecipe.image || '',
    preparationTime: `${newRecipe.cooking_time || 30} min`,
    difficulty: mapDifficultyReverse(newRecipe.difficulty),
    coincidencia: 85, // Default match percentage
    ingredientesNumero: newRecipe.ingredients.length,
    ingredientes: newRecipe.ingredients.map(ing => getIngredientName(ing.name)),
    ingredientesList,
    instructions,
    premium: false,
    sustitucion: newRecipe.sustitucion || '',
    personalizacion: newRecipe.personalizacion || '',
    aiTag: 'API'
  };
}

// Helper functions
function extractUnit(amount: string): string {
  const match = amount.match(/\b(g|kg|ml|l|cucharada|cucharadita|taza|unidad|diente)s?\b/i);
  return match ? match[0] : '';
}

function parseTime(timeStr: string): number {
  const match = timeStr.match(/\d+/);
  return match ? parseInt(match[0]) : 30;
}

function mapDifficulty(difficulty: string): 'easy' | 'medium' | 'hard' {
  const lower = difficulty.toLowerCase();
  if (lower.includes('fácil') || lower.includes('muy fácil')) return 'easy';
  if (lower.includes('medio') || lower.includes('intermedio')) return 'medium';
  return 'hard';
}

function mapDifficultyReverse(difficulty?: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy': return 'Fácil';
    case 'medium': return 'Medio';
    case 'hard': return 'Difícil';
    default: return 'Fácil';
  }
}

function getIngredientName(nameOrId: number | string): string {
  // En una implementación real, esto consultaría una base de datos de ingredientes
  // Por ahora, devolvemos un placeholder
  if (typeof nameOrId === 'string') return nameOrId;
  return `Ingrediente ${nameOrId}`;
}

export const recetas: Receta[] = [
  {
    id: 1,
    recipetitle: "Pollo con Tomate",
    image: chickentomatoe,
    preparationTime: "30 min",
    difficulty: "Fácil",
    coincidencia: 85,
    ingredientesNumero: 5,
    ingredientes: ["pollo", "tomate", "cebolla", "ajo", "aceite"],
    ingredientesList: [
      { id: 1, ingredientName: "Pollo", amount: "500g", icon: "🍗" },
      { id: 2, ingredientName: "Tomate", amount: "2 Unidades", icon: "🍅" },
      { id: 3, ingredientName: "Cebolla", amount: "1 Unidad", icon: "🧅" },
      { id: 4, ingredientName: "Ajo", amount: "2 Dientes", icon: "🧄" },
      { id: 5, ingredientName: "Aceite", amount: "2 Cucharadas", icon: "🛢️" }
    ],
    instructions: [
      { numero: 1, description: "Cortar el pollo en trozos y salpimentar.", time: "5 min" },
      { numero: 2, description: "Picar cebolla, ajo y tomate.", time: "5 min" },
      { numero: 3, description: "Sofreír ajo y cebolla con aceite.", time: "5 min" },
      { numero: 4, description: "Añadir pollo y cocinar hasta dorar.", time: "5 min" },
      { numero: 5, description: "Incorporar el tomate y cocinar 10 minutos más.", time: "5 min" }
    ],
    premium: false,
    sustitucion: "",
    personalizacion: "",
    aiTag: ""
  },
  {
    id: 2,
    recipetitle: "Salteado de Pollo",
    image: salteado,
    preparationTime: "20 min",
    difficulty: "Fácil",
    coincidencia: 70,
    ingredientesNumero: 4,
    ingredientes: ["pollo", "cebolla", "pimiento", "salsa soja"],
    ingredientesList: [
      { id: 1, ingredientName: "Pollo", amount: "300g", icon: "🍗" },
      { id: 2, ingredientName: "Cebolla", amount: "1 Unidad", icon: "🧅" },
      { id: 3, ingredientName: "Pimiento", amount: "1 Unidad", icon: "🌶️" },
      { id: 4, ingredientName: "Salsa de soja", amount: "2 Cucharadas", icon: "🥢" }
    ],
    instructions: [
      { numero: 1, description: "Cortar pollo, cebolla y pimiento en tiras." },
      { numero: 2, description: "Calentar aceite en sartén y saltear pollo." },
      { numero: 3, description: "Añadir verduras y cocinar 5 min." },
      { numero: 4, description: "Incorporar salsa de soja y remover bien." }
    ],
    premium: false,
    sustitucion: "",
    personalizacion: "",
    aiTag: ""
  },
  {
    id: 3,
    recipetitle: "Ensalada de Tomate",
    image: ensalada,
    preparationTime: "10 min",
    difficulty: "Muy Fácil",
    coincidencia: 60,
    ingredientesNumero: 4,
    ingredientes: ["tomate", "cebolla", "aceite", "vinagre"],
    ingredientesList: [
      { id: 1, ingredientName: "Tomate", amount: "2 Unidades", icon: "🍅" },
      { id: 2, ingredientName: "Cebolla", amount: "1/2 Unidad", icon: "🧅" },
      { id: 3, ingredientName: "Aceite", amount: "2 Cucharadas", icon: "🛢️" },
      { id: 4, ingredientName: "Vinagre", amount: "1 Cucharada", icon: "🍶" }
    ],
    instructions: [
      { numero: 1, description: "Lavar y cortar tomates en rodajas." },
      { numero: 2, description: "Picar cebolla en julianas finas." },
      { numero: 3, description: "Aliñar con aceite y vinagre." }
    ],
    premium: false,
    sustitucion: "",
    personalizacion: "",
    aiTag: ""
  },
  {
    id: 4,
    recipetitle: "Pollo al Tomate Personalizado",
    image: perso,
    preparationTime: "25 min",
    difficulty: "Fácil",
    coincidencia: 98,
    ingredientesNumero: 3,
    ingredientes: ["pollo", "tomate", "cebolla"],
    ingredientesList: [
      { id: 1, ingredientName: "Pollo", amount: "500g", icon: "🍗" },
      { id: 2, ingredientName: "Tomate", amount: "2 Unidades", icon: "🍅" },
      { id: 3, ingredientName: "Cebolla", amount: "1 Unidad", icon: "🧅" }
    ],
    instructions: [
      { numero: 1, description: "Cortar pollo, tomate y cebolla." },
      { numero: 2, description: "Sofreír la cebolla en aceite." },
      { numero: 3, description: "Añadir pollo y cocinar hasta dorar." },
      { numero: 4, description: "Agregar tomate y cocinar 10 minutos." }
    ],
    premium: true,
    sustitucion: "Sin ajo? Usa cebolla en polvo (1/2 cdta)",
    personalizacion: "Adaptado a tus preferencias: sin picante",
    aiTag: "Receta IA"
  },
  {
    id: 5,
    recipetitle: "Pollo Mediterráneo Express",
    image: mediterraneo,
    preparationTime: "20 min",
    difficulty: "Fácil",
    coincidencia: 95,
    ingredientesNumero: 3,
    ingredientes: ["pollo", "tomate", "cebolla"],
    ingredientesList: [
      { id: 1, ingredientName: "Pollo", amount: "400g", icon: "🍗" },
      { id: 2, ingredientName: "Tomate", amount: "1 Unidad", icon: "🍅" },
      { id: 3, ingredientName: "Cebolla", amount: "1 Unidad", icon: "🧅" }
    ],
    instructions: [
      { numero: 1, description: "Cortar ingredientes en trozos pequeños." },
      { numero: 2, description: "Saltear pollo con aceite de oliva." },
      { numero: 3, description: "Añadir tomate y cebolla, cocinar 8 minutos." }
    ],
    premium: true,
    sustitucion: "Puedes agregar: orégano seco si tienes",
    personalizacion: "Solo 3 ingredientes como pediste",
    aiTag: "Optimizada IA"
  },
  {
    id: 6,
    recipetitle: "Guiso Rápido de Pollo",
    image: guiso,
    preparationTime: "35 min",
    difficulty: "Fácil",
    coincidencia: 92,
    ingredientesNumero: 3,
    ingredientes: ["pollo", "tomate", "cebolla"],
    ingredientesList: [
      { id: 1, ingredientName: "Pollo", amount: "500g", icon: "🍗" },
      { id: 2, ingredientName: "Tomate", amount: "2 Unidades", icon: "🍅" },
      { id: 3, ingredientName: "Cebolla", amount: "1 Unidad", icon: "🧅" }
    ],
    instructions: [
      { numero: 1, description: "Trocear pollo, tomate y cebolla." },
      { numero: 2, description: "Cocinar pollo en sartén." },
      { numero: 3, description: "Añadir tomate y cebolla, cocinar 15 minutos." }
    ],
    premium: true,
    sustitucion: "Sin caldo? Usa agua + sal",
    personalizacion: "Receta familiar para 4 personas",
    aiTag: "Personalizada"
  }
];
