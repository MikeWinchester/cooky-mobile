import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';

import DynamicForm from "../../components/common/DynamicForm";
import Graphics from "../../components/common/Graphics";

import type { FormFieldConfig } from '../../types/components';
import { useAuthStore } from '../../store/useAuthStore';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    
    // Configuración de campos para un formulario de login
    const loginFormFields: FormFieldConfig[] = [
        {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'example@email.com',
            required: true
        },
        {
            name: 'password',
            type: 'password',
            label: 'Contraseña',
            placeholder: 'Tu contraseña',
            required: true,
            validation: {
                minLength: 12
            }
        }
    ];
    const router = useRouter();
    const { loginAsync, isLoading, error, clearError } = useAuthStore()

    // Limpiar errores cuando el componente se monta
    useEffect(() => {
        clearError()
        
        // Cleanup al desmontar el componente
        return () => {
            clearError()
        }
    }, [clearError])

    // Manejar eventos del teclado
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);
    
    // Limpiar error cuando el usuario empiece a escribir
    useEffect(() => {
        if (error) {
            const timeoutId = setTimeout(() => {
                clearError()
            }, 5000) // Auto-limpiar después de 5 segundos
            
            return () => clearTimeout(timeoutId)
        }
    }, [error, clearError])

    // Manejador para el formulario de login
    const handleLoginSubmit = async (formData: Record<string, string | number | boolean>) => {
        // Limpiar errores previos antes del nuevo intento
        clearError();

        try {
            await loginAsync(formData.email as string, formData.password as string);            
            // Solo navegar si no hay error (loginAsync ya maneja el estado interno)
            // Verificar el estado después del login
            const currentState = useAuthStore.getState();
            
            if (currentState.isAuthenticated && !currentState.error) {
                Toast.show({
                    type: 'success',
                    text1: '¡Login exitoso!',
                    text2: 'Bienvenido de vuelta'
                });
                router.push('/(app)/recipe');
            }
            // Si hay error, el store ya lo maneja y se mostrará en la UI
            
        } catch (error) {
            // Este catch ahora solo maneja errores de red o parsing
            console.error('Error de red en login:', error);
            Toast.show({
                type: 'error',
                text1: 'Error de conexión',
                text2: 'Por favor, intenta de nuevo'
            });
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Iniciar sesión</Text>
                        <Text style={styles.subtitle}>Bienvenido de nuevo!</Text>
                    </View>
                    
                    {/* Mostrar error si existe */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <View style={styles.errorContent}>
                                <View style={styles.errorTextContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={clearError}
                                    style={styles.errorCloseButton}
                                    accessibilityLabel="Cerrar mensaje de error"
                                >
                                    <Text style={styles.errorCloseText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    
                    <DynamicForm
                        fields={loginFormFields}
                        onSubmit={handleLoginSubmit}
                        submitButtonText={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        submitButtonVariant="secondary"
                        resetOnSubmit={false}
                        isLoading={isLoading}
                        style={styles.formWithoutBox}
                    >
                        <View style={styles.registerLinkContainer}>
                            <Text style={styles.registerText}>
                                ¿No tienes una cuenta?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                <Text style={styles.registerLink}>Registrate aquí</Text>
                            </TouchableOpacity>
                        </View>
                    </DynamicForm>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.base,
        color: colors.text.tertiary,
        textAlign: 'center',
    },
    formWithoutBox: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        marginHorizontal: 0,
        marginVertical: 0,
        padding: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    errorContainer: {
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    errorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 8,
        padding: spacing.md,
    },
    errorTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: '#B91C1C',
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    errorCloseButton: {
        marginLeft: spacing.sm,
        padding: 4,
    },
    errorCloseText: {
        color: '#F87171',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    registerText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
    },
    registerLink: {
        color: colors.btn.primary,
        fontWeight: typography.fontWeight.medium,
    },
});

export default Login;