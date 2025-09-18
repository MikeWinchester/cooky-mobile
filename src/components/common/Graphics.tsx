import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { GraphicsProps } from '../../types';
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

export default function Graphics({ variant = 'right', title, subtitle }: GraphicsProps) {

    if (variant === 'left') {
        return (
            <View style={styles.leftContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={styles.subtitle}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.rightContainer}>
            <View style={styles.decoration} />
        </View>
    );
}

const styles = StyleSheet.create({
    leftContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
    rightContainer: {
        alignItems: 'flex-end',
    },
    decoration: {
        width: 60,
        height: 60,
        backgroundColor: colors.bg.secondary,
        borderRadius: 30,
    },
});
