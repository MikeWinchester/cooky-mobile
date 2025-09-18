import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';

import DynamicForm from "../../components/common/DynamicForm";
import Graphics from "../../components/common/Graphics";
import type { FormFieldConfig } from '../../types/components';
import { useRegistration } from '../../hooks/useRegistration';
import type { PersonalData } from '../../types/registration';
import { colors, spacing, typography } from '../../styles/globalStyles';
import ProgressIndicator from '../../components/common/ProgressIndicator';

function Register() {
    const router = useRouter();
    const { setPersonalData, state, goToStep } = useRegistration();
    const [customErrors, setCustomErrors] = useState<Record<string, string>>({});
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Configuración de campos para un formulario de registro
    const registerFormFields: FormFieldConfig[] = [
        {
            name: 'firstName',
            type: 'text',
            label: 'Nombre',
            placeholder: 'Ingresa tu nombre',
            required: true,
            validation: {
                minLength: 2,
                maxLength: 50
            }
        },
        {
            name: 'lastName',
            type: 'text',
            label: 'Apellido',
            placeholder: 'Ingresa tu apellido',
            required: true,
            validation: {
                minLength: 2,
                maxLength: 50
            }
        },
        {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'example@email.com',
            required: true,
            validation: {
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            }
        },
        {
            name: 'password',
            type: 'password',
            label: 'Contraseña',
            placeholder: 'Ingresa tu contraseña',
            required: true,
            validation: {
                minLength: 12,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{12,}$'
            },
        },
        {
            name: 'repetPassword',
            type: 'password',
            label: 'Confirmar Contraseña',
            placeholder: 'Confirma tu contraseña',
            required: true,
            validation: {
                minLength: 12,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{12,}$'
            }
        }
    ];

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

    // Validación personalizada para contraseñas
    const validatePasswords = (formData: Record<string, string | number | boolean>): boolean => {
        const { password, repetPassword } = formData;

        if (password !== repetPassword) {
            setCustomErrors({
                repetPassword: 'Las contraseñas no coinciden'
            });
            return false;
        }

        setCustomErrors({});
        return true;
    };

    // Manejador para el formulario de registro
    const handleRegisterSubmit = async (formData: Record<string, string | number | boolean>) => {
        // Validar que las contraseñas coincidan
        if (!validatePasswords(formData)) {
            return;
        }

        console.log('Datos del formulario de registro:', formData);

        try {
            // Guardar datos en el contexto (sin el repetPassword)
            const personalData: PersonalData = {
                firstName: String(formData.firstName),
                lastName: String(formData.lastName),
                email: String(formData.email),
                password: String(formData.password),
            };

            // Guardar en el contexto
            setPersonalData(personalData);

            // Establecer que estamos completando el paso 1
            goToStep(2); // Ir directamente al paso de selección de plan

        } catch (error) {
            console.error('Error en el registro:', error);
            Alert.alert('Error', 'Error al procesar los datos. Intenta nuevamente.');
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
                        <Text style={styles.title}>Registrarse</Text>
                        <Text style={styles.subtitle}>Ingresa tus datos personales para crear una cuenta.</Text>
                    </View>

                    {/*<ProgressIndicator />*/}
                    <DynamicForm
                        fields={registerFormFields}
                        onSubmit={handleRegisterSubmit}
                        submitButtonText="Continuar"
                        submitButtonVariant="secondary"
                        resetOnSubmit={false}
                        isLoading={state.isLoading}
                        style={styles.formWithoutBox}
                    >
                        {/* Mostrar error personalizado para contraseñas no coincidentes */}
                        {customErrors.repetPassword && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>
                                    {customErrors.repetPassword}
                                </Text>
                            </View>
                        )}

                        {/* Enlace para ir al login */}
                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginText}>
                                ¿Ya tienes una cuenta?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text style={styles.loginLink}>Inicia sesión aquí</Text>
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
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.xl,
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
        marginTop: spacing.sm,
        padding: spacing.sm,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 8,
    },
    errorText: {
        fontSize: typography.fontSize.sm,
        color: colors.feedback.error,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    loginText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.tertiary,
    },
    loginLink: {
        color: colors.btn.primary,
        fontWeight: typography.fontWeight.medium,
    },
});

export default Register;