import { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useRegistration } from "../../hooks/useRegistration";

import Graphics from "../../components/common/Graphics";
import CardInput from "../../components/pay/CardInput";
//import ProgressIndicator from "../../components/common/ProgressIndicator";
import { colors, spacing } from "../../styles/globalStyles";
import React from "react";

function PaymentInformation() {
    const router = useRouter();
    const { state } = useRegistration();
    
    // Verificar que tenemos los datos necesarios
    useEffect(() => {
        if (!state.personalData || !state.selectedPlan) {
            // Si no hay datos, redirigir al inicio del flujo
            router.push('/(auth)/register');
            return;
        }
        
        // Si el plan es gratuito, no debería estar en esta página
        if (state.selectedPlan.planPrice === '$0' || state.selectedPlan.planTitle === 'Plan Free') {
            router.push('/(auth)/plans');
            return;
        }
    }, [state.personalData, state.selectedPlan, router]);
    
    const planSelect = state.selectedPlan ? 
        `${state.selectedPlan.planTitle} - ${state.selectedPlan.planSubtitle}` : 
        'Plan no seleccionado'
    
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Graphics
                variant="left"
                title="Información de Pago"
                subtitle="Ingresa los datos de tu tarjeta para proceder con el pago de forma segura"
            />
            
            {/*<ProgressIndicator />*/}
            
            <CardInput planSelect={planSelect} />
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
        paddingBottom: spacing.xl,
    },
});

export default PaymentInformation;