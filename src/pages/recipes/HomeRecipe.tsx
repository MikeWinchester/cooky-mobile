import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/common/Button';
import Graphics from '../../components/common/Graphics';
import Categories from '../Categories/Categories';
import { useAuthStore } from '../../store/useAuthStore'
import { isPremiumUser } from '../../services/auth/login';
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function HomeRecipe() {
  const { user } = useAuthStore();
  const isPremium = user ? isPremiumUser(user) : false;
  const router = useRouter();
  const [showCategories, setShowCategories] = useState(false);

  // Renderizar ilustración del plato con tenedores
  const renderFoodIllustration = () => (
    <View style={styles.illustrationContainer}>
      {/* Plato base */}
      <View style={styles.plate}>
        <View style={styles.plateInner}>
          {/* Decoración del plato */}
          <View style={styles.plateDecoration} />
        </View>
      </View>
      
      {/* Tenedor izquierdo */}
      <View style={[styles.utensil, styles.leftFork]}>
        <View style={styles.forkHandle} />
        <View style={styles.forkHead}>
          <View style={styles.forkTine} />
          <View style={styles.forkTine} />
          <View style={styles.forkTine} />
        </View>
      </View>
      
      {/* Tenedor derecho */}
      <View style={[styles.utensil, styles.rightFork]}>
        <View style={styles.forkHandle} />
        <View style={styles.forkHead}>
          <View style={styles.forkTine} />
          <View style={styles.forkTine} />
          <View style={styles.forkTine} />
        </View>
      </View>
      
      {/* Elementos decorativos flotantes */}
      <View style={styles.floatingElements}>
        <Text style={[styles.foodEmoji, styles.emoji1]}>🥕</Text>
        <Text style={[styles.foodEmoji, styles.emoji2]}>🍅</Text>
        <Text style={[styles.foodEmoji, styles.emoji3]}>🧄</Text>
        <Text style={[styles.foodEmoji, styles.emoji4]}>🫑</Text>
        <Text style={[styles.foodEmoji, styles.emoji5]}>🥔</Text>
      </View>
      
      {/* Efectos brillantes */}
      <View style={[styles.sparkle, styles.sparkle1]}>
        <Ionicons name="sparkles" size={16} color="#FCD34D" />
      </View>
      <View style={[styles.sparkle, styles.sparkle2]}>
        <Ionicons name="sparkles" size={12} color="#F97316" />
      </View>
      <View style={[styles.sparkle, styles.sparkle3]}>
        <Ionicons name="sparkles" size={14} color="#EC4899" />
      </View>
    </View>
  );

  // Renderizar características premium
  const renderFeatures = () => (
    <View style={styles.featuresContainer}>
      <View style={styles.featureCard}>
        <View style={styles.featureIcon}>
          <Ionicons name="restaurant" size={20} color={colors.btn.primary} />
        </View>
        <Text style={styles.featureText}>
          Hasta {isPremium ? 5 : 4} ingredientes
        </Text>
      </View>
      
      <View style={styles.featureCard}>
        <View style={styles.featureIcon}>
          <Ionicons name="time" size={20} color={colors.btn.secondary} />
        </View>
        <Text style={styles.featureText}>Recetas rápidas</Text>
      </View>
      
      <View style={styles.featureCard}>
        <View style={styles.featureIcon}>
          <Ionicons name="star" size={20} color="#F59E0B" />
        </View>
        <Text style={styles.featureText}>Fácil preparación</Text>
      </View>
    </View>
  );

  if (showCategories) {
    return (
      <Categories 
        title="Seleccionar Ingredientes"
        subtitle="Elige ingredientes"
        backUrl="/(app)/recipe"
        onBack={() => setShowCategories(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con gráficos de fondo */}
      <Graphics variant='left' />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          {/* Badge Premium */}
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={16} color="#FCD34D" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          
          <View style={styles.content}>
            {/* Título principal */}
            <Text style={styles.title}>
              ¿Qué cocinamos hoy?
            </Text>
            
            {/* Subtítulo descriptivo */}
            <Text style={styles.subtitle}>
              Transforma tus ingredientes en deliciosas recetas
            </Text>
            
            {/* Descripción detallada */}
            <Text style={styles.description}>
              Selecciona los ingredientes que tienes disponibles y descubre recetas personalizadas, 
              fáciles de preparar y perfectas para cualquier ocasión.
            </Text>
            
            {/* Ilustración del plato */}
            {renderFoodIllustration()}
            
            {/* Características */}
            {renderFeatures()}
            
            {/* Botones de acción */}
            <View style={styles.buttonsContainer}>
              <Button
                label="🔍 Explorar Ingredientes"
                variant="primary"
                size="large"
                onPress={() => setShowCategories(true)}
                style={styles.primaryButton}
              />
              
            </View>
            
            {/* Información adicional */}
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={16} color="#64748B" />
                <Text style={styles.infoText}>
                  {isPremium 
                    ? "Acceso completo a todas las funciones premium"
                    : "¿Quieres más ingredientes? Actualiza a Premium"
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Botón flotante para acceso rápido */}
      <TouchableOpacity 
        style={styles.floatingActionButton}
        onPress={() => setShowCategories(true)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: '#1F2937',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  premiumText: {
    color: '#FCD34D',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.btn.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  illustrationContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  plate: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  plateInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateDecoration: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    opacity: 0.6,
  },
  utensil: {
    position: 'absolute',
  },
  leftFork: {
    left: 20,
    top: 50,
    transform: [{ rotate: '-15deg' }],
  },
  rightFork: {
    right: 20,
    top: 50,
    transform: [{ rotate: '15deg' }],
  },
  forkHandle: {
    width: 4,
    height: 60,
    backgroundColor: '#6B7280',
    borderRadius: 2,
    marginBottom: 2,
  },
  forkHead: {
    flexDirection: 'row',
    gap: 2,
  },
  forkTine: {
    width: 2,
    height: 15,
    backgroundColor: '#6B7280',
    borderRadius: 1,
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  foodEmoji: {
    position: 'absolute',
    fontSize: 20,
  },
  emoji1: { top: 10, left: 30 },
  emoji2: { top: 20, right: 40 },
  emoji3: { bottom: 30, left: 20 },
  emoji4: { bottom: 20, right: 30 },
  emoji5: { top: 40, left: 10 },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: { top: 30, right: 20 },
  sparkle2: { bottom: 40, left: 40 },
  sparkle3: { top: 60, left: 30 },
  featuresContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: spacing.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.btn.primary,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.btn.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    flex: 1,
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.btn.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default HomeRecipe;