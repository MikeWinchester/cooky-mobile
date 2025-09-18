import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const isActive = (route: string) => {
    return pathname?.includes(route);
  };

  const navigationItems = [
    {
      key: 'recipe',
      label: 'Cocina',
      route: '/(app)/recipe',
      icon: 'flame' as keyof typeof Ionicons.glyphMap,
    },
    {
      key: 'list',
      label: 'Listas',
      route: '/(app)/list',
      icon: 'list' as keyof typeof Ionicons.glyphMap,
    },
    {
      key: 'profile',
      label: 'Perfil',
      route: '/(app)/profile',
      icon: 'person' as keyof typeof Ionicons.glyphMap,
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header Navigation */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flame" size={40} color="#FFF8EC" style={styles.logo} />
          <Text style={styles.title}>Cooky</Text>
        </View>
        <View style={styles.navContainer}>
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.navButton,
                isActive(item.route) && styles.activeButton
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              <Text style={[
                styles.navText,
                isActive(item.route) && styles.activeText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF8A65',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Para el status bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF8EC',
  },
  navContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
  },
  navText: {
    fontSize: 16,
    color: '#FFF8EC',
    fontWeight: '500',
  },
  activeText: {
    fontWeight: '700',
    color: '#FFF8EC',
  },
});
