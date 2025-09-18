
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import CategoryCard from '../../components/common/CategoryCard';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import IconWithTitle from "../../components/ui/IconWithTitle";

import { categories } from '../../data/Categories';

import { useRecipesManager } from '../../hooks/recipes/useRecipesManager';
import { useAuthStore } from '../../store/useAuthStore';
import { isPremiumUser } from '../../services/auth/login';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface product {
    id: string;
    name: string;
    svg: string;
}

function IngredientsSelect() {
    const { ingredients, recipes, searchRecipesWithSelectedIngredients, } = useRecipesManager();
    const { user } = useAuthStore();
    const isPremium = user ? isPremiumUser(user) : false; // Verificar si el usuario es premium
    const router = useRouter();
    const [selectedIngredientsData, setSelectedIngredientsData] = useState<product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const maxIngredients = isPremium ? 5 : 4;

    // Cargar datos completos de los ingredientes seleccionados
    useEffect(() => {
        const ingredientNames = ingredients.getIngredients();
        console.log('Ingredientes seleccionados:', ingredientNames);

        // Buscar los datos completos de los ingredientes seleccionados
        const ingredientsData: product[] = [];
        categories.forEach(category => {
            category.products?.forEach(product => {
                if (ingredientNames.includes(product.name)) {
                    ingredientsData.push(product);
                }
            });
        });
        setSelectedIngredientsData(ingredientsData);
    }, [ingredients.getIngredientsCount()]); // Se actualiza cuando cambian los ingredientes

    const handleProductClick = (product: product) => {
        // Remover ingrediente de la selección
        ingredients.removeIngredient(product.name);
        Toast.show({
            type: 'success',
            text1: 'Éxito',
            text2: `${product.name} removido de tus ingredientes`
        });
    }

    // Función para buscar recetas
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
            
            // Navegar a la página de recetas (los ingredientes ya están guardados en lastSearchedIngredients)
            router.push('/(app)/recipe?showRecipes=true');
            
            // Limpiar ingredientes después de búsqueda exitosa
            ingredients.clearIngredients();
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Búsqueda completada. Ingredientes limpiados para nueva búsqueda.'
            });

        } catch (error) {
            console.error('Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al buscar recetas. Intenta de nuevo.'
            });
            // Fallback para desarrollo
            router.push('/(app)/recipes');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    {/* Botón de regreso + Título */}
                    <IconWithTitle title={'Mis ingredientes'} url={'/(app)/categories/recipes'} />
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Ingredientes seleccionados</Text>
                        <Text style={styles.countText}>
                            {ingredients.getIngredientsCount()}/{maxIngredients} seleccionados
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* Ingredientes seleccionados */}
            <View style={styles.ingredientsContainer}>
                {selectedIngredientsData && selectedIngredientsData.length > 0 ? (
                    <>
                        <View style={styles.grid}>
                            {selectedIngredientsData.map((ingredient) => (
                                <View key={ingredient.id} style={styles.ingredientItem}>
                                    <CategoryCard
                                        id={ingredient.id}
                                        name={ingredient.name}
                                        svg={ingredient.svg}
                                        onClick={() => handleProductClick(ingredient)}
                                        style={styles.selectedCard}
                                    />
                                    {/* Indicador de seleccionado */}
                                    <View style={styles.checkIndicator}>
                                        <Text style={styles.checkText}>✓</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.instructionText}>
                            Toca un ingrediente para removerlo de tu selección
                        </Text>
                    </>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Alert
                            message='No has seleccionado ningún ingrediente.'
                            type='info'
                        />
                    </View>
                )}
            </View>
            <View style={styles.buttonsContainer}>
                <Button
                    label={isLoading
                        ? 'Generando recetas...'
                        : selectedIngredientsData.length < 2
                            ? 'Selecciona al menos 2 ingredientes'
                            : `Generar Recetas`
                    }
                    variant="secondary"
                    size="medium"
                    onPress={handleSearchRecipes}
                    disabled={ingredients.getIngredientsCount() < 2 || isLoading || recipes.isLoading}
                    style={styles.generateButton}
                />
                {selectedIngredientsData.length < maxIngredients && (
                    <Button
                        label={'Agregar más ingredientes'}
                        variant="outline"
                        size="medium"
                        onPress={() => router.push('/(app)/categories/recipes')}
                        style={styles.addButton}
                    />
                )}
            </View>
            
            {selectedIngredientsData.length > 0 && (
                <Text style={styles.ingredientsList}>
                    Ingredientes: {selectedIngredientsData.map(ing => ing.name).join(', ')}
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg.primary,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
    },
    headerContent: {
        marginBottom: spacing.md,
    },
    subtitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
    },
    countText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.tertiary,
    },
    ingredientsContainer: {
        borderRadius: 8,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    ingredientItem: {
        position: 'relative',
        width: '48%',
        marginBottom: spacing.md,
    },
    selectedCard: {
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
    },
    checkIndicator: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#10B981',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    emptyContainer: {
        alignItems: 'center',
    },
    buttonsContainer: {
        gap: spacing.md,
        alignItems: 'center',
    },
    generateButton: {
        width: '100%',
    },
    addButton: {
        width: '100%',
    },
    ingredientsList: {
        fontSize: typography.fontSize.xs,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});

export default IngredientsSelect;