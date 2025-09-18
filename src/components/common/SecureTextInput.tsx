import React, { useState, useRef, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface SecureTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
  editable?: boolean;
  maxLength?: number;
  error?: boolean;
  disabled?: boolean;
}

export default function SecureTextInput({
  value,
  onChangeText,
  placeholder,
  style,
  editable = true,
  maxLength,
  error = false,
  disabled = false,
}: SecureTextInputProps) {
  const [isSecure, setIsSecure] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const visibleInputRef = useRef<TextInput>(null);
  const hiddenInputRef = useRef<TextInput>(null);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputStyle = [
    styles.input,
    error && styles.inputError,
    disabled && styles.inputDisabled,
    style,
  ];

  return (
    <View style={styles.container}>
      {/* Input oculto que realmente maneja el texto */}
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={onChangeText}
        editable={editable && !disabled}
        secureTextEntry={true}
        autoComplete="password"
        textContentType="password"
        maxLength={maxLength}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      
      {/* Input visible que muestra puntos o texto */}
      <TextInput
        ref={visibleInputRef}
        style={inputStyle}
        placeholder={placeholder}
        value={isSecure ? '•'.repeat(value.length) : value}
        editable={false} // No editable para evitar entrada directa
        secureTextEntry={false}
        selection={{ start: value.length, end: value.length }}
      />
      
      {/* Overlay invisible para capturar toques */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => {
          // Enfocar el input oculto para activar el teclado
          hiddenInputRef.current?.focus();
        }}
        activeOpacity={1}
      />
      
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={toggleSecureEntry}
        disabled={disabled}
        accessibilityLabel={isSecure ? "Mostrar contraseña" : "Ocultar contraseña"}
      >
        <Ionicons
          name={isSecure ? 'eye-off' : 'eye'}
          size={20}
          color={disabled ? colors.text.tertiary : colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    left: -1000, // Fuera de la pantalla
    opacity: 0,
    height: 0,
    width: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: 50, // Espacio para el botón del ojo
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 50, // Dejar espacio para el botón del ojo
    bottom: 0,
    zIndex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: spacing.xs,
    zIndex: 2,
  },
});