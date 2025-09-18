import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Button from '../../components/common/Button'
import CookyLogo from '../../components/ui/CookyLogo'
import ImmersiveIndicator from '../../components/common/ImmersiveIndicator'
import { colors, spacing, typography } from '../../styles/globalStyles'
import { useImmersiveMode } from '../../hooks/useImmersiveMode'
import React from 'react'

function LandingPage() {
  const router = useRouter()
  const { isImmersive } = useImmersiveMode(true)

  // Estilos dinámicos basados en immersive mode
  const dynamicStyles = StyleSheet.create({
    container: {
      ...styles.container,
      backgroundColor: isImmersive ? colors.bg.primary : colors.bg.primary,
    },
    contentContainer: {
      ...styles.contentContainer,
      justifyContent: isImmersive ? 'space-between' : 'center',
      paddingBottom: isImmersive ? 0 : spacing.xl,
      backgroundColor: colors.bg.primary,
    },
    heroSection: {
      ...styles.heroSection,
      paddingBottom: isImmersive ? spacing.lg : spacing['2xl'],
      backgroundColor: colors.bg.primary,
    },
    buttonContainer: {
      ...styles.buttonContainer,
      marginBottom: isImmersive ? spacing.lg : 0,
    }
  })

  return (
    <View style={dynamicStyles.container}>
      <StatusBar 
        backgroundColor={colors.bg.primary} 
        barStyle="dark-content" 
        translucent={isImmersive}
      />
      <ImmersiveIndicator isImmersive={isImmersive} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={dynamicStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section - Centrado verticalmente */}
        <View style={dynamicStyles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.title}>
              Bienvenido a
            </Text>          
            <View style={styles.logoContainer}>
              <CookyLogo width={160} height={160} />
            </View>
            <Text style={styles.subtitle}>
              ¡Regístrate ahora y obtén <Text style={styles.highlight}>7 días</Text> premium gratis!
            </Text>
            {/* Call to Action Buttons */}
            <View style={dynamicStyles.buttonContainer}>
              <Button 
                label="Iniciar Sesión" 
                variant="outline" 
                size="medium" 
                onPress={() => router.push('/(auth)/login')} 
                style={styles.button}
              />
              <Button 
                label="Registrarse" 
                variant="primary" 
                size="medium" 
                onPress={() => router.push('/(auth)/register')} 
                style={styles.button}
              />
            </View>
            
            {/* Link to Features */}
            <TouchableOpacity 
              onPress={() => router.push('/features')} 
              style={styles.featuresLink}
            >
              <Text style={styles.featuresLinkText}>¿Por qué elegir Cooky?</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.btn.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
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
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
    paddingBottom: spacing.xl, // Espacio adicional en la parte inferior
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'], // Más espacio en la parte inferior
    minHeight: 600, // Asegura que ocupe suficiente espacio
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    paddingHorizontal: spacing.md,
  },
  highlight: {
    fontWeight: typography.fontWeight.bold,
    color: colors.btn.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  button: {
    flex: 1,
    minWidth: 120,
    maxWidth: 150,
  },
  featuresLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  featuresLinkText: {
    fontSize: typography.fontSize.base,
    color: colors.btn.primary,
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.xs,
  },
})

export default LandingPage