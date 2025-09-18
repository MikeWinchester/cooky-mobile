import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { paymentMethods } from "../../data/PaymentMethods";
import { colors, spacing, typography } from '../../styles/globalStyles';

function PaymentMethods() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Métodos de pago aceptados:</Text>
            <View style={styles.methodsContainer}>
                {paymentMethods.map((pay, index) => (
                    <View 
                        key={index}
                        style={styles.methodItem}
                    >
                        <Text style={styles.methodIcon}>{pay.icon}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.lg,
        alignItems: 'center',
    },
    title: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
        opacity: 0.7,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    methodsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    methodItem: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg.primary,
        padding: spacing.sm,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    methodIcon: {
        fontSize: 20,
        textAlign: 'center',
    },
});

export default PaymentMethods;