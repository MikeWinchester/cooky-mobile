import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import ItemList from "../../components/common/ItemList";
import type { ShoppingListItem } from "../../types/shoppingList";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import IconWithTitle from "../../components/ui/IconWithTitle";
import Categories from "../Categories/Categories";
import { useShoppingListStore } from "../../store/useShoppingListStore";
import { colors, spacing, typography } from "../../styles/globalStyles";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function MyListDetail() {
    const { id: listId } = useLocalSearchParams();
    const router = useRouter();
    const [showCompleted, setShowCompleted] = useState(true);
    const [showCategories, setShowCategories] = useState(false);

    // Store - usando únicamente el store como fuente de verdad
    const { 
        lists, 
        isLoading, 
        error,
        getShoppingListById, 
        deleteItemShoppingList,
        updateItemPurchaseStatus,
        setCurrentListId
    } = useShoppingListStore();

    // Obtener la lista actual del store
    const currentList = listId && typeof listId === 'string' ? lists.find(list => list.list_id === listId) : null;

    // Calcular estadísticas de la lista
    const listStats = React.useMemo(() => {
        if (!currentList?.items) return { total: 0, completed: 0, pending: 0, percentage: 0 };
        
        const total = currentList.items.length;
        const completed = currentList.items.filter(item => item.is_purchased).length;
        const pending = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { total, completed, pending, percentage };
    }, [currentList?.items]);

    // Filtrar items por estado
    const { completedItems, pendingItems } = React.useMemo(() => {
        if (!currentList?.items) return { completedItems: [], pendingItems: [] };
        
        return {
            completedItems: currentList.items.filter(item => item.is_purchased),
            pendingItems: currentList.items.filter(item => !item.is_purchased)
        };
    }, [currentList?.items]);

    // Establecer currentListId cuando cambia el listId
    useEffect(() => {
        if (listId && typeof listId === 'string') {
            setCurrentListId(listId);
        }
    }, [listId, setCurrentListId]);

    // Cargar datos del store cuando cambia la lista o cuando se monta el componente
    useEffect(() => {
        if (!listId) {
            return;
        }
        // Si la lista no está en el store, cargarla
        if (!currentList && typeof listId === 'string') {
            getShoppingListById(listId);
            return;
        }
    }, [listId, currentList, getShoppingListById]);
    
    // Función para alternar el estado de selección de un ingrediente  
    const handleToggleIngredient = async (itemId: string) => {
        if (!listId || !itemId || typeof listId !== 'string') {
            return;
        }
        
        // Buscar el item actual para conocer su estado
        const currentItem = currentList?.items?.find(item => item.item_id === itemId);
        if (!currentItem) {
            return;
        }
        
        const newPurchasedStatus = !currentItem.is_purchased;
        
        try {
            console.log('🔄 [MyListDetail] Actualizando item:', { listId, itemId, newPurchasedStatus });
            
            // Llamar a la función del store para actualizar el estado
            await updateItemPurchaseStatus(listId, itemId, newPurchasedStatus);
            
        } catch (error) {
            console.error('Error toggling ingredient:', error);
        }
    };

    // Función para eliminar un item de la lista
    const onDeleteItem = async (id: string) => {
        if (!listId || typeof listId !== 'string') return;
        
        try {
            await deleteItemShoppingList(listId, id);
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };


    // Renderizar barra de progreso
    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                    {listStats.completed} de {listStats.total} completados
                </Text>
                <Text style={styles.progressPercentage}>{listStats.percentage}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View 
                    style={[
                        styles.progressBar, 
                        { width: `${listStats.percentage}%` }
                    ]} 
                />
            </View>
        </View>
    );

    // Renderizar estadísticas
    const renderStats = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Ionicons name="list-outline" size={20} color={colors.btn.primary} />
                <Text style={styles.statNumber}>{listStats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
                <Ionicons name="time-outline" size={20} color="#F59E0B" />
                <Text style={styles.statNumber}>{listStats.pending}</Text>
                <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={20} color={colors.feedback.success} />
                <Text style={styles.statNumber}>{listStats.completed}</Text>
                <Text style={styles.statLabel}>Completos</Text>
            </View>
        </View>
    );

    // Renderizar sección de items
    const renderItemsSection = (title: string, items: ShoppingListItem[], iconName: string, iconColor: string) => {
        if (items.length === 0) return null;

        return (
            <View style={styles.itemsSection}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name={iconName as any} size={20} color={iconColor} />
                        <Text style={styles.sectionTitle}>{title}</Text>
                        <View style={styles.itemCount}>
                            <Text style={styles.itemCountText}>{items.length}</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.itemsGrid}>
                    {items.map((item: ShoppingListItem, index: number) => (
                        <View key={`${item.item_id || item.name}-${index}`} style={styles.itemWrapper}>
                            <ItemList
                                item={item}
                                onToggle={() => handleToggleIngredient(item.item_id || '')}
                                onDelete={onDeleteItem}
                            />
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    // Estado de carga
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Loading description='Cargando detalles de la lista...' />
            </View>
        );
    }

    // Si no hay listId en params
    if (!listId) {
        return (
            <View style={styles.alertContainer}>
                <Alert type='warning' message='ID de lista no proporcionado' />
            </View>
        );
    }

    // Manejar errores del store
    if (error) {
        return (
            <View style={styles.alertContainer}>
                <Alert type='error' message={error} />
            </View>
        );
    }

    // Si no hay datos de la lista y no está cargando
    if (!currentList && !isLoading) {
        return (
            <View style={styles.alertContainer}>
                <Alert type='warning' message='No se encontraron datos de la lista'>
                    <Button
                        label="Volver a mis listas"
                        onPress={() => router.push('/(app)/list')}
                        variant="primary"
                    />
                </Alert>
            </View>
        );
    }

    // Si no existe la lista, no renderizar nada
    if (!currentList) {
        return null;
    }

    // Si se está mostrando las categorías, renderizar solo Categories
    if (showCategories) {
        return (
            <Categories 
                onBack={() => setShowCategories(false)}
                fromShoppingList={true}
                listId={listId as string}
            />
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
                        <IconWithTitle title={currentList.name} url={'/(app)/list'} />
                        
                        {currentList.description && (
                            <Text style={styles.description}>{currentList.description}</Text>
                        )}
                        
                        <Text style={styles.date}>
                            Creada el {currentList.created_at ? new Date(currentList.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) : ''}
                        </Text>
                        
                        {listStats.total > 0 && (
                            <>
                                {renderProgressBar()}
                                {renderStats()}
                            </>
                        )}
                    </View>
                </LinearGradient>
            </View>

            {/* Contenido scrollable */}
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Lista vacía */}
                {(!currentList.items || currentList.items.length === 0) ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="basket-outline" size={48} color={colors.btn.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Lista vacía</Text>
                        <Text style={styles.emptyDescription}>
                            Comienza agregando items a tu lista de compras
                        </Text>
                        <Button
                            label='Agregar primer item'
                            variant='primary'
                            size='large'
                            style={styles.addFirstButton}
                            onPress={() => setShowCategories(true)}
                        />
                    </View>
                ) : (
                    <>
                        {/* Items pendientes */}
                        {renderItemsSection(
                            "Pendientes por comprar", 
                            pendingItems, 
                            "time-outline", 
                            "#F59E0B"
                        )}

                        {/* Items completados */}
                        {completedItems.length > 0 && (
                            <View style={styles.completedSection}>
                                <TouchableOpacity 
                                    style={styles.completedHeader}
                                    onPress={() => setShowCompleted(!showCompleted)}
                                >
                                    <View style={styles.sectionTitleContainer}>
                                        <Ionicons name="checkmark-circle" size={20} color={colors.feedback.success} />
                                        <Text style={styles.sectionTitle}>Items completados</Text>
                                        <View style={styles.itemCount}>
                                            <Text style={styles.itemCountText}>{completedItems.length}</Text>
                                        </View>
                                    </View>
                                    <Ionicons 
                                        name={showCompleted ? "chevron-up" : "chevron-down"} 
                                        size={20} 
                                        color="#64748B" 
                                    />
                                </TouchableOpacity>
                                
                                {showCompleted && (
                                    <View style={styles.itemsGrid}>
                                        {completedItems.map((item: ShoppingListItem, index: number) => (
                                            <View key={`completed-${item.item_id || item.name}-${index}`} style={styles.itemWrapper}>
                                                <ItemList
                                                    item={item}
                                                    onToggle={() => handleToggleIngredient(item.item_id || '')}
                                                    onDelete={onDeleteItem}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Botón para agregar más items */}
                        <View style={styles.addButtonContainer}>
                            <Button
                                label='+ Agregar más items'
                                variant='primary'
                                size='large'
                                style={styles.addButton}
                                onPress={() => setShowCategories(true)}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
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
        position: 'relative',
        zIndex: 2,
    },
    description: {
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: spacing.sm,
        lineHeight: 22,
        fontWeight: '500',
    },
    date: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    progressContainer: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    progressText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.feedback.success,
        borderRadius: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
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
    alertContainer: {
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
    },
    emptyIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#E0E7FF',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: spacing.sm,
    },
    emptyDescription: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    addFirstButton: {
        minWidth: 200,
    },
    itemsSection: {
        marginBottom: spacing.xl,
    },
    completedSection: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        marginBottom: spacing.md,
    },
    completedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        marginBottom: spacing.md,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    itemCount: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 12,
        minWidth: 24,
        alignItems: 'center',
    },
    itemCountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    itemsGrid: {
        gap: spacing.sm,
    },
    itemWrapper: {
        marginBottom: spacing.xs,
    },
    addButtonContainer: {
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    addButton: {
        width: '100%',
    },
});

export default MyListDetail;