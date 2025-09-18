import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from '@expo/vector-icons'

import { Button } from "../../components/recipe/Button"
import { Card, CardContent } from "../../components/recipe/Card"
import { Badge } from "../../components/recipe/Badge"

import { useRecipesManager } from '../../hooks/recipes/useRecipesManager';
import type { Recipe } from '../../types';
import { colors, spacing, typography } from '../../styles/globalStyles';


interface SavedRecipesProps {
  onBack?: () => void;
}

export default function RecetasGuardadas({ onBack }: SavedRecipesProps) {
    const [recetasGuardadas, setRecetasGuardadas] = useState<Recipe[]>([])
    const { recipes } = useRecipesManager();

    const router = useRouter();

    const recetas = recipes.recipes || [];

    const handleRecipeClick = (recipe: Recipe) => {
        // Navegar a la página de detalles usando el recipe_id único
        if (recipe.recipe_id) {
            router.push(`/recipes/details/${recipe.recipe_id}`);
        }
    }

    useEffect(() => {
        // En React Native usaremos AsyncStorage en lugar de localStorage
        // Por ahora simulamos con un estado local
        setRecetasGuardadas([]);
    }, []);


    const eliminarReceta = (id: string) => {
        setRecetasGuardadas((recetas) => recetas.filter((receta) => receta.recipe_id !== id))
    }

    const recetasPremium = recetasGuardadas.filter(
        (r) => r.sustitucion && r.sustitucion.trim() !== ""
    );

    const recetasFree = recetasGuardadas.filter(
        (r) => !r.sustitucion || r.sustitucion.trim() === ""
    );


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => onBack ? onBack() : router.back()}
                    >
                        <Ionicons name="arrow-back" size={20} color="#FFF8EC" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Comidas Preferidas</Text>
                </View>
                <Text style={styles.subtitle}>{recetasGuardadas.length} recetas en tu colección</Text>
            </View>

            {recetasGuardadas.length === 0 ? (
                /* Estado vacío */
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="heart" size={48} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyTitle}>No hay recetas guardadas</Text>
                    <Text style={styles.emptySubtitle}>Guarda tus recetas favoritas para acceder a ellas fácilmente</Text>
                    <Button 
                        variant="secondary"
                        onPress={() => router.push('/(app)/recipe')}
                        style={styles.exploreButton}
                    >
                        Explorar Recetas
                    </Button>
                </View>
            ) : (
                <View style={styles.content}>
                    {/* Recetas Premium */}
                    {recetasPremium.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.premiumIndicator} />
                                <Text style={styles.sectionTitle}>Recetas Premium</Text>
                                <Badge variant="outline" style={styles.badge}>
                                    {recetasPremium.length}
                                </Badge>
                            </View>
                            <View style={styles.recipesList}>
                                {recetasPremium.map((receta) => (
                                    <TouchableOpacity key={receta.recipe_id} onPress={() => handleRecipeClick(receta)}>
                                        <Card style={styles.premiumCard}>
                                            <CardContent style={styles.cardContent}>
                                            <View style={styles.recipeRow}>
                                                <Image
                                                    source={{ uri: receta.image_url || "/placeholder.svg" }}
                                                    style={styles.recipeImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.recipeInfo}>
                                                    <View style={styles.recipeHeader}>
                                                        <Text style={styles.recipeName}>{receta.name}</Text>
                                                        <TouchableOpacity
                                                            style={styles.deleteButton}
                                                            onPress={() => receta.recipe_id && eliminarReceta(receta.recipe_id)}
                                                        >
                                                            <Ionicons name="trash" size={16} color="#EF4444" />
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={styles.recipeStats}>
                                                        <View style={styles.statItem}>
                                                            <Ionicons name="time" size={12} color="#6B7280" />
                                                            <Text style={styles.statText}>{receta.cooking_time}</Text>
                                                        </View>
                                                        <View style={styles.statItem}>
                                                            <Ionicons name="restaurant" size={12} color="#6B7280" />
                                                            <Text style={styles.statText}>{receta.difficulty}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.recipeFooter}>
                                                        <View style={styles.ingredientsContainer}>
                                                            {(receta.recipe_ingredients || []).slice(0, 2).map((ingrediente, index) => (
                                                                <Badge key={index} variant="outline" style={styles.ingredientBadge}>
                                                                    {ingrediente.name}
                                                                </Badge>
                                                            ))}
                                                            {(receta.recipe_ingredients || []).length > 2 && (
                                                                <Badge variant="outline" style={styles.ingredientBadge}>
                                                                    +{(receta.recipe_ingredients || []).length - 2}
                                                                </Badge>
                                                            )}
                                                        </View>
                                                        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </CardContent>
                                        </Card>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Recetas Free */}
                    {recetasFree.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.freeIndicator} />
                                <Text style={styles.sectionTitle}>Recetas Gratuitas</Text>
                                <Badge variant="outline" style={styles.badge}>
                                    {recetasFree.length}
                                </Badge>
                            </View>
                            <View style={styles.recipesList}>
                                {recetasFree.map((receta) => (
                                    <TouchableOpacity key={receta.recipe_id} onPress={() => handleRecipeClick(receta)}>
                                        <Card style={styles.freeCard}>
                                            <CardContent style={styles.cardContent}>
                                            <View style={styles.recipeRow}>
                                                <Image
                                                    source={{ uri: receta.image_url || "/placeholder.svg" }}
                                                    style={styles.recipeImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.recipeInfo}>
                                                    <View style={styles.recipeHeader}>
                                                        <Text style={styles.recipeName}>{receta.name}</Text>
                                                        <TouchableOpacity
                                                            style={styles.deleteButton}
                                                            onPress={() => receta.recipe_id && eliminarReceta(receta.recipe_id)}
                                                        >
                                                            <Ionicons name="trash" size={16} color="#EF4444" />
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={styles.recipeStats}>
                                                        <View style={styles.statItem}>
                                                            <Ionicons name="time" size={12} color="#6B7280" />
                                                            <Text style={styles.statText}>{receta.cooking_time}</Text>
                                                        </View>
                                                        <View style={styles.statItem}>
                                                            <Ionicons name="restaurant" size={12} color="#6B7280" />
                                                            <Text style={styles.statText}>{receta.difficulty}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.recipeFooter}>
                                                        <View style={styles.ingredientsContainer}>
                                                            {(receta.recipe_ingredients || []).slice(0, 2).map((ingrediente, index) => (
                                                                <Badge key={index} variant="outline" style={styles.ingredientBadge}>
                                                                    {ingrediente.name}
                                                                </Badge>
                                                            ))}
                                                            {(receta.recipe_ingredients || []).length > 2 && (
                                                                <Badge variant="outline" style={styles.ingredientBadge}>
                                                                    +{(receta.recipe_ingredients || []).length - 2}
                                                                </Badge>
                                                            )}
                                                        </View>
                                                        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </CardContent>
                                        </Card>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Botón para limpiar todas */}
                    {recetasGuardadas.length > 0 && (
                        <View style={styles.clearSection}>
                            <Button
                                variant="outline"
                                style={styles.clearButton}
                                onPress={() => setRecetasGuardadas([])}
                            >
                                Limpiar todas las recetas guardadas
                            </Button>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#FFF8EC',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: '#9CA3AF',
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  emptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#E5E7EB',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  exploreButton: {
    backgroundColor: colors.btn.secondary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  premiumIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  freeIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#F97316',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  recipesList: {
    gap: spacing.sm,
  },
  premiumCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 8,
  },
  freeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 0,
  },
  recipeRow: {
    flexDirection: 'row',
  },
  recipeImage: {
    width: 80,
    height: 80,
  },
  recipeInfo: {
    flex: 1,
    padding: spacing.sm,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  recipeName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
    borderRadius: 4,
  },
  recipeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.fontSize.xs,
    color: '#6B7280',
  },
  recipeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  ingredientBadge: {
    fontSize: typography.fontSize.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: '#9CA3AF',
  },
  clearSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    width: '100%',
    borderColor: '#EF4444',
    color: '#EF4444',
  },
});
