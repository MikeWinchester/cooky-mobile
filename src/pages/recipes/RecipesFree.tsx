import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Button } from "../../components/recipe/Button"
import { Card, CardContent } from "../../components/recipe/Card"
import { Badge } from "../../components/recipe/Badge"
import { useRecipesManager } from '../../hooks/recipes/useRecipesManager';
import { useAuthStore } from '../../store/useAuthStore';
import { isPremiumUser } from '../../services/auth/login';
import type { Recipe } from '../../types';
import { capitalize } from "../../utils/utils"
import { colors, spacing, typography } from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

interface RecetasFreeProps {
  searchQuery?: string
}

export default function RecetasFree({ searchQuery }: RecetasFreeProps) {
  const { ingredients, recipes } = useRecipesManager();
  const { user } = useAuthStore();
  const isPremium = user ? isPremiumUser(user) : false;
  const [showFilters, setShowFilters] = useState(true)
  const router = useRouter();
  
  const recetas = recipes.recipes || [];
  const filteredRecipes = recetas;

  const handleRecipeClick = (recipe: Recipe) => {
    if (!recipe.recipe_id) {
      console.error('Recipe ID is undefined');
      return;
    }
    router.push(`/recipes/details/${recipe.recipe_id}`);
  }

  return (
    <View style={styles.container}>
        {/* Header con gradiente */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={isPremium ? ['#7C3AED', '#6D28D9', '#5B21B6'] : ['#FF8A65', '#FF7043', '#FF5722']}
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
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={20} color="#1E293B" />
              </TouchableOpacity>
              
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>
                  {isPremium ? 'Recetas Premium' : 'Recetas Encontradas'}
                </Text>
                <View style={styles.headerSubtitleContainer}>
                  <Ionicons 
                    name={isPremium ? "star" : "restaurant-outline"} 
                    size={16} 
                    color="rgba(255, 255, 255, 0.8)" 
                  />
                  <Text style={styles.headerSubtitle}>
                    {isPremium 
                      ? 'Personalizadas con IA para tus ingredientes'
                      : 'Ordenadas por coincidencia básica'
                    }
                  </Text>
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
        {/* Filtros Premium o Banner Promocional */}
        {isPremium ? (
          <View style={styles.premiumFiltersContainer}>
            <View style={styles.filtersHeader}>
              <View style={styles.filtersTitleContainer}>
                <View style={styles.premiumIcon}>
                  <Ionicons name="sparkles" size={16} color="#7C3AED" />
                </View>
                <Text style={styles.filtersTitle}>Filtros IA</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowFilters(!showFilters)}
                style={styles.filterToggle}
              >
                <Ionicons 
                  name={showFilters ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
            
            {showFilters && (
              <View style={styles.filtersContent}>
                <View style={styles.filtersRow}>
                  <Badge variant="secondary" style={styles.filterBadge}>
                    Máx. 5 ingredientes
                  </Badge>
                  <Badge variant="secondary" style={styles.filterBadge}>
                    Menos de 30 min
                  </Badge>
                  <Badge variant="secondary" style={styles.filterBadge}>
                    Sin gluten
                  </Badge>
                  <Badge variant="secondary" style={styles.filterBadge}>
                    Vegetariano
                  </Badge>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <View style={styles.promoIcon}>
                <Ionicons name="rocket" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>¡Mejora tu experiencia!</Text>
                <Text style={styles.promoSubtitle}>
                  Usa IA para ver recetas exactas con lo que tienes
                </Text>
              </View>
            </View>
            <Button 
              size="sm" 
              style={styles.promoButton}
              onPress={() => router.push('/plans')}
            >
              Probar Premium
            </Button>
          </View>
        )}

        {/* Indicador de contexto */}
        <View style={styles.contextIndicator}>
          <View style={[
            styles.contextIcon, 
            { backgroundColor: isPremium ? '#F3E8FF' : '#FFF3E0' }
          ]}>
            <Ionicons 
              name="restaurant" 
              size={18} 
              color={isPremium ? '#7C3AED' : '#FF8A65'} 
            />
          </View>
          <Text style={styles.contextText}>
            {isPremium 
              ? 'Recetas optimizadas con inteligencia artificial'
              : 'Recetas basadas en coincidencias de ingredientes'
            }
          </Text>
        </View>

        {/* Lista de recetas */}
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isPremium ? 'Recomendaciones IA' : 'Todas las Recetas'}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {recipes.isLoading ? 'Buscando...' : `${filteredRecipes.length} recetas`}
              </Text>
            </View>
          </View>

          {recipes.isLoading ? (
            <View style={styles.loadingState}>
              <View style={styles.loadingIcon}>
                <Ionicons name="restaurant-outline" size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.loadingTitle}>Buscando recetas...</Text>
              <Text style={styles.loadingSubtitle}>
                Analizando tus ingredientes
              </Text>
            </View>
          ) : filteredRecipes.length > 0 ? (
            <View style={styles.recipesGrid}>
              {filteredRecipes.map((receta, index) => (
                <TouchableOpacity 
                  key={receta.recipe_id} 
                  onPress={() => handleRecipeClick(receta)}
                  activeOpacity={0.95}
                  style={[
                    styles.recipeCardWrapper,
                    // Animación escalonada
                    { 
                      transform: [{ 
                        translateY: Math.sin(index * 0.2) * 3 
                      }] 
                    }
                  ]}
                >
                  <Card style={styles.recipeCard}>
                    <View style={styles.recipeImageContainer}>
                      <Image
                        source={{ 
                          uri: receta.image_url || `https://placehold.co/600x256?text=${receta.name}` 
                        }}
                        style={styles.recipeImage}
                        resizeMode="cover"
                      />
                      
                      {/* Badge Premium */}
                      {isPremium && (
                        <View style={styles.premiumBadge}>
                          <Ionicons name="star" size={12} color="#FFFFFF" />
                        </View>
                      )}
                      
                      {/* Gradient overlay */}
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.imageOverlay}
                      />
                      
                      <View style={styles.imageContent}>
                        <Text style={styles.recipeName} numberOfLines={2}>
                          {receta.name}
                        </Text>
                      </View>
                    </View>

                    <CardContent style={styles.cardContent}>
                      {/* Stats */}
                      <View style={styles.recipeStats}>
                        <View style={styles.statItem}>
                          <Ionicons name="time-outline" size={14} color="#6B7280" />
                          <Text style={styles.statText}>{receta.cooking_time || 30} min</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="bar-chart-outline" size={14} color="#6B7280" />
                          <Text style={styles.statText}>
                            {receta.difficulty ? capitalize(receta.difficulty.toString()) : 'Medio'}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="people-outline" size={14} color="#6B7280" />
                          <Text style={styles.statText}>{receta.servings || 4}</Text>
                        </View>
                      </View>

                      {/* Ingredientes */}
                      <View style={styles.ingredientsContainer}>
                        <Text style={styles.ingredientsLabel}>Ingredientes:</Text>
                        <View style={styles.ingredientsList}>
                          {(receta.recipe_ingredients || []).slice(0, 3).map((ingrediente, idx) => (
                            <Badge key={ingrediente.name || idx} variant="outline" style={styles.ingredientBadge}>
                              {ingrediente.name}
                            </Badge>
                          ))}
                          {(receta.recipe_ingredients || []).length > 3 && (
                            <Badge variant="outline" style={styles.ingredientBadge}>
                              +{(receta.recipe_ingredients || []).length - 3}
                            </Badge>
                          )}
                        </View>
                      </View>

                      {/* Descripción */}
                      <Text style={styles.recipeDescription} numberOfLines={2}>
                        {receta.description}
                      </Text>

                      {/* Features Premium */}
                      {isPremium && receta.sustitucion && (
                        <View style={styles.premiumFeature}>
                          <View style={styles.premiumFeatureHeader}>
                            <Ionicons name="sparkles" size={12} color="#7C3AED" />
                            <Text style={styles.premiumFeatureTitle}>Sustitución IA</Text>
                          </View>
                          <Text style={styles.premiumFeatureText} numberOfLines={2}>
                            {receta.sustitucion}
                          </Text>
                        </View>
                      )}

                      {/* Upgrade Hint para usuarios free */}
                      {!isPremium && (
                        <View style={styles.upgradeHint}>
                          <Ionicons name="lock-closed" size={12} color="#EC4899" />
                          <Text style={styles.upgradeHintText}>
                            Con Premium: sustituciones inteligentes y personalización
                          </Text>
                        </View>
                      )}
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Sin recetas disponibles</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery && searchQuery.trim() !== ''
                  ? `No hay recetas que coincidan con "${searchQuery}"`
                  : ingredients.isEmpty()
                    ? "Selecciona algunos ingredientes para ver recetas"
                    : "Intenta con otros ingredientes"
                }
              </Text>
            </View>
          )}
        </View>

        {/* Load More */}
        {filteredRecipes.length > 6 && (
          <View style={styles.loadMoreContainer}>
            <Button variant="outline" style={styles.loadMoreButton}>
              Ver más recetas ({filteredRecipes.length - 6} restantes)
            </Button>
          </View>
        )}

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

  // Filtros Premium
  premiumFiltersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  filtersTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  premiumIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  filterToggle: {
    padding: 4,
  },
  filtersContent: {
    gap: spacing.sm,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  filterBadge: {
    // Managed by Badge component
  },

  // Banner promocional
  promoBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8A65',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  promoIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FF8A65',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  promoButton: {
    backgroundColor: '#FF8A65',
  },

  // Indicador de contexto
  contextIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
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

  // Sección de recetas
  recipesSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },

  // Grid de recetas
  recipesGrid: {
    gap: spacing.md,
  },
  recipeCardWrapper: {
    marginBottom: spacing.sm,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  
  // Imagen de receta
  recipeImageContainer: {
    height: 160,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 4,
    zIndex: 2,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  imageContent: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },

  // Contenido de la tarjeta
  cardContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  recipeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Ingredientes
  ingredientsContainer: {
    gap: spacing.xs,
  },
  ingredientsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientBadge: {
    // fontSize is handled by Badge component internally
  },
  
  // Descripción
  recipeDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  // Features premium
  premiumFeature: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
  },
  premiumFeatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  premiumFeatureTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  premiumFeatureText: {
    fontSize: 11,
    color: '#5B21B6',
    lineHeight: 16,
  },

  // Upgrade hint
  upgradeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F8',
    borderRadius: 8,
    padding: spacing.sm,
    gap: 6,
  },
  upgradeHintText: {
    fontSize: 11,
    color: '#EC4899',
    flex: 1,
    fontWeight: '500',
  },

  // Estados
  loadingState: {
    alignItems: 'center',
    padding: spacing.xl * 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: spacing.lg,
  },
  loadingIcon: {
    marginBottom: spacing.lg,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: spacing.xs,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },

  emptyState: {
    alignItems: 'center',
    padding: spacing.xl * 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Load more
  loadMoreContainer: {
    marginBottom: spacing.xl,
  },
  loadMoreButton: {
    width: '100%',
  },

  // Espaciado
  bottomSpacing: {
    height: spacing.xl,
  },
});