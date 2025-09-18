import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { FeatureSectionProps } from '../../types';
import { colors, spacing, typography } from '../../styles/globalStyles';

export default function FeatureSection({ title, description, icon }: FeatureSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                {typeof icon === 'string' ? (
                    <Text style={styles.icon}>{icon}</Text>
                ) : (
                    icon
                )}
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
                {description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.btn.outline,
        borderRadius: 16,
        backgroundColor: '#F0E6D2',
    },
    iconContainer: {
        marginBottom: spacing.md,
    },
    icon: {
        fontSize: 32,
        textAlign: 'center',
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    description: {
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        textAlign: 'center',
        lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    },
});
