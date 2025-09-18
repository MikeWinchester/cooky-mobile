// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_LIST_PATH = process.env.EXPO_PUBLIC_API_LIST_URL;

if (!API_BASE_URL || !API_LIST_PATH) {
    throw new Error('API configuration is missing. Please check your environment variables.');
}

const SHOPPING_LISTS_ENDPOINT = `${API_BASE_URL}${API_LIST_PATH}`;

import type { ShoppingList, ShoppingListGet, ShoppingListItem } from '../../types/shoppingList';
import { getAuthHeadersFromStore } from '../../utils/auth';

// ========================================
// INTERFACES
// ========================================

interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

interface SaveShoppingListRecipeRequest {
    recipe_id: string;
}

function processShoppingLists(lists: ShoppingList[]): ShoppingList[] {
    return lists.map(list => ({
        ...list,
        items: list.items.map(item => ({
            ...item,
            // Asegurar que is_purchased tenga un valor por defecto si viene undefined
            is_purchased: item.is_purchased ?? false
        }))
    }));
}

function handleHttpError(status: number, errorText: string): never {
    switch (status) {
        case 400:
            throw new Error('Datos inválidos.');
        case 401:
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        case 403:
            throw new Error('No tienes permisos para realizar esta acción.');
        case 404:
            throw new Error('Recurso no encontrado.');
        case 429:
            throw new Error('Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.');
        case 500:
            throw new Error('Error del servidor. Intenta de nuevo más tarde.');
        default:
            throw new Error(`Error ${status}: ${errorText || 'No se pudo completar la operación'}`);
    }
}

async function apiRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
): Promise<T> {
    try {
        const response = await fetch(endpoint, {
            headers: getAuthHeadersFromStore(),
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            handleHttpError(response.status, errorText);
        }

        const data: ApiResponse<T> = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al procesar la solicitud');
        }

        return data.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error inesperado en la solicitud');
    }
}

// ========================================
// CRUD OPERATIONS
// ========================================

// GET /shopping-lists - Obtener listas de compras
export async function getShoppingList(): Promise<ShoppingListGet[]> {    
    const response = await apiRequest<{ lists: any[] }>(SHOPPING_LISTS_ENDPOINT, {
        method: 'GET'
    });
    
    if (!response.lists || !Array.isArray(response.lists)) {
        console.error('Unexpected API response structure:', response);
        return [];
    }
    
    // Procesar cada lista y convertir a estructura ShoppingListGet
    return response.lists.map(listData => {
        // Parsear items si vienen como string JSON
        let items = listData.items;
        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (error) {
                console.error('Error parsing items JSON:', error, items);
                items = [];
            }
        }
        
        // Asegurar que items es un array y procesar cada item
        if (!Array.isArray(items)) {
            items = [];
        }

        // Especificar el tipo de 'item' como 'any' para evitar el error de tipo implícito
        const processedItems = items.map((item: any) => ({
            ...item,
            is_purchased: item.is_purchased ?? false
        }));
        // Crear estructura ShoppingListGet
        const shoppingListGet: ShoppingListGet = {
            ShoppingList: {
                list_id: listData.list_id,
                user_id: listData.user_id,
                recipe_id: listData.recipe_id,
                name: listData.name,
                description: listData.description,
                items: processedItems,
                created_at: listData.created_at,
                updated_at: listData.updated_at
            },
            stats: listData.stats || {
                total_items: processedItems.length,
                purchased_items: processedItems.filter((i: any) => i.is_purchased).length,
                pending_items: processedItems.filter((i: any) => !i.is_purchased).length,
                completion_percentage: processedItems.length > 0 ? Math.round((processedItems.filter((i: any) => i.is_purchased).length / processedItems.length) * 100) : 0
            },
            formatted_created_at: listData.formatted_created_at || (listData.created_at ? new Date(listData.created_at).toLocaleDateString() : ''),
            item_count: listData.item_count || processedItems.length
        };
        
        return shoppingListGet;
    });
}

// GET /shopping-lists/:id - Obtener lista específica por ID
export async function getShoppingListById(id: string): Promise<ShoppingListGet> {
    if (!id?.trim()) {
        throw new Error('ID de lista requerido');
    }
    
    console.log('Obteniendo lista específica:', id);
    
    const data = await apiRequest<ShoppingListGet>(`${SHOPPING_LISTS_ENDPOINT}/${id}`, {
        method: 'GET'
    });
    
    // Procesar los items de la ShoppingList dentro del ShoppingListGet
    return {
        ...data,
        ShoppingList: {
            ...data.ShoppingList,
            items: data.ShoppingList.items.map(item => ({
                ...item,
                is_purchased: item.is_purchased ?? false
            }))
        }
    };
}

// POST /shopping-lists - Crear lista de compras
export async function saveShoppingList(shoppingList: ShoppingList): Promise<ShoppingList[]> {
    if (!shoppingList?.name || !shoppingList?.description) {
        throw new Error('Los datos de la lista son requeridos (nombre y descripción)');
    }
    
    console.log('Guardando lista de compras:', shoppingList);
    
    // Preparar el body según lo que espera el backend
    const requestBody = {
        name: shoppingList.name,
        description: shoppingList.description,
        created_at: shoppingList.created_at || new Date().toLocaleDateString('es-ES'),
        items: shoppingList.items || []
    };
    
    const data = await apiRequest<{ shoppingList: ShoppingList[] }>(SHOPPING_LISTS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(requestBody)  // Enviar directamente el objeto, no envuelto
    });
    
    return processShoppingLists(data.shoppingList);
}

// POST /shopping-lists/from-recipe - Crear lista desde receta
export async function saveShoppingListRecipe(recipe_id: string): Promise<ShoppingList[]> {
    if (!recipe_id?.trim()) {
        throw new Error('ID de receta requerido');
    }
    
    console.log('Creando lista desde receta:', recipe_id);
    
    const requestBody: SaveShoppingListRecipeRequest = { recipe_id };
    
    try {
        // Intentar primero con el endpoint específico
        const data = await apiRequest<{ shoppingList: ShoppingList[] }>(`${SHOPPING_LISTS_ENDPOINT}/from-recipe`, {
            method: 'POST',
            body: JSON.stringify(requestBody)
        });
        
        return processShoppingLists(data.shoppingList);
    } catch (error) {
        // Si el endpoint específico no existe, crear una lista genérica
        if (error instanceof Error && error.message.includes('404')) {
            console.log('Endpoint from-recipe no encontrado, creando lista genérica');
            
            const genericList: ShoppingList = {
                list_id: `recipe_${recipe_id}_${Date.now()}`,
                user_id: '', // Se llenará en el backend
                recipe_id: recipe_id,
                name: `Lista de compras - Receta ${recipe_id}`,
                description: `Lista de compras generada automáticamente para la receta ${recipe_id}`,
                items: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            const data = await apiRequest<{ shoppingList: ShoppingList[] }>(SHOPPING_LISTS_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(genericList)
            });
            
            return processShoppingLists(data.shoppingList);
        }
        
        throw error;
    }
}

// DELETE /shopping-lists/:id - Eliminar lista de compras
export async function deleteShoppingListById(id: string): Promise<string> {
    if (!id?.trim()) {
        throw new Error('ID de lista requerido');
    }
    
    console.log('Eliminando lista:', id);
    
    const data = await apiRequest<{ message: string }>(`${SHOPPING_LISTS_ENDPOINT}/${id}`, {
        method: 'DELETE'
    });
    
    return data.message;
}

// DELETE /shopping-lists/:id/item/:itemId - Eliminar item de la lista
export async function deleteItemShoppingList(id: string, itemId: string): Promise<{ updatedList: ShoppingList, message: string }> {
    if (!id?.trim() || !itemId?.trim()) {
        throw new Error('ID de lista e ID de item son requeridos');
    }
    
    console.log('Eliminando item de lista:', { listId: id, itemId });
    
    const response = await apiRequest<{ updatedList: any[], message: string }>(`${SHOPPING_LISTS_ENDPOINT}/${id}/item/${itemId}`, {
        method: 'DELETE'
    });
    
    if (!response.updatedList || !Array.isArray(response.updatedList) || response.updatedList.length === 0) {
        throw new Error('Respuesta inválida del servidor al eliminar item');
    }
    
    const listData = response.updatedList[0]; // Tomar el primer elemento del array
    
    // Parsear items si vienen como string JSON
    let items = listData.items;
    if (typeof items === 'string') {
        try {
            items = JSON.parse(items);
        } catch (error) {
            console.error('Error parsing items JSON:', error, items);
            items = [];
        }
    }
    
    // Asegurar que items es un array y procesar cada item
    if (!Array.isArray(items)) {
        items = [];
    }

    const processedItems = (items as any[]).map((item: any) => ({
        ...item,
        is_purchased: item?.is_purchased ?? false
    }));
    const updatedList: ShoppingList = {
        list_id: listData.list_id,
        user_id: listData.user_id,
        recipe_id: listData.recipe_id,
        name: listData.name,
        description: listData.description,
        items: processedItems,
        created_at: listData.created_at,
        updated_at: listData.updated_at
    };
    
    return {
        updatedList,
        message: response.message
    };
}

// PUT /shopping-lists/:id/item/:itemId - Actualizar estado is_purchased de un item
export async function updateItemPurchaseStatus(listId: string, itemId: string, isPurchased: boolean): Promise<{ updatedList: ShoppingList, message: string }> {
    if (!listId?.trim() || !itemId?.trim()) {
        throw new Error('ID de lista e ID de item son requeridos');
    }
    
    console.log('Actualizando estado de compra:', { listId, itemId, isPurchased });
    
    const requestBody = {
        is_purchased: isPurchased
    };
    
    const response = await apiRequest<{ updatedList: any[], message: string }>(`${SHOPPING_LISTS_ENDPOINT}/${listId}/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(requestBody)
    });
    
    if (!response.updatedList || !Array.isArray(response.updatedList) || response.updatedList.length === 0) {
        throw new Error('Respuesta inválida del servidor al actualizar item');
    }
    
    const listData = response.updatedList[0];
    
    // Parsear items si vienen como string JSON
    let items = listData.items;
    if (typeof items === 'string') {
        try {
            items = JSON.parse(items);
        } catch (error) {
            console.error('Error parsing items JSON:', error, items);
            items = [];
        }
    }
    
    // Asegurar que items es un array y procesar cada item
    if (!Array.isArray(items)) {
        items = [];
    }

    // Especificar el tipo de item para evitar el error de tipo implícito 'any'
    const processedItems = (items as ShoppingListItem[]).map((item: ShoppingListItem) => ({
        ...item,
        is_purchased: item.is_purchased ?? false
    }));
    const updatedList: ShoppingList = {
        list_id: listData.list_id,
        user_id: listData.user_id,
        recipe_id: listData.recipe_id,
        name: listData.name,
        description: listData.description,
        items: processedItems,
        created_at: listData.created_at,
        updated_at: listData.updated_at
    };
    
    return {
        updatedList,
        message: response.message
    };
}

// POST /shopping-lists/:id/items - Agregar item a la lista
export async function addItemShoppingList(id: string, item: ShoppingListItem): Promise<{ updatedList: ShoppingList, newItem: ShoppingListItem, message: string }> {
    if (!id?.trim()) {
        throw new Error('ID de lista requerido');
    }
    
    if (!item?.name || !item?.quantity || !item?.unit) {
        throw new Error('Datos del item son requeridos (nombre, cantidad y unidad)');
    }
    
    // Agregar campo notes si no existe
    const itemWithNotes = {
        ...item,
        notes: item.notes || ''
    };
    
    const response = await apiRequest<{ updatedList: any[], newItem: ShoppingListItem, message: string }>(`${SHOPPING_LISTS_ENDPOINT}/${id}/items`, {
        method: 'POST',
        body: JSON.stringify(itemWithNotes)  // Enviar directamente el item, no envuelto
    });
    
    if (!response.updatedList || !Array.isArray(response.updatedList) || response.updatedList.length === 0) {
        throw new Error('Respuesta inválida del servidor al agregar item');
    }

    const listData = response.updatedList[0]; // Tomar el primer elemento del array

    // Parsear items si vienen como string JSON
    let items = listData.items;

    if (typeof items === 'string') {
        try {
            items = JSON.parse(items);
        } catch (error) {
            console.error('Error parsing items JSON:', error, items);
            items = [];
        }
    }
    
    // Asegurar que items es un array y procesar cada item
    if (!Array.isArray(items)) {
        items = [];
    }

    // Especificar el tipo de 'item' para evitar el error de tipo implícito 'any'
    const processedItems = (items as ShoppingListItem[]).map((item: ShoppingListItem) => ({
        ...item,
        is_purchased: item.is_purchased ?? false
    }));
    const updatedList: ShoppingList = {
        list_id: listData.list_id,
        user_id: listData.user_id,
        recipe_id: listData.recipe_id,
        name: listData.name,
        description: listData.description,
        items: processedItems,
        created_at: listData.created_at,
        updated_at: listData.updated_at
    };

    return {
        updatedList,
        newItem: response.newItem,
        message: response.message
    };
}
