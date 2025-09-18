import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import CategoryCard from '../../components/common/CategoryCard';
import IconWithTitle from "../../components/ui/IconWithTitle";
import CategoryProducts from './CategoryProducts';

import { categories } from '../../data/Categories';
import { colors, spacing, typography } from '../../styles/globalStyles';
import React from 'react';

const { width: screenWidth } = Dimensions.get('window');

interface CategoriesProps {
    title?: string;
    backUrl?: string;
    subtitle?: string;
    onBack?: () => void;
    fromShoppingList?: boolean;
    listId?: string;
}

function Categories({ title: propTitle, backUrl: propBackUrl, subtitle: propSubtitle, onBack, fromShoppingList, listId }: CategoriesProps) {
    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    
    // Obtener valores de URL params o usar props como fallback
    const backUrl = (searchParams.backUrl as string) || propBackUrl || '/(app)/recipe';
    const isForRecipes = backUrl === '/(app)/recipe' || backUrl.includes('/recipe');
    const title = (searchParams.title as string) || propTitle || (fromShoppingList ? 'Agregar Items' : (isForRecipes ? 'Seleccionar Ingredientes' : 'Listas de compras'));
    const subtitle = (searchParams.subtitle as string) || propSubtitle || (fromShoppingList ? 'Selecciona una categoría' : (isForRecipes ? 'Elige ingredientes' : 'Categorías'));

    const handleCategoryClick = useCallback((categoryId: string) => {
        // Mostrar la página de productos de la categoría
        console.log('Navigating to category:', categoryId);
        setSelectedCategoryId(categoryId);
    }, []);

    // Si se seleccionó una categoría, mostrar los productos
    if (selectedCategoryId) {
        return (
            <CategoryProducts 
                categoryId={selectedCategoryId}
                title={title}
                subtitle={subtitle}
                backUrl={backUrl}
                onBack={() => setSelectedCategoryId(null)}
                fromShoppingList={fromShoppingList}
                listId={listId}
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
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => onBack ? onBack() : router.push(backUrl)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="chevron-back" size={20} color="#1E293B" />
                        </TouchableOpacity>
                        
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>{title}</Text>
                            <View style={styles.headerSubtitleContainer}>
                                <Ionicons 
                                    name={isForRecipes ? "restaurant-outline" : "bag-outline"} 
                                    size={16} 
                                    color="rgba(255, 255, 255, 0.8)" 
                                />
                                <Text style={styles.headerSubtitle}>{subtitle}</Text>
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
                            ? 'Selecciona ingredientes para generar recetas' 
                            : 'Elige una categoría para agregar productos'
                        }
                    </Text>
                </View>

                {/* Grid de categorías mejorado */}
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Todas las Categorías</Text>
                        <View style={styles.categoriesCount}>
                            <Text style={styles.countText}>{categories.length}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.grid}>
                        {categories.map((category, index) => (
                            <View key={category.id} style={styles.categoryWrapper}>
                                <CategoryCard
                                    id={category.id}
                                    name={category.name}
                                    svg={category.svg}
                                    onClick={() => handleCategoryClick(category.id)}
                                    style={[
                                        styles.categoryCard,
                                        // Animación escalonada
                                        { 
                                            transform: [{ 
                                                translateY: Math.sin(index * 0.3) * 2 
                                            }] 
                                        }
                                    ]}
                                />
                                
                                {/* Indicador de productos */}
                                <View style={styles.productIndicator}>
                                    <Text style={styles.productCount}>
                                        {category.products?.length || 0} productos
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>


                {/* Espaciado final */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
    },

    // Header con gradiente
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
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
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

    // Sección de categorías
    categoriesSection: {
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
    categoriesCount: {
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

    // Grid mejorado
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    categoryWrapper: {
        width: (screenWidth - spacing.lg * 2 - spacing.md * 2) / 2,
        marginBottom: spacing.md,
    },
    categoryCard: {
        aspectRatio: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    productIndicator: {
        alignItems: 'center',
        marginTop: spacing.xs,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: spacing.sm,
    },
    productCount: {
        fontSize: 11,
        fontWeight: '500',
        color: '#64748B',
    },


    bottomSpacing: {
        height: spacing.xl,
    },
});

export default Categories;