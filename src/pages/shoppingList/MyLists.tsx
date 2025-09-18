import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import ListCard from "../../components/common/ListCard";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import DynamicForm from "../../components/common/DynamicForm";
import { useShoppingListStore } from "../../store/useShoppingListStore";
import type { ShoppingList } from "../../types/shoppingList";
import type { FormFieldConfig, ListCardProps } from "../../types";
import { findSvgByName } from "../../utils/ingredientSvg";
import { colors, spacing, typography } from "../../styles/globalStyles";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function MyList() {
    const router = useRouter();
    
    // Store
    const { 
        lists,
        listsWithStats, 
        isLoading, 
        error, 
        success,
        message,
        getShoppingList, 
        saveShoppingList, 
        deleteShoppingListById,
        setCurrentListId,
    } = useShoppingListStore();

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        listId: string | null;
        listName: string;
    }>({ isOpen: false, listId: null, listName: '' });

    const [newListModal, setNewListModal] = useState<{
        isOpen: boolean;
    }>({ isOpen: false });

    const newListFormFields: FormFieldConfig[] = [
        {
            name: 'nameList',
            type: 'text',
            label: 'Nombre de la lista',
            placeholder: 'Ej: Lista de compras para el almuerzo',
            required: true,
            validation: {
                minLength: 3,
                maxLength: 50
            }
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Descripción (opcional)',
            placeholder: 'Describe para qué es esta lista...',
            required: false,
            validation: {
                maxLength: 200
            }
        }
    ]

    // Cargar listas al montar el componente
    useEffect(() => {
        loadLists();
    }, []);
    
    // Mostrar mensajes de éxito
    useEffect(() => {
        if (success && message) {
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: message
            });
        }
    }, [success, message]);

    // Función para cargar listas
    const loadLists = useCallback(async () => {
        await getShoppingList();
    }, [getShoppingList]);

    // Función para abrir modal de confirmación de eliminación
    const handleDeleteClick = useCallback((listId: string, listName: string) => {
        setDeleteModal({
            isOpen: true,
            listId,
            listName
        });
    }, []);

    // Función para confirmar eliminación
    const handleConfirmDelete = useCallback(async () => {
        if (!deleteModal.listId) return;
        try {
            await deleteShoppingListById(deleteModal.listId);
            setDeleteModal({ isOpen: false, listId: null, listName: '' });
        } catch (err) {
            console.error('Error deleting list:', err);
        }
    }, [deleteModal.listId, deleteShoppingListById]);

    // Función para cancelar eliminación
    const handleCancelDelete = useCallback(() => {
        setDeleteModal({ isOpen: false, listId: null, listName: '' });
    }, []);

    // Función para manejar click en tarjeta
    const handleCardClick = useCallback((listId: string) => {
        try {
            setCurrentListId(listId);
            router.push(`/list/${listId}`);
        } catch (err) {
            console.error('Navigation error:', err);
        }
    }, [router, setCurrentListId]);

    // Función para crear nueva lista
    const handleCreateList = () => {
        setNewListModal({isOpen: true})
    };

    // Función para guardar nueva lista
    const handleSaveList = async (formData: Record<string, string | number | boolean>) => {
        try {
            const newShoppingList: ShoppingList = {
                name: formData.nameList as string,
                description: formData.description as string,
                items: [],
                created_at: new Date().toISOString()
            };
            
            await saveShoppingList(newShoppingList);
            setNewListModal({ isOpen: false });
        } catch (err) {
            console.error('Error creating new list:', err);
        }
    };

    // Función para recargar listas
    const handleRefresh = useCallback(() => {
        loadLists();
    }, [loadLists]);

    // Renderizar estadísticas del header
    const renderStats = () => {
        const totalItems = lists.reduce((acc, list) => acc + list.items.length, 0);
        const completedLists = lists.filter(list => 
            list.items.length > 0 && list.items.every(item => item.is_purchased)
        ).length;

        return (
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="list-outline" size={20} color={colors.btn.primary} />
                    <Text style={styles.statNumber}>{lists.length}</Text>
                    <Text style={styles.statLabel}>Listas</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="bag-outline" size={20} color={colors.btn.secondary} />
                    <Text style={styles.statNumber}>{totalItems}</Text>
                    <Text style={styles.statLabel}>Items</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={colors.feedback.success} />
                    <Text style={styles.statNumber}>{completedLists}</Text>
                    <Text style={styles.statLabel}>Completas</Text>
                </View>
            </View>
        );
    };

    // Estados de carga y error
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Loading description='Cargando listas...' />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Alert message={error} type='error'>
                    <Button
                        label="Reintentar"
                        onPress={handleRefresh}
                        variant="primary"
                    />
                </Alert>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con gradiente */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={['#FF8A65', '#FF7043', '#FF5722']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Formas decorativas */}
                    <View style={[styles.floatingShape, styles.shape1]} />
                    <View style={[styles.floatingShape, styles.shape2]} />
                    <View style={[styles.floatingShape, styles.shape3]} />
                    
                    <View style={styles.headerContent}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Mis Listas</Text>
                            <Text style={styles.headerSubtitle}>
                                {lists.length === 0
                                    ? 'Comienza creando tu primera lista'
                                    : `${lists.length} lista${lists.length !== 1 ? 's' : ''} de compras`
                                }
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.addButtonHeader}
                            onPress={handleCreateList}
                        >
                            <Ionicons name="add" size={24} color={colors.btn.primary} />
                        </TouchableOpacity>
                    </View>
                    
                    {lists.length > 0 && renderStats()}
                </LinearGradient>
            </View>

            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Lista de tarjetas o mensaje vacío */}
                {lists.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIllustration}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="document-text-outline" size={40} color={colors.btn.primary} />
                            </View>
                            <View style={styles.emptyIconContainer2}>
                                <Ionicons name="add-circle" size={24} color={colors.btn.secondary} />
                            </View>
                        </View>
                        
                        <Text style={styles.emptyTitle}>¡Organiza tus compras!</Text>
                        <Text style={styles.emptyDescription}>
                            Crea listas personalizadas para tus compras del supermercado, 
                            farmacia o cualquier lugar. Mantén todo organizado en un solo lugar.
                        </Text>
                        
                        <Button
                            label="Crear mi primera lista"
                            onPress={handleCreateList}
                            variant="primary"
                            size="large"
                            style={styles.createButton}
                        />
                    </View>
                ) : (
                    <View style={styles.listsContainer}>
                        <View style={styles.listsGrid}>
                            {(listsWithStats.length > 0 ? listsWithStats : lists.map(list => ({ 
                                ShoppingList: list, 
                                stats: { 
                                    total_items: list.items.length, 
                                    purchased_items: list.items.filter(i => i.is_purchased).length, 
                                    pending_items: list.items.filter(i => !i.is_purchased).length, 
                                    completion_percentage: list.items.length > 0 ? Math.round((list.items.filter(i => i.is_purchased).length / list.items.length) * 100) : 0
                                }, 
                                formatted_created_at: list.created_at ? new Date(list.created_at).toLocaleDateString() : '', 
                                item_count: list.items.length 
                            }))).map((listGetItem) => {
                                const item = listGetItem.ShoppingList;
                                const stats = listGetItem.stats;
                                
                                const adaptedItem: ListCardProps = {
                                    id: item.list_id || '',
                                    nameList: item.name,
                                    description: item.description || `${stats.total_items} items • ${stats.completion_percentage}% completado`,
                                    date: listGetItem.formatted_created_at || (item.created_at ? new Date(item.created_at).toLocaleDateString() : ''),
                                    itemsList: item.items.slice(0, 5).map(shoppingItem => ({
                                        id: shoppingItem.item_id || '',
                                        name: shoppingItem.name,
                                        quantity: `${shoppingItem.quantity} ${shoppingItem.unit}`,
                                        svg: findSvgByName(shoppingItem.name),
                                        isSelected: shoppingItem.is_purchased
                                    }))
                                };
                                
                                return (
                                    <View key={adaptedItem.id} style={styles.cardWrapper}>
                                        <ListCard
                                            id={adaptedItem.id}
                                            nameList={adaptedItem.nameList}
                                            description={adaptedItem.description}
                                            date={adaptedItem.date}
                                            itemsList={adaptedItem.itemsList}
                                            onDelete={() => handleDeleteClick(adaptedItem.id, adaptedItem.nameList)}
                                            onClick={() => handleCardClick(adaptedItem.id)}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

            </ScrollView>

            {/* Modal de confirmación de eliminación */}
            <Modal
                isOpen={deleteModal.isOpen}
                type="delete"
                title="Eliminar Lista"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            >
                <View style={styles.modalContent}>
                    <View style={styles.deleteIconContainer}>
                        <Ionicons name="trash" size={32} color="#EF4444" />
                    </View>
                    <Text style={styles.deleteText}>
                        ¿Estás seguro de que quieres eliminar{' '}
                        <Text style={styles.deleteListName}>"{deleteModal.listName}"</Text>?
                    </Text>
                    <Text style={styles.deleteWarning}>
                        Esta acción no se puede deshacer y perderás todos los items de la lista.
                    </Text>
                </View>
            </Modal>

            {/* Modal para agregar una nueva lista */}
            <Modal
                isOpen={newListModal.isOpen}
                type='info'
                title="Nueva Lista de Compras"
                onConfirm={() => {}}
                onCancel={() => setNewListModal({ isOpen: false })}
            >
                <View style={styles.formContainer}>
                    <DynamicForm
                        fields={newListFormFields}
                        onSubmit={handleSaveList}
                        submitButtonText="Crear Lista"
                        submitButtonVariant="primary"
                        resetOnSubmit={true}
                    >
                        <Button
                            label='Cancelar'
                            variant='outline'
                            onPress={() => setNewListModal({ isOpen: false })}
                            style={styles.cancelButton}
                        />
                    </DynamicForm>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerContainer: {
        position: 'relative',
        overflow: 'hidden',
    },
    headerGradient: {
        paddingTop: spacing.xl * 2,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        position: 'relative',
    },
    floatingShape: {
        position: 'absolute',
        borderRadius: 50,
        opacity: 0.1,
    },
    shape1: {
        width: 100,
        height: 100,
        backgroundColor: '#FFFFFF',
        top: -20,
        right: -20,
    },
    shape2: {
        width: 60,
        height: 60,
        backgroundColor: '#FFFFFF',
        top: 40,
        left: -10,
    },
    shape3: {
        width: 80,
        height: 80,
        backgroundColor: '#FFFFFF',
        bottom: -20,
        right: 40,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        position: 'relative',
        zIndex: 2,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    addButtonHeader: {
        backgroundColor: '#FFFFFF',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingTop: spacing.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        gap: spacing.xs,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: spacing.lg,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['2xl'],
        paddingHorizontal: spacing.lg,
    },
    emptyIllustration: {
        position: 'relative',
        marginBottom: spacing.xl,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#E0E7FF',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIconContainer2: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    createButton: {
        minWidth: 200,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    listsContainer: {
        gap: spacing.lg,
    },
    listsGrid: {
        gap: spacing.md,
    },
    cardWrapper: {
        marginBottom: spacing.sm,
    },
    floatingActionButton: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.lg,
        backgroundColor: colors.btn.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 28,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        gap: spacing.sm,
    },
    floatingButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContent: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    deleteIconContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#FEF2F2',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    deleteText: {
        fontSize: 16,
        color: '#374151',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.md,
    },
    deleteListName: {
        fontWeight: '600',
        color: '#1F2937',
    },
    deleteWarning: {
        fontSize: 14,
        color: '#EF4444',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    formContainer: {
        width: '100%',
    },
    cancelButton: {
        marginTop: spacing.sm,
    },
});

export default MyList;