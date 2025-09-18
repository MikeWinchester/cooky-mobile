import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { findSvgByName } from '../../utils/ingredientSvg';
import type { ItemType } from '../../types';
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

interface ItemListProps {
    item: ItemType;
    onToggle?: () => void;
    onDelete?: (id: string) => void;
    disabled?: boolean;
}

function ItemListProfile({ item, onDelete, disabled = false }: ItemListProps) {
    const translateX = useRef(new Animated.Value(0)).current;
    const deleteOpacity = useRef(new Animated.Value(0)).current;
    
    // Obtener el SVG dinámicamente
    const itemSvg = findSvgByName(item.name);
    
    const handlePanGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );
    
    const handlePanStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX } = event.nativeEvent;
            
            if (translationX < -50) {
                // Si se deslizó lo suficiente, ejecutar eliminación
                if (onDelete && item.id) {
                    onDelete(item.id);
                }
            }
            
            // Regresar a la posición original
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
            
            Animated.timing(deleteOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else if (event.nativeEvent.state === 2) { // 2 corresponde a State.ACTIVE
            // Mostrar el botón de eliminar mientras se desliza
            // translateX es un Animated.Value, así que necesitamos obtener su valor actual
            translateX.stopAnimation((currentValue: number) => {
                const opacity = Math.min(Math.abs(currentValue) / 50, 1);
                Animated.timing(deleteOpacity, {
                    toValue: opacity,
                    duration: 100,
                    useNativeDriver: true,
                }).start();
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Overlay rojo progresivo */}
            <Animated.View 
                style={[
                    styles.deleteOverlay,
                    {
                        opacity: deleteOpacity,
                    }
                ]}
            />
            
            {/* Botón de eliminar */}
            <View style={styles.deleteButton}>
                <TouchableOpacity 
                    onPress={() => onDelete && item.id && onDelete(item.id)}
                    style={styles.deleteButtonContent}
                >
                    <Ionicons name="trash" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            
            {/* Contenedor deslizable */}
            <PanGestureHandler
                onGestureEvent={disabled ? undefined : handlePanGestureEvent}
                onHandlerStateChange={disabled ? undefined : handlePanStateChange}
                enabled={!disabled}
            >
                <Animated.View
                    style={[
                        styles.itemContainer,
                        {
                            transform: [{ translateX }],
                        },
                        disabled && styles.disabledContainer,
                    ]}
                >
                    <View style={styles.itemContent}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconText}>{itemSvg}</Text>
                        </View>
                        <Text style={styles.itemName}>
                            {item.name}
                        </Text>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 8,
        marginVertical: spacing.xs,
    },
    deleteOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.feedback.error,
        borderRadius: 8,
        zIndex: 2,
    },
    deleteButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 48,
        backgroundColor: '#DC2626',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        zIndex: 6,
    },
    deleteButtonContent: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 7,
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
        minHeight: 64,
        maxHeight: 74,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        paddingLeft: spacing.md,
        gap: spacing.md,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.bg.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconText: {
        fontSize: 20,
        textAlign: 'center',
    },
    itemName: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        fontWeight: typography.fontWeight.normal,
    },
    disabledContainer: {
        opacity: 0.6,
    },
});

export default ItemListProfile;