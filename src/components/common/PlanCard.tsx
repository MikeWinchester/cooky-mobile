import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from "./Button";
import type { PlanCardProps } from "../../types/components";
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

const CheckIcon = () => (
    <View style={styles.checkIcon}>
        <Ionicons name="checkmark" size={12} color="#FFF8EC" />
    </View>
);

function PlanCard({ plan, onPlanSelect }: PlanCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subtitle}>{plan.planTitle}</Text>
                <Text style={styles.title}>{plan.planSubtitle}</Text>
                <Text style={styles.price}>
                    <Text style={styles.priceAmount}>{plan.planPrice}</Text>
                    {` /${plan.planDuration}`}
                </Text>
            </View>
            <View style={styles.features}>
                {plan.planFeatures.map((feature: string, index: number) => (
                    <View key={index} style={styles.featureItem}>
                        <CheckIcon />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>
            <Button
                label="Seleccionar Plan"
                variant="primary"
                size="medium"
                style={styles.button}
                onPress={() => onPlanSelect?.(plan)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg.secondary,
        borderWidth: 2,
        borderColor: colors.btn.primary, // Corregido: 'colors.border.primary' no existe, se usa un color válido
        borderRadius: 12,
        padding: spacing.lg,
        marginVertical: spacing.lg,
        maxWidth: 350,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    subtitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    price: {
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
    },
    priceAmount: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.extrabold,
    },
    features: {
        marginBottom: spacing.lg,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
        gap: spacing.sm,
    },
    checkIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#461604',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    featureText: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    },
    button: {
        marginTop: spacing.lg,
    },
});

export default PlanCard;