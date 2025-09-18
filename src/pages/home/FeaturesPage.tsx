import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FeatureSection from '../../components/LandingPage/FeatureSection';
import { RecipeIcon, IngredientsIcon, ShoppingListIcon, FavoritesIcon } from '../../components/ui/FeatureIcons';
import { colors, spacing, typography } from '../../styles/globalStyles';

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>¿Por qué elegir Cooky?</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <FeatureSection
            title="Recetas Auténticas"
            description="Descubre recetas tradicionales y modernas de todo el mundo, cuidadosamente seleccionadas por nuestros chefs expertos. Desde platos caseros hasta delicias gourmet, cada receta está probada y perfeccionada para garantizar el mejor sabor."
            icon={<RecipeIcon width={50} height={50} />}
          />
          <FeatureSection
            title="Cocina con lo que tienes"
            description="Encuentra recetas basadas en los ingredientes que ya tienes en casa. No más desperdicio de comida ni compras innecesarias. Nuestro sistema inteligente te sugiere las mejores combinaciones con lo que tienes disponible."
            icon={<IngredientsIcon width={50} height={50} />}
          />
          <FeatureSection
            title="Crea listas de compras"
            description="Crea tus listas de compras personalizadas y genera listas automáticamente para las recetas que elijas. Organiza tus compras por categorías, marca ingredientes como comprados y nunca olvides nada importante."
            icon={<ShoppingListIcon width={50} height={50} />}
          />
          <FeatureSection
            title="Guarda Favoritos"
            description="Mantén organizadas tus recetas favoritas y accede a ellas cuando quieras cocinar algo especial. Crea colecciones personalizadas, comparte con familiares y amigos, y construye tu biblioteca culinaria perfecta."
            icon={<FavoritesIcon width={50} height={50} />}
          />
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.ctaButtonText}>Registrarse</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40, // Para balancear el diseño
  },
  featuresGrid: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    marginTop: spacing.lg,
  },
  ctaTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  ctaSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.btn.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  ctaButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFF',
  },
});

