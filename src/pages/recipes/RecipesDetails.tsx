import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Card, CardContent } from "../../components/recipe/Card"
import { Badge } from "../../components/recipe/Badge"
import Button from '../../components/common/Button';
import StatsRecipe from "../../components/ui/StatsRecipe";
import { useRecipesManager } from '../../hooks/recipes/useRecipesManager';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { isPremiumUser } from '../../services/auth/login';
import { findSvgByName } from "../../utils/ingredientSvg";
import { SvgXml } from 'react-native-svg';
import { colors, spacing, typography } from '../../styles/globalStyles';
import type { Recipe } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

export default function DetalleReceta() {
    const { recipes } = useRecipesManager();
    const { user } = useAuthStore();
    const isPremium = user ? isPremiumUser(user) : false;
    const [activeTab, setActiveTab] = useState<"ingredientes" | "pasos">("ingredientes")
    const [isGeneratingList, setIsGeneratingList] = useState(false);
    const [showNutrition, setShowNutrition] = useState(false);
    const searchParams = useLocalSearchParams();
    const idRecipe = searchParams.idRecipe as string;
    const router = useRouter();
    
    // Store de listas de compras
    const { saveShoppingListRecipe, success, message, error, clearError } = useShoppingListStore();
    
    // Store de favoritos
    const { 
        savedRecipes, 
        saveRecipe, 
        removeSavedRecipe, 
        isRecipeSaved: checkIsRecipeSaved,
        error: favoritesError,
        clearError: clearFavoritesError 
    } = useFavoritesStore();
    
    // Verificar si la receta está guardada
    const isSaved = savedRecipes.some(savedRecipe => savedRecipe && savedRecipe.recipe_id === idRecipe);
    
    // Obtener receta por recipe_id único
    const recipe: Recipe | undefined = recipes.recipes.find((r) => String(r.recipe_id) === String(idRecipe));
    
    console.log('Recipe Id from params:', idRecipe);
    console.log('Found recipe:', recipe);
    
    // Cargar recetas guardadas al montar el componente
    useEffect(() => {
        if (idRecipe) {
            // Verificar si la receta está guardada
            checkIsRecipeSaved(idRecipe);
        }
    }, [idRecipe, checkIsRecipeSaved]);
        
    useEffect(() => {
        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error
            });
            clearError();
        }
    }, [error, clearError]);
    
    useEffect(() => {
        if (favoritesError) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: favoritesError
            });
            clearFavoritesError();
        }
    }, [favoritesError, clearFavoritesError]);

    const toggleSave = async () => {
        if (!recipe?.recipe_id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo obtener el ID de la receta'
            });
            return;
        }

        try {
            if (isSaved) {
                await removeSavedRecipe(recipe.recipe_id);
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Receta eliminada de favoritos'
                });
            } else {
                await saveRecipe(recipe.recipe_id);
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Receta guardada en favoritos'
                });
            }
        } catch (error) {
            console.error('Error toggling save:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo actualizar el estado de favoritos'
            });
        }
    };

    const generateShoppingList = async () => {
        if (!recipe?.recipe_id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo obtener el ID de la receta'
            });
            return;
        }
        
        console.log('🛒 Generando lista de compras para receta:', recipe.recipe_id);
        
        setIsGeneratingList(true);
        
        try {
            await saveShoppingListRecipe(recipe.recipe_id);
        } catch (err) {
            console.error('Error generando lista de compras:', err);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al generar la lista de compras'
            });
        } finally {
            setIsGeneratingList(false);
        }
    };

    if (!recipe) {
        return (
            <View style={styles.container}>
                <View style={styles.errorState}>
                    <Ionicons name="restaurant-outline" size={64} color="#9CA3AF" />
                    <Text style={styles.errorTitle}>Receta no encontrada</Text>
                    <Text style={styles.errorSubtitle}>
                        La receta que buscas no está disponible
                    </Text>
                    <TouchableOpacity 
                        style={styles.backToRecipesButton}
                        onPress={() => router.back()}
                    >
                         <Ionicons name="arrow-back" size={20} color="#FF8A65" />
                        <Text style={styles.backToRecipesText}>Volver a recetas</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con imagen y gradiente */}
            <View style={styles.headerContainer}>
                <Image 
                    source={{ uri: recipe.image_url || `https://placehold.co/600x400?text=${recipe.name}` }} 
                    style={styles.recipeImage}
                    resizeMode="cover"
                />
                
                {/* Gradiente overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.imageOverlay}
                />
                
                {/* Header controls */}
                <View style={styles.headerControls}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.headerButton, isSaved && styles.savedButton]}
                        onPress={toggleSave}
                    >
                        <Ionicons 
                            name={isSaved ? "heart" : "heart-outline"} 
                            size={24} 
                            color="#FFFFFF" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Title and basic info */}
                <View style={styles.headerContent}>
                    <View style={styles.recipeTitleContainer}>
                        <Text style={styles.recipeTitle}>{recipe.name}</Text>
                        {isPremium && (
                            <View style={styles.premiumBadgeHeader}>
                                <Ionicons name="star" size={12} color="#FFFFFF" />
                            </View>
                        )}
                    </View>
                    
                    {recipe.description && (
                        <Text style={styles.recipeDescription} numberOfLines={2}>
                            {recipe.description}
                        </Text>
                    )}
                </View>
            </View>

            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats mejoradas */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="time-outline" size={20} color="#F59E0B" />
                            </View>
                            <Text style={styles.statValue}>{recipe.cooking_time || 30} min</Text>
                            <Text style={styles.statLabel}>Tiempo</Text>
                        </View>
                        
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="bar-chart-outline" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.statValue}>
                                {recipe.difficulty === 'easy' ? 'Fácil' : 
                                 recipe.difficulty === 'medium' ? 'Medio' : 
                                 recipe.difficulty === 'hard' ? 'Difícil' : 'Medio'}
                            </Text>
                            <Text style={styles.statLabel}>Dificultad</Text>
                        </View>
                        
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="people-outline" size={20} color="#10B981" />
                            </View>
                            <Text style={styles.statValue}>{recipe.servings || 4}</Text>
                            <Text style={styles.statLabel}>Porciones</Text>
                        </View>
                        
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#F3E8FF' }]}>
                                <Ionicons name="leaf-outline" size={20} color="#8B5CF6" />
                            </View>
                            <Text style={styles.statValue}>
                                {(recipe.ingredients || recipe.recipe_ingredients || []).length}
                            </Text>
                            <Text style={styles.statLabel}>Ingredientes</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs mejorados */}
                <View style={styles.tabsContainer}>
                    <View style={styles.tabsBackground}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === "ingredientes" && styles.activeTab
                            ]}
                            onPress={() => setActiveTab("ingredientes")}
                        >
                            <Ionicons 
                                name="leaf-outline" 
                                size={18} 
                                color={activeTab === "ingredientes" ? "#FFFFFF" : "#64748B"} 
                            />
                            <Text style={[
                                styles.tabText,
                                activeTab === "ingredientes" && styles.activeTabText
                            ]}>
                                Ingredientes
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === "pasos" && styles.activeTab
                            ]}
                            onPress={() => setActiveTab("pasos")}
                        >
                            <Ionicons 
                                name="list-outline" 
                                size={18} 
                                color={activeTab === "pasos" ? "#FFFFFF" : "#64748B"} 
                            />
                            <Text style={[
                                styles.tabText,
                                activeTab === "pasos" && styles.activeTabText
                            ]}>
                                Pasos
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentSection}>
                    {activeTab === "ingredientes" ? (
                        <>
                            {/* Header de ingredientes */}
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                     <View style={styles.sectionIcon}>
                                         <Ionicons name="leaf" size={16} color="#FF8A65" />
                                     </View>
                                    <Text style={styles.sectionTitle}>Ingredientes necesarios</Text>
                                </View>
                                <Badge variant="secondary" style={styles.countBadge}>
                                    {(recipe.ingredients || recipe.recipe_ingredients || []).length} items
                                </Badge>
                            </View>

                            {/* Lista de ingredientes mejorada */}
                            <View style={styles.ingredientsGrid}>
                                {(recipe.ingredients || recipe.recipe_ingredients || []).map((ingredient, index) => (
                                    <View key={ingredient.name || index} style={styles.ingredientCard}>
                                        <View style={styles.ingredientContent}>
                                            <View style={styles.ingredientIconContainer}>
                                                <View style={styles.ingredientIcon}>
                                                    <SvgXml 
                                                        xml={findSvgByName(ingredient.name)} 
                                                        width={24} 
                                                        height={24} 
                                                    />
                                                </View>
                                            </View>
                                            
                                            <View style={styles.ingredientInfo}>
                                                <Text style={styles.ingredientName} numberOfLines={2}>
                                                    {ingredient.name}
                                                </Text>
                                                <Text style={styles.ingredientQuantity}>
                                                    {ingredient.quantity} {ingredient.unit}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* Botón de lista de compras mejorado */}
                            <View style={styles.actionButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.shoppingListButton, isGeneratingList && styles.shoppingListButtonDisabled]}
                                    onPress={generateShoppingList}
                                    disabled={isGeneratingList}
                                    activeOpacity={0.8}
                                >
                                     <LinearGradient
                                         colors={isGeneratingList ? ['#9CA3AF', '#6B7280'] : ['#FF8A65', '#FF7043']}
                                         style={styles.shoppingListGradient}
                                         start={{ x: 0, y: 0 }}
                                         end={{ x: 1, y: 1 }}
                                     >
                                        <Ionicons 
                                            name={isGeneratingList ? "hourglass-outline" : "bag-add"} 
                                            size={20} 
                                            color="#FFFFFF" 
                                        />
                                        <Text style={styles.shoppingListButtonText}>
                                            {isGeneratingList ? 'Generando lista...' : 'Generar lista de compra'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            {/* Premium features */}
                            {isPremium && recipe.sustitucion && (
                                <View style={styles.premiumSection}>
                                    <View style={styles.premiumHeader}>
                                         <View style={styles.premiumIconContainer}>
                                             <Ionicons name="sparkles" size={16} color="#FF8A65" />
                                         </View>
                                         <Text style={styles.premiumTitle}>Sustituciones Inteligentes</Text>
                                    </View>
                                    <Text style={styles.premiumContent}>
                                        {recipe.sustitucion}
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Header de pasos */}
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                     <View style={[styles.sectionIcon, { backgroundColor: '#FFF3E0' }]}>
                                         <Ionicons name="list" size={16} color="#FF8A65" />
                                     </View>
                                    <Text style={styles.sectionTitle}>Pasos de preparación</Text>
                                </View>
                                <Badge variant="secondary" style={styles.countBadge}>
                                    {recipe.steps?.length || 0} pasos
                                </Badge>
                            </View>

                            {/* Lista de pasos mejorada */}
                            <View style={styles.stepsContainer}>
                                {recipe.steps?.map((step, index) => (
                                    <View key={step.order || index} style={styles.stepCard}>
                                        <View style={styles.stepContent}>
                                            <View style={styles.stepNumberContainer}>
                                                 <LinearGradient
                                                     colors={['#FF8A65', '#FF7043']}
                                                     style={styles.stepNumber}
                                                 >
                                                    <Text style={styles.stepNumberText}>
                                                        {step.order || index + 1}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                            
                                            <View style={styles.stepTextContainer}>
                                                <Text style={styles.stepText}>
                                                    {step.step}
                                                </Text>
                                                {step.time && (
                                                     <View style={styles.stepTimeContainer}>
                                                         <Ionicons name="time-outline" size={14} color="#FF8A65" />
                                                         <Text style={styles.stepTime}>
                                                             {step.time} minutos
                                                         </Text>
                                                     </View>
                                                )}
                                            </View>
                                        </View>
                                        
                                        {/* Línea conectora */}
                                        {index < (recipe.steps?.length || 0) - 1 && (
                                            <View style={styles.stepConnector} />
                                        )}
                                    </View>
                                )) || (
                                    <View style={styles.noStepsContainer}>
                                        <Ionicons name="document-outline" size={48} color="#9CA3AF" />
                                        <Text style={styles.noStepsText}>
                                            No hay pasos disponibles para esta receta
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </View>

                {/* Espaciado final */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  
  // Header
  headerContainer: {
    height: 280,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerControls: {
    position: 'absolute',
    top: spacing.xl * 2,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
   headerButton: {
     width: 44,
     height: 44,
     borderRadius: 22,
     backgroundColor: 'rgba(0, 0, 0, 0.3)',
     alignItems: 'center',
     justifyContent: 'center',
   },
  savedButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  headerContent: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
  recipeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 34,
  },
   premiumBadgeHeader: {
     width: 28,
     height: 28,
     backgroundColor: '#FF8A65',
     borderRadius: 14,
     alignItems: 'center',
     justifyContent: 'center',
     marginLeft: spacing.sm,
   },
  recipeDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },

  // Scroll content
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Stats
  statsContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  // Tabs
  tabsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  tabsBackground: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
   activeTab: {
     backgroundColor: '#FF8A65',
     shadowColor: '#FF8A65',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.2,
     shadowRadius: 4,
     elevation: 2,
   },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },

  // Content
  contentSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
   sectionIcon: {
     width: 32,
     height: 32,
     backgroundColor: '#FFF3E0',
     borderRadius: 16,
     alignItems: 'center',
     justifyContent: 'center',
   },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },

  // Ingredientes
  ingredientsGrid: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  ingredientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ingredientContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientIconContainer: {
    marginRight: spacing.md,
  },
  ingredientIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  ingredientEmoji: {
    fontSize: 20,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },

  // Shopping list button
  actionButtonContainer: {
    marginBottom: spacing.xl,
  },
  shoppingListButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  shoppingListButtonDisabled: {
    opacity: 0.7,
  },
  shoppingListGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  shoppingListButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Premium section
   premiumSection: {
     backgroundColor: '#FFFFFF',
     borderRadius: 16,
     padding: spacing.lg,
     borderLeftWidth: 4,
     borderLeftColor: '#FF8A65',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.04,
     shadowRadius: 8,
     elevation: 2,
   },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
   premiumIconContainer: {
     width: 24,
     height: 24,
     backgroundColor: '#FFF3E0',
     borderRadius: 12,
     alignItems: 'center',
     justifyContent: 'center',
   },
   premiumTitle: {
     fontSize: 14,
     fontWeight: '700',
     color: '#FF8A65',
   },
   premiumContent: {
     fontSize: 14,
     color: '#FF7043',
     lineHeight: 20,
   },

  // Steps
  stepsContainer: {
    gap: spacing.md,
  },
  stepCard: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepNumberContainer: {
    marginTop: 2,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepText: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  stepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
   stepTime: {
     fontSize: 13,
     color: '#FF8A65',
     fontWeight: '600',
   },
  stepConnector: {
    position: 'absolute',
    left: spacing.lg + 18,
    bottom: -spacing.md / 2,
    width: 2,
    height: spacing.md,
    backgroundColor: '#E2E8F0',
  },
  noStepsContainer: {
    alignItems: 'center',
    padding: spacing.xl * 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  noStepsText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: spacing.md,
  },

  // Error state
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
   backToRecipesButton: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.xs,
     paddingHorizontal: spacing.lg,
     paddingVertical: spacing.md,
     backgroundColor: '#FFF3E0',
     borderRadius: 12,
   },
   backToRecipesText: {
     fontSize: 14,
     fontWeight: '600',
     color: '#FF8A65',
   },

  // Spacing
  bottomSpacing: {
    height: spacing.xl * 2,
  },
});