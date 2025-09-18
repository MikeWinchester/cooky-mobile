/**
 * Función común para obtener el token de autenticación
 * @param token El token JWT del usuario autenticado
 * @param isAuthenticated Estado de autenticación del usuario
 * @returns El token JWT del usuario autenticado
 * @throws Error si el usuario no está autenticado o no tiene token
 */
export function getAuthToken(token?: string, isAuthenticated?: boolean): string {
    if (!isAuthenticated || !token) {
        throw new Error('Usuario no autenticado');
    }
    
    return token;
}

/**
 * Función común para crear headers con autorización
 * @param token El token JWT del usuario autenticado
 * @param isAuthenticated Estado de autenticación del usuario
 * @param extraHeaders Headers adicionales opcionales
 * @returns Headers con autorización Bearer incluida
 */
export function getAuthHeaders(token?: string, isAuthenticated?: boolean, extraHeaders?: HeadersInit): HeadersInit {
    const authToken = getAuthToken(token, isAuthenticated);
    
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...(extraHeaders || {})
    };
}

/**
 * Función para crear headers sin autorización (para login/register)
 * @param extraHeaders Headers adicionales opcionales
 * @returns Headers básicos sin autorización
 */
export function getBasicHeaders(extraHeaders?: HeadersInit): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(extraHeaders || {})
    };
}

/**
 * Función helper que usa el store para obtener headers con autorización
 * Esta función mantiene la compatibilidad con el código existente
 * @param extraHeaders Headers adicionales opcionales
 * @returns Headers con autorización Bearer incluida
 */
export function getAuthHeadersFromStore(extraHeaders?: HeadersInit): HeadersInit {
    // Importación dinámica para evitar el ciclo de dependencias
    const { useAuthStore } = require('../store/useAuthStore');
    const { token, isAuthenticated } = useAuthStore.getState();
    
    return getAuthHeaders(token, isAuthenticated, extraHeaders);
}

