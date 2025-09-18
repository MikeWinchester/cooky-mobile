import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { DynamicFormProps, FormFieldConfig } from '../../types/components';
import { colors, spacing, typography } from '../../styles/globalStyles';
import SecureTextInput from './SecureTextInput';

export default function DynamicForm({
    fields,
    onSubmit,
    submitButtonText = 'Enviar',
    submitButtonVariant = 'primary',
    isLoading = false,
    style,
    resetOnSubmit = false,
    size = 'medium',
    children,
    onFieldChange,
    initialValues = {}
}: DynamicFormProps) {
    type valueType = string | number | undefined;
    const [formData, setFormData] = useState<Record<string, valueType>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Size styles
    const sizeStyles = {
        small: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
        medium: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 16 },
        large: { paddingHorizontal: 32, paddingVertical: 16, fontSize: 18 }
    };

    // Keep track of initialization to prevent unnecessary re-initializations
    const isInitialized = useRef(false);
    const previousInitialValues = useRef<Record<string, any>>({});
    
    // Initialize form data with empty values or provided initial values
    const initializeFormData = () => {
        const initialData: Record<string, valueType> = {};
        fields.forEach(field => {
            // Use initial value if provided, otherwise use empty string
            initialData[field.name] = initialValues[field.name] !== undefined 
                ? String(initialValues[field.name]) 
                : '';
        });
        setFormData(initialData);
        setErrors({});
        isInitialized.current = true;
        previousInitialValues.current = { ...initialValues };
    };
    
    // Initialize form data on component mount or when initialValues change
    useEffect(() => {
        // Check if this is the first initialization or if initialValues have actually changed
        const hasInitialValuesChanged = !isInitialized.current || 
            JSON.stringify(previousInitialValues.current) !== JSON.stringify(initialValues);
            
        if (hasInitialValuesChanged) {
            initializeFormData();
        }
    }, [fields, initialValues]);

    // Handle input changes
    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Call onFieldChange callback if provided
        if (onFieldChange) {
            onFieldChange(name, value);
        }
    };

    // Validate individual field
    const validateField = (field: FormFieldConfig, value: string): string => {
        if (field.required && !value.trim()) {
            return `${field.label} es requerido`;
        }

        if (field.validation) {
            const { minLength, maxLength, pattern, min, max } = field.validation;

            if (minLength && value.length < minLength) {
                return `${field.label} debe tener al menos ${minLength} caracteres`;
            }

            if (maxLength && value.length > maxLength) {
                return `${field.label} no puede tener más de ${maxLength} caracteres`;
            }

            if (pattern && !new RegExp(pattern).test(value)) {
                return `${field.label} no tiene el formato correcto`;
            }

            if (field.type === 'number') {
                const numValue = parseFloat(value);
                if (min !== undefined && numValue < min) {
                    return `${field.label} debe ser mayor o igual a ${min}`;
                }
                if (max !== undefined && numValue > max) {
                    return `${field.label} debe ser menor o igual a ${max}`;
                }
            }
        }

        return '';
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        fields.forEach(field => {
            const rawValue = formData[field.name];
            const value = rawValue !== undefined && rawValue !== null ? String(rawValue) : '';
            const error = validateField(field, value);
            if (error) {
                newErrors[field.name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Filter out undefined values and convert to appropriate types
            const processedFormData: Record<string, string | number | boolean> = {};
            
            fields.forEach(field => {
                const rawValue = formData[field.name];
                if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
                    if (field.type === 'number') {
                        const numValue = parseFloat(String(rawValue));
                        if (!isNaN(numValue)) {
                            processedFormData[field.name] = numValue;
                        }
                    } else {
                        processedFormData[field.name] = String(rawValue);
                    }
                } else if (field.required) {
                    // For required fields that are empty, use empty string
                    processedFormData[field.name] = '';
                }
            });
            
            await onSubmit(processedFormData);
            if (resetOnSubmit) {
                initializeFormData();
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    // Render input field based on type
    const renderField = (field: FormFieldConfig) => {
        const value = formData[field.name] || '';
        const error = errors[field.name];

        if (field.type === 'textarea') {
            return (
                <TextInput
                    style={[styles.input, styles.textArea, error && styles.inputError, field.disabled && styles.inputDisabled]}
                    placeholder={field.placeholder}
                    value={String(value)}
                    onChangeText={(text) => handleInputChange(field.name, text)}
                    editable={!field.disabled && !isLoading}
                    multiline
                    numberOfLines={4}
                    maxLength={field.validation?.maxLength}
                />
            );
        }

        if (field.type === 'list') {
            return (
                <View style={[styles.pickerContainer, error && styles.inputError, field.disabled && styles.inputDisabled]}>
                    <Picker
                        selectedValue={String(value)}
                        onValueChange={(itemValue) => handleInputChange(field.name, itemValue)}
                        enabled={!field.disabled && !isLoading}
                    >
                        {field.placeholder && (
                            <Picker.Item label={field.placeholder} value="" />
                        )}
                        {field.options?.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
            );
        }

        // Usar SecureTextInput para campos de contraseña
        if (field.type === 'password') {
            return (
                <SecureTextInput
                    value={String(value)}
                    onChangeText={(text) => handleInputChange(field.name, text)}
                    placeholder={field.placeholder}
                    editable={!field.disabled && !isLoading}
                    maxLength={field.validation?.maxLength}
                    error={!!error}
                    disabled={field.disabled || isLoading}
                />
            );
        }

        return (
            <TextInput
                style={[styles.input, error && styles.inputError, field.disabled && styles.inputDisabled]}
                placeholder={field.placeholder}
                value={String(value)}
                onChangeText={(text) => handleInputChange(field.name, text)}
                editable={!field.disabled && !isLoading}
                autoComplete={field.type === 'email' ? 'email' : 'off'}
                textContentType={field.type === 'email' ? 'emailAddress' : 'none'}
                keyboardType={
                    field.type === 'email' ? 'email-address' :
                    field.type === 'number' ? 'numeric' :
                    field.type === 'tel' ? 'phone-pad' :
                    'default'
                }
                maxLength={field.validation?.maxLength}
            />
        );
    };

    // Si no hay estilo personalizado (formWithoutBox), usar ScrollView interno
    if (!style) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                    {/* Form Fields */}
                    <View style={styles.fieldsContainer}>
                        {fields.map((field) => (
                            <View key={field.name} style={styles.fieldContainer}>
                                {/* Label */}
                                <Text style={styles.label}>
                                    {field.label}
                                    {field.required && (
                                        <Text style={styles.required}> *</Text>
                                    )}
                                </Text>

                                {/* Input Field */}
                                {renderField(field)}

                                {/* Error Message */}
                                {errors[field.name] && (
                                    <Text style={styles.errorText}>
                                        {errors[field.name]}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Submit Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                styles[submitButtonVariant],
                                sizeStyles[size],
                                isLoading && styles.buttonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#FFF8EC" />
                                    <Text style={styles.loadingText}>Enviando...</Text>
                                </View>
                            ) : (
                                <Text style={[styles.buttonText, styles[`${submitButtonVariant}Text`]]}>
                                    {submitButtonText}
                                </Text>
                            )}
                        </TouchableOpacity>
                        {children}
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Si hay estilo personalizado (formWithoutBox), usar View simple
    return (
        <View style={style}>
            {/* Form Fields */}
            <View style={styles.fieldsContainer}>
                {fields.map((field) => (
                    <View key={field.name} style={styles.fieldContainer}>
                        {/* Label */}
                        <Text style={styles.label}>
                            {field.label}
                            {field.required && (
                                <Text style={styles.required}> *</Text>
                            )}
                        </Text>

                        {/* Input Field */}
                        {renderField(field)}

                        {/* Error Message */}
                        {errors[field.name] && (
                            <Text style={styles.errorText}>
                                {errors[field.name]}
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        styles[submitButtonVariant],
                        sizeStyles[size],
                        isLoading && styles.buttonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#FFF8EC" />
                            <Text style={styles.loadingText}>Enviando...</Text>
                        </View>
                    ) : (
                        <Text style={[styles.buttonText, styles[`${submitButtonVariant}Text`]]}>
                            {submitButtonText}
                        </Text>
                    )}
                </TouchableOpacity>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg.primary,
        borderRadius: 12,
        marginHorizontal: spacing.md,
        marginVertical: spacing.lg,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    form: {
        flex: 1,
    },
    fieldsContainer: {
        gap: spacing.md,
    },
    fieldContainer: {
        marginBottom: spacing.sm,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    required: {
        color: colors.feedback.error,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: typography.fontSize.base,
        backgroundColor: '#FFFFFF',
        color: colors.text.primary,
    },
    inputError: {
        borderColor: colors.feedback.error,
        backgroundColor: '#FEF2F2',
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        opacity: 0.6,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    errorText: {
        fontSize: typography.fontSize.sm,
        color: colors.feedback.error,
        marginTop: spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: spacing.xl,
        gap: spacing.lg,
    },
    submitButton: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primary: {
        backgroundColor: colors.btn.primary,
    },
    secondary: {
        backgroundColor: colors.btn.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.btn.primary,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        textAlign: 'center',
    },
    primaryText: {
        color: colors.text.secondary,
    },
    secondaryText: {
        color: colors.text.primary,
    },
    outlineText: {
        color: colors.btn.primary,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    loadingText: {
        color: colors.text.secondary,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
    },
});
