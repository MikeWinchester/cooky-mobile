import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRegistration } from '../../hooks/useRegistration';
import { REGISTRATION_STEPS } from '../../types/registration';
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

function ProgressIndicator() {
    const { state, isPlanFree } = useRegistration();

    const steps = [
        { number: 1, title: "Datos personales", key: REGISTRATION_STEPS.PERSONAL_DATA },
        { number: 2, title: "Seleccionar plan", key: REGISTRATION_STEPS.PLAN_SELECTION },
        { number: 3, title: "Pago", key: REGISTRATION_STEPS.PAYMENT },
        { number: 4, title: "Confirmar", key: REGISTRATION_STEPS.CONFIRMATION }
    ];

    // Si el plan es gratuito, no mostrar el paso de pago
    const visibleSteps = isPlanFree() && state.selectedPlan 
        ? steps.filter(step => step.key !== REGISTRATION_STEPS.PAYMENT)
        : steps;

    // Ajustar los números de paso si saltamos el pago
    if (isPlanFree() && state.selectedPlan) {
        visibleSteps.forEach((step) => {
            if (step.key === REGISTRATION_STEPS.CONFIRMATION) {
                step.number = 3;
            }
        });
    }

    const getStepStyle = (step: any) => {
        if (state.currentStep >= step.key) {
            return styles.stepCompleted;
        } else if (state.currentStep === step.key - 1) {
            return styles.stepCurrent;
        } else {
            return styles.stepPending;
        }
    };

    const getTitleStyle = (step: any) => {
        if (state.currentStep >= step.key) {
            return styles.titleCompleted;
        } else {
            return styles.titlePending;
        }
    };

    const getConnectorStyle = (step: any) => {
        if (state.currentStep > step.key) {
            return styles.connectorCompleted;
        } else {
            return styles.connectorPending;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.stepsContainer}>
                {visibleSteps.map((step, index) => (
                    <View key={step.key} style={styles.stepContainer}>
                        {/* Círculo del paso */}
                        <View style={[styles.stepCircle, getStepStyle(step)]}>
                            {state.currentStep > step.key ? (
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            ) : (
                                <Text style={styles.stepNumber}>{step.number}</Text>
                            )}
                        </View>

                        {/* Título del paso */}
                        <View style={styles.titleContainer}>
                            <Text style={[styles.stepTitle, getTitleStyle(step)]}>
                                {step.title}
                            </Text>
                        </View>

                        {/* Línea conectora (excepto en el último paso) */}
                        {index < visibleSteps.length - 1 && (
                            <View style={[styles.connector, getConnectorStyle(step)]} />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCompleted: {
        backgroundColor: colors.btn.primary,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    stepCurrent: {
        backgroundColor: '#FED7AA',
        borderWidth: 1,
        borderColor: '#FDBA74',
    },
    stepPending: {
        borderWidth: 2,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    stepNumber: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        color: '#6B7280',
    },
    titleContainer: {
        marginLeft: spacing.sm,
    },
    stepTitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        textAlign: 'center',
    },
    titleCompleted: {
        color: colors.btn.primary,
    },
    titlePending: {
        color: '#9CA3AF',
    },
    connector: {
        width: 40,
        height: 1,
        marginHorizontal: spacing.sm,
    },
    connectorCompleted: {
        backgroundColor: colors.btn.primary,
    },
    connectorPending: {
        backgroundColor: '#D1D5DB',
    },
});

export default ProgressIndicator;
