import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface ProfileAvatarProps {
  src: string;
  alt?: string;
  name: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  badgeIcon?: React.ReactNode;
  showInfo?: boolean; // Nueva prop para controlar si mostrar nombre y email
  style?: ViewStyle;
}

export default function ProfileAvatar({ 
  src, 
  alt = "Foto de perfil", 
  name, 
  email, 
  size = 'lg',
  showBadge = false,
  badgeIcon,
  showInfo = true, // Por defecto muestra la info
  style
}: ProfileAvatarProps) {
  
  const sizeConfig = {
    sm: {
      outerRing: 96,
      innerRing: 80,
      image: 64,
      badge: 20,
      icon: 10,
      badgePosition: { bottom: 4, right: 4 },
    },
    md: {
      outerRing: 128,
      innerRing: 112,
      image: 96,
      badge: 24,
      icon: 12,
      badgePosition: { bottom: 6, right: 6 },
    },
    lg: {
      outerRing: 160,
      innerRing: 144,
      image: 128,
      badge: 28,
      icon: 16,
      badgePosition: { bottom: 8, right: 8 },
    },
    xl: {
      outerRing: 192,
      innerRing: 176,
      image: 160,
      badge: 32,
      icon: 20,
      badgePosition: { bottom: 8, right: 8 },
    }
  };

  const currentSize = sizeConfig[size];

  const defaultBadgeIcon = (
    <Ionicons name="person" size={currentSize.icon} color="#FF8C00" />
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarContainer}>
        {/* Anillos de borde */}
        <View 
          style={[
            styles.outerRing,
            {
              width: currentSize.outerRing,
              height: currentSize.outerRing,
              borderRadius: currentSize.outerRing / 2,
            }
          ]}
        />
        <View 
          style={[
            styles.innerRing,
            {
              width: currentSize.innerRing,
              height: currentSize.innerRing,
              borderRadius: currentSize.innerRing / 2,
            }
          ]}
        />
        
        {/* Imagen principal */}
        <Image
          source={{ uri: src }}
          style={[
            styles.image,
            {
              width: currentSize.image,
              height: currentSize.image,
              borderRadius: currentSize.image / 2,
            }
          ]}
          alt={alt}
        />
        
        {/* Badge */}
        {showBadge && (
          <View 
            style={[
              styles.badge,
              {
                width: currentSize.badge,
                height: currentSize.badge,
                borderRadius: currentSize.badge / 2,
                bottom: currentSize.badgePosition.bottom,
                right: currentSize.badgePosition.right,
              }
            ]}
          >
            {badgeIcon || defaultBadgeIcon}
          </View>
        )}
      </View>
      
      {/* Información del usuario - solo se muestra si showInfo es true */}
      {showInfo && name && (
        <Text style={styles.name}>
          {name}
        </Text>
      )}
      {showInfo && email && (
        <Text style={styles.email}>
          {email}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    backgroundColor: '#FFB84D',
    opacity: 0.3,
  },
  innerRing: {
    position: 'absolute',
    backgroundColor: '#FFA500',
    opacity: 0.5,
  },
  image: {
    borderWidth: 4,
    borderColor: '#FF8C00',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.sm,
    textAlign: 'center',
    color: '#381C08',
  },
  email: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    color: '#381C08',
    opacity: 0.7,
    marginTop: spacing.xs, // Reducido de spacing.md a spacing.xs
  },
});