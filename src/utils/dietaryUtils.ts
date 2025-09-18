/**
 * Normaliza las restricciones dietéticas para que se guarden en minúsculas
 * y reemplaza los espacios en blanco por guiones bajos (_)
 * 
 * Ejemplo: "Sin Gluten" -> "sin_gluten"
 * 
 * @param restriction - La restricción dietética original
 * @returns La restricción normalizada
 */
export function normalizeDietaryRestriction(restriction: string): string {
  return restriction
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

/**
 * Normaliza un array de restricciones dietéticas
 * 
 * @param restrictions - Array de restricciones dietéticas originales
 * @returns Array de restricciones normalizadas
 */
export function normalizeDietaryRestrictions(restrictions: string[]): string[] {
  return restrictions.map(normalizeDietaryRestriction);
}

/**
 * Convierte una restricción normalizada de vuelta a formato legible
 * para mostrar en la UI
 * 
 * Ejemplo: "sin_gluten" -> "Sin Gluten"
 * 
 * @param normalizedRestriction - La restricción normalizada
 * @returns La restricción en formato legible
 */
export function denormalizeDietaryRestriction(normalizedRestriction: string): string {
  return normalizedRestriction
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convierte un array de restricciones normalizadas de vuelta a formato legible
 * 
 * @param normalizedRestrictions - Array de restricciones normalizadas
 * @returns Array de restricciones en formato legible
 */
export function denormalizeDietaryRestrictions(normalizedRestrictions: string[]): string[] {
  return normalizedRestrictions.map(denormalizeDietaryRestriction);
}
