import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ShoppingList, ShoppingListGet, ShoppingListItem } from '../types/shoppingList';

interface ShoppingListState {
    success: boolean;
    message?: string;
    lists: ShoppingList[];
    listsWithStats: ShoppingListGet[]; // Para cuando necesitemos stats adicionales
    currentListDetails: ShoppingListGet | null; // Para detalles de lista específica
    currentListId: string | null; // ID de la lista actualmente seleccionada
    isLoading: boolean;
    error: string | null;
    getShoppingList: () => Promise<void>; //GET /shopping-lists - Obtener listas de compras
    getShoppingListById: (id: string) => Promise<void>; // GET /shopping-lists/:id - Obtener lista específica por ID
    saveShoppingList: (shoppingList: ShoppingList) => Promise<void>; // POST /shopping-lists - Crear lista de compras
    saveShoppingListRecipe: (recipe_id: string) => Promise<void>; // POST /shopping-lists/from-recipe - Crear lista desde receta
    deleteShoppingListById: (id: string) => Promise<void>; // DELETE /shopping-lists/:id - Eliminar lista de compras
    deleteItemShoppingList: (id: string, itemId: string) => Promise<void>; // DELETE /shopping-lists/:id/item/:itemId - Eliminar item de la lista
    updateItemPurchaseStatus: (listId: string, itemId: string, isPurchased: boolean) => Promise<void>; // PUT /shopping-lists/:id/item/:itemId - Actualizar estado is_purchased
    addItemShoppingList: (id: string, item: ShoppingListItem) => Promise<void>; // POST /shopping-lists/:id/items - Agregar item a la lista
    setCurrentListId: (id: string | null) => void; // Establecer la lista actual
    clearError: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
    persist(
        (set, get) => ({
            success: false,
            message: '',
            lists: [],
            listsWithStats: [],
            currentListDetails: null,
            currentListId: null,
            isLoading: false,
            error: null,

            // Establecer la lista actual
            setCurrentListId: (id: string | null) => {
                set({ currentListId: id });
            },

            // Limpiar errores
            clearError: () => {
                set({ error: null });
            },

            // GET /shopping-lists - Obtener listas de compras
            getShoppingList: async () => {
                set({ isLoading: true, error: null });
                
                try {
                    const { getShoppingList } = await import('../services/shoppingLists/shoppingLists');
                    const shoppingListsGet = await getShoppingList();
                    
                    // Extraer ShoppingList de cada ShoppingListGet para compatibilidad
                    const lists = shoppingListsGet.map(item => item.ShoppingList);
                    
                    set({ 
                        lists,
                        listsWithStats: shoppingListsGet, // Guardar datos completos con stats
                        success: true,
                        message: 'Listas cargadas exitosamente',
                        isLoading: false 
                    });
                    
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar listas';
                    
                    set({ 
                        error: errorMessage,
                        success: false,
                        isLoading: false 
                    });
                    
                    console.error('Error en getShoppingList store:', error);
                }
            },

            // GET /shopping-lists/:id - Obtener lista específica por ID
            getShoppingListById: async (id: string) => {
                if (!id || id.trim() === '') {
                    set({ error: 'ID de lista requerido' });
                    return;
                }
                
                set({ isLoading: true, error: null });
                
                try {
                    const { getShoppingListById } = await import('../services/shoppingLists/shoppingLists');
                    const shoppingListGet = await getShoppingListById(id);
                    
                    // Extraer ShoppingList para compatibilidad y guardar detalles completos
                    const list = shoppingListGet.ShoppingList;
                    
                    // Actualizar la lista en el array existente o agregarla si no existe
                    const currentLists = get().lists;
                    const existingIndex = currentLists.findIndex(l => l.list_id === list.list_id);
                    
                    let updatedLists;
                    if (existingIndex >= 0) {
                        updatedLists = [...currentLists];
                        updatedLists[existingIndex] = list;
                    } else {
                        updatedLists = [...currentLists, list];
                    }
                    
                    set({ 
                        lists: updatedLists,
                        currentListDetails: shoppingListGet, // Guardar detalles completos con stats
                        success: true,
                        message: 'Lista cargada exitosamente',
                        isLoading: false 
                    });
                    
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar la lista';
                    
                    set({ 
                        error: errorMessage,
                        success: false,
                        isLoading: false 
                    });
                    
                    console.error('Error en getShoppingListById store:', error);
                }
            },

            // POST /shopping-lists - Crear lista de compras
            saveShoppingList: async (shoppingList: ShoppingList) => {
                if (!shoppingList || !shoppingList.name || !shoppingList.description) {
                    set({ error: 'Datos de la lista son requeridos (nombre y descripción)' });
                    return;
                }
                
                set({ isLoading: true, error: null });
                
                try {
                    const { saveShoppingList } = await import('../services/shoppingLists/shoppingLists');
                    const savedLists = await saveShoppingList(shoppingList);
                    
                    // Actualizar la lista de listas con la nueva lista creada
                    const currentLists = get().lists;
                    const updatedLists = [...currentLists, ...savedLists];
                    
                    // Actualizar también listsWithStats para mantener la sincronización
                    const currentListsWithStats = get().listsWithStats;
                    const newListsWithStats = savedLists.map(list => ({
                        ShoppingList: list,
                        stats: {
                            total_items: list.items.length,
                            purchased_items: list.items.filter(i => i.is_purchased).length,
                            pending_items: list.items.filter(i => !i.is_purchased).length,
                            completion_percentage: list.items.length > 0 
                                ? Math.round((list.items.filter(i => i.is_purchased).length / list.items.length) * 100) 
                                : 0
                        },
                        formatted_created_at: list.created_at ? new Date(list.created_at).toLocaleDateString() : 'Sin fecha',
                        item_count: list.items.length
                    } as ShoppingListGet));
                    const updatedListsWithStats = [...currentListsWithStats, ...newListsWithStats];
                    
                    set({ 
                        lists: updatedLists,
                        listsWithStats: updatedListsWithStats,
                        success: true,
                        message: 'Lista creada exitosamente',
                        isLoading: false 
                    });
                    
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear la lista';
                    
                    set({ 
                        error: errorMessage,
                        success: false,
                        isLoading: false 
                    });
                    
                    console.error('Error en saveShoppingList store:', error);
                }
            },

            // POST /shopping-lists/from-recipe - Crear lista desde receta
            saveShoppingListRecipe: async (recipe_id: string) => {
                if (!recipe_id || recipe_id.trim() === '') {
                    set({ error: 'ID de receta requerido' });
                    return;
                }
                
                set({ isLoading: true, error: null });
                
                try {
                    const { saveShoppingListRecipe } = await import('../services/shoppingLists/shoppingLists');
                    const savedLists = await saveShoppingListRecipe(recipe_id);
                    
                    // Actualizar la lista de listas con la nueva lista desde receta
                    const currentLists = get().lists;
                    const updatedLists = [...currentLists, ...savedLists];
                    
                    // Actualizar también listsWithStats para mantener la sincronización
                    const currentListsWithStats = get().listsWithStats;
                    const newListsWithStats = savedLists.map(list => ({
                        ShoppingList: list,
                        stats: {
                            total_items: list.items.length,
                            purchased_items: list.items.filter(i => i.is_purchased).length,
                            pending_items: list.items.filter(i => !i.is_purchased).length,
                            completion_percentage: list.items.length > 0 
                                ? Math.round((list.items.filter(i => i.is_purchased).length / list.items.length) * 100) 
                                : 0
                        },
                        formatted_created_at: list.created_at ? new Date(list.created_at).toLocaleDateString() : 'Sin fecha',
                        item_count: list.items.length
                    } as ShoppingListGet));
                    const updatedListsWithStats = [...currentListsWithStats, ...newListsWithStats];
                    
                    set({ 
                        lists: updatedLists,
                        listsWithStats: updatedListsWithStats,
                        success: true,
                        message: 'Lista creada desde receta exitosamente',
                        isLoading: false 
                    });
                    
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear lista desde receta';
                    
                    set({ 
                        error: errorMessage,
                        success: false,
                        isLoading: false 
                    });
                    
                    console.error('Error en saveShoppingListRecipe store:', error);
                }
            },

            // DELETE /shopping-lists/:id - Eliminar lista de compras
            deleteShoppingListById: async (id: string) => {
                if (!id || id.trim() === '') {
                    set({ error: 'ID de lista requerido' });
                    return;
                }
                
                set({ isLoading: true, error: null });
                
                try {
                    const { deleteShoppingListById } = await import('../services/shoppingLists/shoppingLists');
                    const message = await deleteShoppingListById(id);
                    
                    // Eliminar la lista del estado local
                    const currentLists = get().lists;
                    const currentListsWithStats = get().listsWithStats;
                    
                    const updatedLists = currentLists.filter(list => list.list_id !== id);
                    const updatedListsWithStats = currentListsWithStats.filter(listItem => listItem.ShoppingList.list_id !== id);
                    
                    // También limpiar currentListDetails si es la lista eliminada
                    const currentDetails = get().currentListDetails;
                    const updatedCurrentDetails = (currentDetails?.ShoppingList.list_id === id) ? null : currentDetails;
                    
                    // Limpiar currentListId si es la lista eliminada
                    const currentListId = get().currentListId;
                    const updatedCurrentListId = (currentListId === id) ? null : currentListId;
                    
                    set({ 
                        lists: updatedLists,
                        listsWithStats: updatedListsWithStats,
                        currentListDetails: updatedCurrentDetails,
                        currentListId: updatedCurrentListId,
                        success: true,
                        message,
                        isLoading: false 
                    });
                    
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar la lista';
                    
                    set({ 
                        error: errorMessage,
                        success: false,
                        isLoading: false 
                    });
                    
                    console.error('Error en deleteShoppingListById store:', error);
                }
            },

            // DELETE /shopping-lists/:id/item/:itemId - Eliminar item de la lista
            deleteItemShoppingList: async (id: string, itemId: string) => {
                if (!id || id.trim() === '' || !itemId || itemId.trim() === '') {
                    set({ error: 'ID de lista e ID de item son requeridos' });
                    return;
                }
                
                // Actualización optimista - eliminar el item inmediatamente
                const currentLists = get().lists;
                const updatedLists = currentLists.map(list => {
                    if (list.list_id === id) {
                        return {
                            ...list,
                            items: list.items.filter(item => item.item_id !== itemId)
                        };
                    }
                    return list;
                });
                
                // También actualizar listsWithStats para mantener la sincronización
                const currentListsWithStats = get().listsWithStats;
                const updatedListsWithStats = currentListsWithStats.map(listItem => {
                    if (listItem.ShoppingList.list_id === id) {
                        const updatedList = updatedLists.find(l => l.list_id === id);
                        if (updatedList) {
                            return {
                                ...listItem,
                                ShoppingList: updatedList,
                                stats: {
                                    total_items: updatedList.items.length,
                                    purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                                    pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                                    completion_percentage: updatedList.items.length > 0 
                                        ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                        : 0
                                },
                                item_count: updatedList.items.length
                            };
                        }
                    }
                    return listItem;
                });
                
                // También actualizar currentListDetails si coincide
                const currentDetails = get().currentListDetails;
                let updatedDetails = currentDetails;
                if (currentDetails?.ShoppingList.list_id === id) {
                    const updatedList = updatedLists.find(l => l.list_id === id);
                    if (updatedList) {
                        updatedDetails = {
                            ...currentDetails,
                            ShoppingList: updatedList,
                            stats: {
                                total_items: updatedList.items.length,
                                purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                                pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                                completion_percentage: updatedList.items.length > 0 
                                    ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                    : 0
                            }
                        } as ShoppingListGet;
                    }
                }
                
                // Aplicar cambios inmediatamente
                set({ 
                    lists: updatedLists,
                    listsWithStats: updatedListsWithStats,
                    currentListDetails: updatedDetails,
                });
                
                // Luego hacer la llamada a la API en segundo plano
                try {
                    const { deleteItemShoppingList } = await import('../services/shoppingLists/shoppingLists');
                    const { updatedList, message } = await deleteItemShoppingList(id, itemId);
                    
                    // Si la respuesta del servidor es diferente, actualizar con los datos del servidor
                    const serverUpdatedLists = currentLists.map(list => 
                        list.list_id === updatedList.list_id ? updatedList : list
                    );
                    
                    const serverUpdatedListsWithStats = currentListsWithStats.map(listItem => {
                        if (listItem.ShoppingList.list_id === updatedList.list_id) {
                            return {
                                ...listItem,
                                ShoppingList: updatedList,
                                stats: {
                                    total_items: updatedList.items.length,
                                    purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                                    pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                                    completion_percentage: updatedList.items.length > 0 
                                        ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                        : 0
                                },
                                item_count: updatedList.items.length
                            };
                        }
                        return listItem;
                    });
                    
                    const serverUpdatedDetails = currentDetails?.ShoppingList.list_id === updatedList.list_id ? {
                        ...currentDetails,
                        ShoppingList: updatedList,
                        stats: {
                            total_items: updatedList.items.length,
                            purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                            pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                            completion_percentage: updatedList.items.length > 0 
                                ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                : 0
                        }
                    } as ShoppingListGet : currentDetails;
                    
                    set({ 
                        lists: serverUpdatedLists,
                        listsWithStats: serverUpdatedListsWithStats,
                        currentListDetails: serverUpdatedDetails,
                        success: true,
                        message,
                    });
                    
                } catch (error) {
                    // Si hay error, revertir los cambios optimistas
                    set({ 
                        lists: currentLists,
                        listsWithStats: currentListsWithStats,
                        currentListDetails: currentDetails,
                        error: error instanceof Error ? error.message : 'Error desconocido al eliminar el item',
                        success: false,
                    });
                    
                    console.error('Error en deleteItemShoppingList store:', error);
                }
            },

            // PUT /shopping-lists/:id/item/:itemId - Actualizar estado is_purchased de un item
            updateItemPurchaseStatus: async (listId: string, itemId: string, isPurchased: boolean) => {
                if (!listId || listId.trim() === '' || !itemId || itemId.trim() === '') {
                    set({ error: 'ID de lista e ID de item son requeridos' });
                    return;
                }
                
                console.log('🔄 [Store] updateItemPurchaseStatus llamado con:', { listId, itemId, isPurchased });
                
                // Actualización optimista - actualizar el estado inmediatamente
                const currentLists = get().lists;
                const updatedLists = currentLists.map(list => {
                    if (list.list_id === listId) {
                        return {
                            ...list,
                            items: list.items.map(item => 
                                item.item_id === itemId 
                                    ? { ...item, is_purchased: isPurchased }
                                    : item
                            )
                        };
                    }
                    return list;
                });
                
                // También actualizar listsWithStats para mantener la sincronización
                const currentListsWithStats = get().listsWithStats;
                const updatedListsWithStats = currentListsWithStats.map(listItem => {
                    if (listItem.ShoppingList.list_id === listId) {
                        const updatedList = updatedLists.find(l => l.list_id === listId);
                        if (updatedList) {
                            return {
                                ...listItem,
                                ShoppingList: updatedList,
                                stats: {
                                    total_items: updatedList.items.length,
                                    purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                                    pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                                    completion_percentage: updatedList.items.length > 0 
                                        ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                        : 0
                                },
                                item_count: updatedList.items.length
                            };
                        }
                    }
                    return listItem;
                });
                
                // También actualizar currentListDetails si coincide
                const currentDetails = get().currentListDetails;
                let updatedDetails = currentDetails;
                if (currentDetails?.ShoppingList.list_id === listId) {
                    const updatedList = updatedLists.find(l => l.list_id === listId);
                    if (updatedList) {
                        updatedDetails = {
                            ...currentDetails,
                            ShoppingList: updatedList,
                            stats: {
                                total_items: updatedList.items.length,
                                purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                                pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                                completion_percentage: updatedList.items.length > 0 
                                    ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                    : 0
                            }
                        } as ShoppingListGet;
                    }
                }
                
                // Aplicar cambios inmediatamente
                set({ 
                    lists: updatedLists,
                    listsWithStats: updatedListsWithStats,
                    currentListDetails: updatedDetails,
                });
                
                // Luego hacer la llamada a la API en segundo plano
                try {
                    const { updateItemPurchaseStatus } = await import('../services/shoppingLists/shoppingLists');
                    const { updatedList, message } = await updateItemPurchaseStatus(listId, itemId, isPurchased);
                    
                    console.log('🔄 [Store] Lista actualizada en servidor:', updatedList);
                    
                    // Si la respuesta del servidor es diferente, actualizar con los datos del servidor
                    const serverUpdatedLists = currentLists.map(list => 
                        list.list_id === updatedList.list_id ? updatedList : list
                    );
                    
                    const serverUpdatedListsWithStats = currentListsWithStats.map(listItem => {
                        if (listItem.ShoppingList.list_id === updatedList.list_id) {
                            return {
                                ...listItem,
                                ShoppingList: updatedList,
                                stats: {
                                    total_items: updatedList.items.length,
                                    purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                                    pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                                    completion_percentage: updatedList.items.length > 0 
                                        ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                        : 0
                                },
                                item_count: updatedList.items.length
                            };
                        }
                        return listItem;
                    });
                    
                    const serverUpdatedDetails = currentDetails?.ShoppingList.list_id === updatedList.list_id ? {
                        ...currentDetails,
                        ShoppingList: updatedList,
                        stats: {
                            total_items: updatedList.items.length,
                            purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                            pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                            completion_percentage: updatedList.items.length > 0 
                                ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                : 0
                        }
                    } as ShoppingListGet : currentDetails;
                    
                    set({ 
                        lists: serverUpdatedLists,
                        listsWithStats: serverUpdatedListsWithStats,
                        currentListDetails: serverUpdatedDetails,
                        success: true,
                        message,
                    });
                    
                    console.log('🔄 [Store] Estado sincronizado con servidor');
                    
                } catch (error) {
                    // Si hay error, revertir los cambios optimistas
                    set({ 
                        lists: currentLists,
                        listsWithStats: currentListsWithStats,
                        currentListDetails: currentDetails,
                        error: error instanceof Error ? error.message : 'Error desconocido al actualizar el item',
                        success: false,
                    });
                    
                    console.error('Error en updateItemPurchaseStatus store:', error);
                }
            },

            // POST /shopping-lists/:id/items - Agregar item a la lista
            addItemShoppingList: async (id: string, item: ShoppingListItem) => {
                console.log('🔍 [Store] addItemShoppingList llamado con:', { id, item });
                
                if (!id || id.trim() === '') {
                    set({ error: 'ID de lista requerido' });
                    return;
                }
                
                if (!item || !item.name || !item.quantity || !item.unit) {
                    console.log('🔍 [Store] Validación fallida. Item recibido:', item);
                    set({ error: 'Datos del item son requeridos (nombre, cantidad y unidad)' });
                    return;
                }
                console.log('STORE LIST - id: ', id)
                console.log('STORE LIST - item: ', item)
                set({ isLoading: true, error: null });
                
                try {
                    const { addItemShoppingList } = await import('../services/shoppingLists/shoppingLists');
                    const { updatedList, newItem, message } = await addItemShoppingList(id, item);
                    
                    // Actualizar la lista específica en el array de listas
                    const currentLists = get().lists;
                    const updatedLists = currentLists.map(list => 
                        list.list_id === updatedList.list_id ? updatedList : list
                    );
                    
                    // También actualizar listsWithStats para mantener la sincronización
                    const currentListsWithStats = get().listsWithStats;
                    const updatedListsWithStats = currentListsWithStats.map(listItem => {
                        if (listItem.ShoppingList.list_id === updatedList.list_id) {
                            return {
                                ...listItem,
                                ShoppingList: updatedList,
                                stats: {
                                    total_items: updatedList.items.length,
                                    purchased_items: updatedList.items.filter(i => i.is_purchased).length,
                                    pending_items: updatedList.items.filter(i => !i.is_purchased).length,
                                    completion_percentage: updatedList.items.length > 0 
                                        ? Math.round((updatedList.items.filter(i => i.is_purchased).length / updatedList.items.length) * 100) 
                                        : 0
                                },
                                item_count: updatedList.items.length
                            };
                        }
                        return listItem;
                    });
                    
                    set({ 
                        lists: updatedLists,
                        listsWithStats: updatedListsWithStats,
                        success: true,
                        message,
                        isLoading: false 
                    });
                    
                    console.log('Nuevo item agregado:', newItem);
                    
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al agregar el item';
                    
                    set({ 
                        error: errorMessage,
                        success: false,
                        isLoading: false 
                    });
                    
                    console.error('Error en addItemShoppingList store:', error);
                }
            },

        }),
        {
            name: 'shopping-list-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)