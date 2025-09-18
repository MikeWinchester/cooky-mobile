import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { categories } from '../../data/Categories';
import type { FormFieldConfig } from '../../types';
import Button from '../../components/common/Button';
import CategoryCard from '../../components/common/CategoryCard';
import Modal from '../../components/common/Modal';
import DynamicForm from '../../components/common/DynamicForm';
import Alert from '../../components/common/Alert';
import { useIngredients } from '../../hooks/recipes/useIngredients';
import { useRecipesManager } from '../../hooks/recipes/useRecipesManager';
import { useAuthStore } from '../../store/useAuthStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { isPremiumUser } from '../../services/auth/login';
import { colors, spacing, typography } from '../../styles/globalStyles';
import React from 'react';

const { width: screenWidth } = Dimensions.get('window');

interface CategoryProductsProps {
    categoryId: string;
    title?: string;
    backUrl?: string;
    subtitle?: string;
    onBack?: () => void;
    fromShoppingList?: boolean;
    listId?: string;
}

interface product {
    id: string;
    name: string;
    svg: string;
}

function CategoryProducts({ 
    categoryId: propCategoryId, 
    title: propTitle, 
    backUrl: propBackUrl, 
    subtitle: propSubtitle, 
    onBack,
    fromShoppingList,
    listId
}: CategoryProductsProps) {
    const { hasIngredient, toggleIngredient, getIngredientsCount, canAddMore, isFull, clearIngredients } = useIngredients();
    const { ingredients, recipes, searchRecipesWithSelectedIngredients } = useRecipesManager();
    const { user } = useAuthStore();
    const { addItemShoppingList, currentListId } = useShoppingListStore();
    const isPremium = user ? isPremiumUser(user) : false;
    
    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const categoryId = propCategoryId;
    
    // Limpiar ingredientes cuando viene desde listas de compras
    useEffect(() => {
        if (fromShoppingList) {
            clearIngredients();
        }
    }, [fromShoppingList, clearIngredients]);
    
    // Obtener valores de URL params o usar props como fallback
    const backUrl = (searchParams.backUrl as string) || propBackUrl || '/(app)/categories';
    const isForRecipes = backUrl === '/(app)/recipe' || backUrl.includes('/recipe');
    const title = (searchParams.title as string) || propTitle || (isForRecipes ? 'Seleccionar Ingredientes' : 'Productos');
    const subtitle = (searchParams.subtitle as string) || propSubtitle || 'Selecciona productos';
    
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const maxIngredients = isPremium ? 5 : 4;
    const category = categories.find(cat => cat.id === categoryId);
    
    const addProductFormFields: FormFieldConfig[] = [
        {
            name: 'count',
            type: 'number',
            label: 'Cantidad',
            placeholder: 'Cuanto ocupas',
            required: true,
            validation: { min: 1, max: 50 }
        },
        {
            name: 'unidad',
            type: 'list',
            label: 'Unidad',
            placeholder: 'Selecciona una unidad',
            required: true,
            options: [
                { value: 'libra', label: 'Libra(s)' },
                { value: 'unidad', label: 'Unidad(es)' },
                { value: 'onza', label: 'Onza(s)' },
                { value: 'gramo', label: 'Gramo(s)' }
            ]
        }
    ];

    const handleAddProduct = async (formData: Record<string, string | number | boolean>) => {
        if (!selectedProduct) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No hay producto seleccionado'
            });
            return;
        }
        
        const targetListId = fromShoppingList ? listId : currentListId;
        
        if (!targetListId) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No hay lista seleccionada. Ve a "Mis Listas" y selecciona una lista primero.'
            });
            router.push('/(app)/list');
            return;
        }

        try {
            setIsLoading(true);
            const newShoppingListItem = {
                name: selectedProduct.name,
                quantity: Number(formData.count),
                unit: String(formData.unidad),
                is_purchased: false,
                is_optional: false,
                notes: ''
            };

            await addItemShoppingList(targetListId, newShoppingListItem);
            setIsOpenModal(false);
            setSelectedProduct(null);
            
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: `${selectedProduct.name} agregado a la lista`
            });
            
            router.push(`/(app)/list/${currentListId}`);
        } catch (error) {
            console.error('Error adding product to list:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al agregar el producto a la lista'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = (product: product) => {
        console.log('🛒 [CategoryProducts] Producto seleccionado:', product);
        console.log('🛒 [CategoryProducts] fromShoppingList:', fromShoppingList);
        console.log('🛒 [CategoryProducts] isForRecipes:', isForRecipes);
        
        if (fromShoppingList) {
            setSelectedProduct(product);
            setIsOpenModal(true);
        } else if (!isForRecipes) {
            setSelectedProduct(product);
            setIsOpenModal(true);
        } else {
            handleIngredientSelection(product);
        }
    };

    const handleIngredientSelection = (product: product) => {
        const isAlreadySelected = hasIngredient(product.name);
        
        if (isAlreadySelected) {
            toggleIngredient(product.name);
        } else if (canAddMore(maxIngredients)) {
            toggleIngredient(product.name);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Solo puedes seleccionar ${maxIngredients} ingredientes.`
            });
            return;
        }
    };

    const handleSearchRecipes = async () => {
        if (ingredients.getIngredientsCount() < 2) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Debes seleccionar al menos dos ingredientes'
            });
            return;
        }

        setIsLoading(true);
        try {
            await searchRecipesWithSelectedIngredients();
            
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Recetas generadas exitosamente'
            });
            
            // Navegar después de mostrar el toast
            setTimeout(() => {
                router.push('/(app)/recipe?showRecipes=true');
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            router.push('/(app)/recipe?showRecipes=true');
        } finally {
            setIsLoading(false);
        }
    };

    if (!category) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <View style={styles.errorContent}>
                        <View style={styles.errorIcon}>
                            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                        </View>
                        <Text style={styles.errorTitle}>Categoría no encontrada</Text>
                        <Text style={styles.errorSubtitle}>
                            No pudimos encontrar la categoría solicitada
                        </Text>
                        <Button
                            label="Volver a categorías"
                            onPress={() => router.push('/(app)/categories')}
                            variant="primary"
                            style={styles.errorButton}
                        />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con gradiente mejorado */}
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
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => onBack ? onBack() : router.push(backUrl)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="chevron-back" size={20} color="#1E293B" />
                        </TouchableOpacity>
                        
                        <View style={styles.headerTextContainer}>
                            <View style={styles.categoryTitleContainer}>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <View style={styles.productsBadge}>
                                    <Text style={styles.productsCount}>
                                        {category.products?.length || 0}
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.headerSubtitleContainer}>
                                <Ionicons 
                                    name={isForRecipes ? "restaurant-outline" : "bag-outline"} 
                                    size={16} 
                                    color="rgba(255, 255, 255, 0.8)" 
                                />
                                <Text style={styles.headerSubtitle}>{subtitle}</Text>
                                {isForRecipes && (
                                    <View style={styles.ingredientsBadge}>
                                        <Text style={styles.ingredientsCount}>
                                            {getIngredientsCount()}/{maxIngredients}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                    
                    {/* Onda inferior */}
                    <View style={styles.waveContainer}>
                        <View style={styles.wave} />
                    </View>
                </LinearGradient>
            </View>

            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Indicador de contexto */}
                <View style={styles.contextIndicator}>
                    <View style={[
                        styles.contextIcon, 
                        { backgroundColor: isForRecipes ? '#ECFDF5' : '#EFF6FF' }
                    ]}>
                        <Ionicons 
                            name={isForRecipes ? "restaurant" : "bag"} 
                            size={18} 
                            color={isForRecipes ? '#10B981' : '#3B82F6'} 
                        />
                    </View>
                    <Text style={styles.contextText}>
                        {isForRecipes 
                            ? 'Toca los productos para agregarlos como ingredientes' 
                            : 'Selecciona productos para agregar a tu lista de compras'
                        }
                    </Text>
                </View>

                {/* Sección de productos */}
                <View style={styles.productsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Productos Disponibles</Text>
                        <View style={styles.productsCountBadge}>
                            <Text style={styles.countText}>
                                {category.products?.length || 0}
                            </Text>
                        </View>
                    </View>

                    {category.products && category.products.length > 0 ? (
                        <View style={styles.grid}>
                            {category.products.map((product, index) => {
                                const isSelected = isForRecipes && hasIngredient(product.name);
                                const isDisabled = isForRecipes && !isSelected && isFull(maxIngredients);
                                
                                return (
                                    <View key={product.id} style={styles.productWrapper}>
                                        <CategoryCard
                                            id={product.id}
                                            name={product.name}
                                            svg={product.svg}
                                            onClick={() => handleProductClick(product)}
                                            style={[
                                                styles.categoryCard,
                                                isSelected && styles.selectedCard,
                                                isDisabled && styles.disabledCard,
                                                // Animación escalonada
                                                { 
                                                    transform: [{ 
                                                        translateY: Math.sin(index * 0.3) * 1.5 
                                                    }] 
                                                }
                                            ]}
                                        />
                                        
                                        {/* Indicador de estado */}
                                        {isForRecipes && isSelected && (
                                            <View style={styles.selectedIndicator}>
                                                <Ionicons 
                                                    name="checkmark-circle" 
                                                    size={16} 
                                                    color="#10B981" 
                                                />
                                                <Text style={styles.selectedText}>Seleccionado</Text>
                                            </View>
                                        )}
                                        
                                        {isForRecipes && isDisabled && (
                                            <View style={styles.disabledIndicator}>
                                                <Text style={styles.disabledText}>Límite alcanzado</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
                            <Text style={styles.emptyTitle}>Sin productos</Text>
                            <Text style={styles.emptySubtitle}>
                                No hay productos disponibles en esta categoría
                            </Text>
                        </View>
                    )}
                </View>

                {/* Sección de acciones para recetas */}
                {isForRecipes && getIngredientsCount() > 0 && !fromShoppingList && (
                    <View style={styles.actionsSection}>
                        <View style={styles.ingredientsSummary}>
                            <View style={styles.summaryHeader}>
                                <Ionicons name="restaurant" size={20} color="#10B981" />
                                <Text style={styles.summaryTitle}>Ingredientes Seleccionados</Text>
                            </View>
                            <Text style={styles.ingredientsList}>
                                {ingredients.getIngredients().join(' • ')}
                            </Text>
                        </View>
                        
                        <Button
                            label={`Generar Recetas (${getIngredientsCount()} ingredientes)`}
                            variant="secondary"
                            size="medium"
                            onPress={handleSearchRecipes}
                            disabled={ingredients.getIngredientsCount() < 2 || isLoading || recipes.isLoading}
                            style={styles.generateButton}
                        />
                    </View>
                )}

                {/* Espaciado final */}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Modal para agregar producto */}
            {selectedProduct && (
                <Modal
                    isOpen={isOpenModal}
                    type='info'
                    title={`Agregar: ${selectedProduct.name}`}
                    onConfirm={() => {}}
                    onCancel={() => {
                        setIsOpenModal(false);
                        setSelectedProduct(null);
                    }}
                >
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                            Agregar {selectedProduct.name} a la lista
                        </Text>
                        
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 14, marginBottom: 5 }}>Cantidad:</Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16
                                }}
                                placeholder="Ej: 2"
                                keyboardType="numeric"
                            />
                        </View>
                        
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, marginBottom: 5 }}>Unidad:</Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16
                                }}
                                placeholder="Ej: kg, unidad, etc."
                            />
                        </View>
                        
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#FF8A65',
                                    padding: 15,
                                    borderRadius: 8,
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    console.log('Agregando producto:', selectedProduct.name);
                                    setIsOpenModal(false);
                                    setSelectedProduct(null);
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                    Agregar a la lista
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#f0f0f0',
                                    padding: 15,
                                    borderRadius: 8,
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    setIsOpenModal(false);
                                    setSelectedProduct(null);
                                }}
                            >
                                <Text style={{ color: '#333', fontWeight: 'bold' }}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
    },
    
    // Header con gradiente (similar a Categories)
    headerContainer: {
        height: 160,
        position: 'relative',
    },
    headerGradient: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    floatingShape: {
        position: 'absolute',
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    shape1: {
        width: 120,
        height: 120,
        top: -30,
        right: -40,
    },
    shape2: {
        width: 80,
        height: 80,
        top: 50,
        right: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    shape3: {
        width: 60,
        height: 60,
        top: 80,
        left: -20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl * 2,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTextContainer: {
        flex: 1,
    },
    categoryTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginRight: spacing.sm,
    },
    productsBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    productsCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerSubtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '400',
        marginRight: spacing.xs,
    },
    ingredientsBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    ingredientsCount: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    waveContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 25,
    },
    wave: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 25,
        backgroundColor: '#FAFBFC',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    // Contenido
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
    },

    // Indicador de contexto
    contextIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.md,
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    contextIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    contextText: {
        flex: 1,
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        lineHeight: 20,
    },

    // Sección de productos
    productsSection: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1E293B',
    },
    productsCountBadge: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        minWidth: 32,
        alignItems: 'center',
    },
    countText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Grid de productos
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    productWrapper: {
        width: (screenWidth - spacing.lg * 2 - spacing.md * 2) / 2,
        marginBottom: spacing.md,
        alignItems: 'center',
    },
    categoryCard: {
        aspectRatio: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        width: '100%',
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
        transform: [{ scale: 0.95 }],
    },
    disabledCard: {
        opacity: 0.4,
        transform: [{ scale: 0.95 }],
    },

    // Indicadores de estado
    selectedIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        backgroundColor: '#ECFDF5',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: spacing.sm,
        gap: 4,
    },
    selectedText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#10B981',
    },
    disabledIndicator: {
        marginTop: spacing.xs,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: spacing.sm,
    },
    disabledText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#EF4444',
        textAlign: 'center',
    },

    // Estado vacío
    emptyState: {
        alignItems: 'center',
        padding: spacing.xl * 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginTop: spacing.lg,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Sección de acciones para recetas
    actionsSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    ingredientsSummary: {
        marginBottom: spacing.lg,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        gap: spacing.xs,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    ingredientsList: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        backgroundColor: '#F8FAFC',
        padding: spacing.sm,
        borderRadius: 8,
        fontStyle: 'italic',
    },
    generateButton: {
        width: '100%',
    },

    // Error state mejorado
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorContent: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: spacing.xl * 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
        maxWidth: 300,
    },
    errorIcon: {
        marginBottom: spacing.lg,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    errorSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 20,
    },
    errorButton: {
        minWidth: 200,
    },

     // Espaciado
     bottomSpacing: {
         height: spacing.xl,
     },
 });

 export default CategoryProducts;