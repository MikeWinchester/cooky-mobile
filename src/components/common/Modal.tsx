import React from 'react';
import { View, Text, StyleSheet, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Button from './Button';
import type { ModalProps } from '../../types/components';
import { colors, spacing, typography } from '../../styles/globalStyles';

function Modal({ isOpen, type, title, children, onConfirm, onCancel }: ModalProps) {
    if (!isOpen) return null;

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                            <View style={styles.body}>
                                {children}
                            </View>
                            <View style={styles.footer}>
                                {type === 'signout' && (
                                    <View style={styles.buttonRow}>
                                        <Button
                                            label="Cancelar"
                                            variant="outline"
                                            size='medium'
                                            onPress={onCancel}
                                            style={styles.button}
                                        />
                                        <Button
                                            label="Cerrar Sesión"
                                            variant="secondary"
                                            size='medium'
                                            onPress={onConfirm}
                                            style={styles.button}
                                        />
                                    </View>
                                )}
                                {type === 'info' && (
                                    <View style={styles.buttonRow}>
                                        <Button
                                            label="Cerrar"
                                            variant="outline"
                                            size='medium'
                                            onPress={onCancel}
                                            style={styles.button}
                                        />
                                    </View>
                                )}
                                {type === 'delete' && (
                                    <View style={styles.buttonRow}>
                                        <Button
                                            label="Cancelar"
                                            variant="outline"
                                            size='medium'
                                            onPress={onCancel}
                                            style={styles.button}
                                        />
                                        <Button
                                            label="Eliminar"
                                            variant="secondary"
                                            size='medium'
                                            onPress={onConfirm}
                                            style={styles.button}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    content: {
        backgroundColor: colors.bg.primary,
        borderRadius: 12,
        padding: spacing.lg,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        textAlign: 'center',
    },
    body: {
        marginBottom: spacing.lg,
    },
    footer: {
        marginTop: spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.md,
        justifyContent: 'center',
    },
    button: {
        flex: 1,
    },
});

export default Modal;