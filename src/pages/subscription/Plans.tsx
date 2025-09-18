import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';

import Graphics from "../../components/common/Graphics";
import PlanCard from "../../components/common/PlanCard";
import Modal from "../../components/common/Modal";

import type { PlanCardProps } from "../../types";
import { useRegistration } from "../../hooks/useRegistration";
import type { PlanData } from "../../types/registration";
//import ProgressIndicator from "../../components/common/ProgressIndicator";

import { plans } from "../../data/Plans";
import { colors, spacing, typography } from "../../styles/globalStyles";
import { Ionicons } from '@expo/vector-icons';

type PlansProps = {
    title?: string;
};

function Plans({ title = 'Registrarse' }: PlansProps) {
    const router = useRouter();
    const { selectPlanAndNavigate, submitRegistration, state } = useRegistration();
    // Estado para manejar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para abrir el modal
    const openModal = () => {
        setIsModalOpen(true);
    }
    // Función para cerrar el modal
    const closeModal = async () => {
        setIsSubmitting(true);
        try {
            // Para plan gratuito, enviar directamente los datos
            const success = await submitRegistration();
            if (success) {
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Cuenta creada correctamente'
                });
                router.push('/login');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Error al crear la cuenta. Intenta nuevamente.'
                });
            }
        } catch (error) {
            console.error('Error al cerrar modal:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al crear la cuenta. Intenta nuevamente.'
            });
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    }

    // Función para manejar click en plan
    const handlePlanCardClick = (plan: PlanCardProps['plan']) => {
        console.log(`Clicked on plan: ${plan.planTitle}`);

        // Convertir el plan al formato del Context
        const planData: PlanData = {
            planTitle: plan.planTitle,
            planSubtitle: plan.planSubtitle,
            planPrice: plan.planPrice,
            planDuration: plan.planDuration,
            planFeatures: plan.planFeatures
        };

        console.log('Plan data to save:', planData);

        // Usar la nueva función que maneja todo de una vez
        const planType = selectPlanAndNavigate(planData);

        if (planType === 'free') {
            console.log('Plan is free, showing modal');
            // Para plan gratuito, mostrar modal de confirmación
            openModal();
        }
        // Para planes pagados, selectPlanAndNavigate ya navegó automáticamente
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Graphics
                variant="left"
                title={title}
                subtitle='Selecciona el plan de tu cuenta'
            />

            {/*<ProgressIndicator />*/}
            <View style={styles.plansGrid}>
                {
                    plans.map((plan, index) => (
                        <PlanCard
                            key={index}
                            plan={plan}
                            onPlanSelect={() => handlePlanCardClick(plan)}
                        />
                    ))
                }
            </View>

            {
                isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        type="info"
                        title="Tu cuenta ha sido creada exitosamente"
                        onConfirm={() => closeModal()}
                        onCancel={closeModal}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                            </View>
                            <Text style={styles.modalTitle}>
                                ¡Gracias por unirte al{'\n'}
                                <Text style={styles.planName}>Plan Free - "Cocinero Casual"</Text>
                                !
                            </Text>
                            {/* Información adicional */}
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalText}>
                                    Ya puedes iniciar sesión con tu email{' '}
                                </Text>
                                <Text style={styles.emailText}>
                                    {state.personalData?.email}
                                </Text>
                                <Text style={styles.modalText}>
                                    {' '}y comenzar a explorar todas las funcionalidades de Cooky.
                                </Text>
                            </View>
                        </View>
                    </Modal>
                )
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  modalContent: {
    alignItems: 'center',
    width: '100%',
  },
  checkIcon: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  planName: {
    fontWeight: typography.fontWeight.bold,
  },
  modalInfo: {
    padding: spacing.md,
    alignItems: 'center',
  },
  modalText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    textAlign: 'center',
  },
  emailText: {
    fontSize: typography.fontSize.base,
    fontFamily: 'monospace',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    color: colors.text.primary,
  },
});

export default Plans;