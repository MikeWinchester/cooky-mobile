import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import type { ButtonProps } from '../../types';

export default function Button({ 
    label, 
    variant = 'primary', 
    size = 'medium', 
    isLoading = false, 
    disabled = false,
    style,
    textStyle,
    onPress,
    ...props 
}: ButtonProps) {
    
    const getButtonStyle = (): ViewStyle => {
        const baseStyle = styles.base;
        const variantStyle = styles[variant];
        const sizeStyle = styles[size];
        const disabledStyle = (disabled || isLoading) ? styles.disabled : undefined;

        // Para evitar el error de tipo, usamos StyleProp<ViewStyle> y filtramos los estilos undefined
        return [baseStyle, variantStyle, sizeStyle, disabledStyle, style].filter(Boolean) as unknown as ViewStyle;
    };
    
    const getTextStyle = (): TextStyle => {
        const baseTextStyle = styles.baseText;
        const variantTextStyle = styles[`${variant}Text`];
        const sizeTextStyle = styles[`${size}Text`];

        // Para evitar el error de tipo, usamos StyleProp<TextStyle> y filtramos los estilos undefined
        return [baseTextStyle, variantTextStyle, sizeTextStyle, textStyle].filter(Boolean) as unknown as TextStyle;
    };

    return (
        <TouchableOpacity 
            style={getButtonStyle()}
            disabled={disabled || isLoading}
            onPress={onPress}
            {...props}
        >
            {isLoading && (
                <ActivityIndicator 
                    size="small" 
                    color={variant === 'primary' ? '#FFF8EC' : '#FE6700'} 
                    style={styles.loader}
                />
            )}
            <Text style={getTextStyle()}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primary: {
        backgroundColor: '#FE6700',
    },
    secondary: {
        backgroundColor: '#FFC36D',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FE6700',
    },
    small: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    medium: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    large: {
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    baseText: {
        fontWeight: '600',
        textAlign: 'center',
    },
    primaryText: {
        color: '#FFF8EC',
    },
    secondaryText: {
        color: '#461604',
    },
    outlineText: {
        color: '#FE6700',
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
    loader: {
        marginRight: 8,
    },
});
