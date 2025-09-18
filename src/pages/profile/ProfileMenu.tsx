import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileAvatar from "../../components/ui/ProfileAvatar";

// Importar las páginas existentes
import ProfileForm from './ProfileForm';
import FavoriteIngredients from './FavoriteIngredients';
import DislikeIngredients from './DislikeIngredients';
import SavedRecipes from './SavedRecipes';
import Allergies from './Allergies';
import DietaryRestrictions from './DietaryRestrictions';

import { useAuthStore } from '../../store/useAuthStore';
import { colors, spacing, typography } from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export default function ProfileMenu() {
  const [currentView, setCurrentView] = useState('main');
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const navigationItems = [
    {
      sectionName: 'Perfil',
      items: [
        {
          label: 'Datos Personales',
          view: 'personal-data',
          icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FF6B35',
          bgColor: '#FFF5F2'
        }
      ]
    },
    {
      sectionName: 'Comidas',
      items: [
        {
          label: 'Ingredientes favoritos',
          view: 'favorite-ingredients',
          icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
          iconColor: '#E91E63',
          bgColor: '#FCE4EC'
        },
        {
          label: 'Ingredientes que no me gustan',
          view: 'dislike-ingredients',
          icon: 'thumbs-down-outline' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FF9800',
          bgColor: '#FFF3E0'
        },
        {
          label: 'Comidas preferidas',
          view: 'saved-recipes',
          icon: 'bookmark-outline' as keyof typeof Ionicons.glyphMap,
          iconColor: '#4CAF50',
          bgColor: '#E8F5E8'
        }
      ]
    },
    {
      sectionName: 'Salud',
      items: [
        {
          label: 'Alergias',
          view: 'allergies',
          icon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
          iconColor: '#F44336',
          bgColor: '#FFEBEE'
        },
        {
          label: 'Restricciones dietéticas',
          view: 'dietary-restrictions',
          icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
          iconColor: '#2196F3',
          bgColor: '#E3F2FD'
        }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/')
  };

  const handleItemPress = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'personal-data':
        return <ProfileForm onBack={() => setCurrentView('main')} />;
      case 'favorite-ingredients':
        return <FavoriteIngredients onBack={() => setCurrentView('main')} />;
      case 'dislike-ingredients':
        return <DislikeIngredients onBack={() => setCurrentView('main')} />;
      case 'saved-recipes':
        return <SavedRecipes onBack={() => setCurrentView('main')} />;
      case 'allergies':
        return <Allergies onBack={() => setCurrentView('main')} />;
      case 'dietary-restrictions':
        return <DietaryRestrictions onBack={() => setCurrentView('main')} />;
      default:
        return null;
    }
  };

  if (currentView !== 'main') {
    return renderCurrentView();
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header mejorado con gradiente y formas */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#FF8A65', '#FF7043', '#FF5722']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Círculos decorativos flotantes */}
          <View style={[styles.floatingShape, styles.shape1]} />
          <View style={[styles.floatingShape, styles.shape2]} />
          <View style={[styles.floatingShape, styles.shape3]} />
          
          {/* Ondas en la parte inferior */}
          <View style={styles.waveContainer}>
            <View style={styles.wave1} />
            <View style={styles.wave2} />
          </View>
        </LinearGradient>
      </View>

      {/* Avatar y información del usuario */}
      <View style={styles.userSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <ProfileAvatar
              src="https://randomuser.me/api/portraits/men/75.jpg"
              name=""
              email=""
              size="lg"
              showInfo={false}
            />
          </View>
          
          {/* Badge de estado */}
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
          </View>
        </View>
        
        <Text style={styles.userName}>
          {user?.name || "Miguel Sánchez"}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || "miguel@cooky.com"}
        </Text>
      </View>
      
      {/* Secciones de navegación mejoradas */}
      <View style={styles.sectionsContainer}>
        {navigationItems.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.sectionName}</Text>
              <View style={styles.sectionLine} />
            </View>
            
            <View style={styles.sectionGrid}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.menuCard}
                  onPress={() => handleItemPress(item.view)}
                  activeOpacity={0.8}
                >
                  <View style={styles.menuCardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                      <Ionicons 
                        name={item.icon} 
                        size={22} 
                        color={item.iconColor} 
                      />
                    </View>
                    
                    <Text style={styles.menuCardText}>{item.label}</Text>
                    
                    <View style={styles.arrowContainer}>
                      <Ionicons 
                        name="chevron-forward" 
                        size={16} 
                        color="#CBD5E1" 
                      />
                    </View>
                  </View>
                  
                  {/* Sombra interna */}
                  <View style={styles.cardHighlight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Botón de cerrar sesión mejorado */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <View style={styles.logoutIconContainer}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        </View>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
        <View style={styles.logoutArrow}>
          <Ionicons name="chevron-forward" size={16} color="#DC2626" />
        </View>
      </TouchableOpacity>
      
      {/* Espaciado final */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  contentContainer: {
    flexGrow: 1,
  },
  
  // Header mejorado
  headerContainer: {
    height: 180,
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
    top: -20,
    right: -30,
  },
  shape2: {
    width: 80,
    height: 80,
    top: 40,
    right: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  shape3: {
    width: 60,
    height: 60,
    top: 80,
    left: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  wave1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: '#FAFBFC',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  wave2: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 15,
    backgroundColor: 'rgba(250, 251, 252, 0.7)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  // Usuario mejorado
  userSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: -60,
    marginBottom: spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FAFBFC',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  // Secciones mejoradas
  sectionsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  sectionGrid: {
    gap: spacing.sm,
  },

  // Cards de menú
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuCardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  // Actividad reciente - ELIMINADOS TODOS LOS ESTILOS
  
  // Logout mejorado
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
  },
  logoutArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});