import React, { useEffect, useState, useMemo } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native"
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Input } from "../../components/recipe/Input"
import { Switch } from "../../components/recipe/Switch"
import { Label } from "../../components/recipe/Label"
import { ScrollArea } from "../../components/recipe/Scroll-area"
import RecetasFree from "./RecipesFree"

import { useIngredients } from "../../hooks/recipes/useIngredients"
import { useRecipes } from "../../hooks/recipes/useRecipes"
import { useAuthStore } from '../../store/useAuthStore';
import { isPremiumUser } from '../../services/auth/login';
import { colors, spacing, typography } from '../../styles/globalStyles';

export default function RecetasApp() {
  const { ingredients } = useIngredients();
  const { lastSearchedIngredients } = useRecipes();
  const { user } = useAuthStore();
  const searchParams = useLocalSearchParams();
  const isPremium = user ? isPremiumUser(user) : false; // Verificar si el usuario es premium
  
  // Priorizar ingredientes de la búsqueda reciente, luego searchParams, luego ingredientes actuales
  const displayIngredients = useMemo(() => {
    if (lastSearchedIngredients.length > 0) {
      return lastSearchedIngredients;
    }
    return (searchParams.ingredients as string)?.split(',') || ingredients;
  }, [lastSearchedIngredients, searchParams.ingredients, ingredients.length]);
  
  const [searchQuery, setSearchQuery] = useState(() => displayIngredients.join(', '))
  
  // Actualizar cuando cambien los ingredientes mostrados
  useEffect(() => {
    const newQuery = displayIngredients.join(', ');
    setSearchQuery(newQuery);
  }, [displayIngredients]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Mis Recetas</Text>
          <View style={styles.premiumContainer}>
            <Label style={styles.premiumLabel}>
              Premium
            </Label>
            <Switch value={isPremium} disabled />
          </View>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Ingredientes que tienes..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollArea style={styles.scrollArea}>
        <RecetasFree searchQuery={searchQuery} />
      </ScrollArea>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  premiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  premiumLabel: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
  },
  searchContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.sm,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    color: colors.text.primary,
    paddingLeft: spacing.xl,
    paddingRight: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 8,
    fontSize: typography.fontSize.base,
  },
  scrollArea: {
    flex: 1,
  },
})