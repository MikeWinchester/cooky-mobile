import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FeatureSection from '../LandingPage/FeatureSection';
import { RecipeIcon, IngredientsIcon, ShoppingListIcon, FavoritesIcon } from './FeatureIcons';
import { colors, spacing, typography } from '../../styles/globalStyles';

export default function ExpandableFeatures() {
  const [isExpanded, setIsExpanded] = useState(false);

  const features = [
    {
      title: "Recetas Auténticas",
      description: "Descubre recetas tradicionales y modernas de todo el mundo, cuidadosamente seleccionadas.",
      icon: <RecipeIcon width={40} height={40} />
    },
    {
      title: "Cocina con lo que tienes",
      description: "Encuentra recetas basadas en los ingredientes que ya tienes en casa.",
      icon: <IngredientsIcon width={40} height={40} />
    },
    {
      title: "Crea listas de compras",
      description: "Crea tus listas de compras y genera listas de compras automáticamente para las recetas que elijas.",
      icon: <ShoppingListIcon width={40} height={40} />
    },
    {
      title: "Guarda Favoritos",
      description: "Mantén organizadas tus recetas favoritas y accede a ellas cuando quieras cocinar.",
      icon: <FavoritesIcon width={40} height={40} />
    }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>¿Por qué elegir Cooky?</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={colors.btn.primary} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <FeatureSection
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.bg.primary,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  featuresContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
