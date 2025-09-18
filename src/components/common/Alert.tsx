import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface AlertProps {
    message: string;
    type: 'error' | 'info' | 'warning' | 'success';
    children?: React.ReactNode;
}

const typeStyles = {
    error: colors.feedback.error,
    info: '#3B82F6',
    warning: colors.feedback.warning,
    success: colors.feedback.success,
};

const typeIcons = {
    error: 'close-circle' as keyof typeof Ionicons.glyphMap,
    info: 'information-circle' as keyof typeof Ionicons.glyphMap,
    warning: 'warning' as keyof typeof Ionicons.glyphMap,
    success: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
};

function Alert({ message, type, children }: AlertProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons 
                        name={typeIcons[type]} 
                        size={64} 
                        color={typeStyles[type]} 
                    />
                </View>
                <Text style={styles.title}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                <Text style={styles.message}>{message}</Text>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        paddingHorizontal: spacing.md,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        marginBottom: spacing.lg,
        textAlign: 'center',
        lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    },
});

export default Alert;
