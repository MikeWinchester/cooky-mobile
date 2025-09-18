import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { ShoppingListItem } from '../../types/shoppingList';
import { findSvgByName } from '../../utils/ingredientSvg';
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';

interface ItemListProps {
    item: ShoppingListItem;
    onToggle?: () => void;
    onDelete?: (id: string) => void;
}

function ItemList({ item, onToggle, onDelete }: ItemListProps) {
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
                if (onDelete && item.item_id) {
                    onDelete(item.item_id);
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
            // translateX es un Animated.Value, así que necesitamos obtener su valor real
            translateX.extractOffset(); // Asegura que el valor esté actualizado
            translateX.flattenOffset();
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
                    onPress={() => onDelete && item.item_id && onDelete(item.item_id)}
                    style={styles.deleteButtonContent}
                >
                    <Ionicons name="trash" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            
            {/* Contenedor deslizable */}
            <PanGestureHandler
                onGestureEvent={handlePanGestureEvent}
                onHandlerStateChange={handlePanStateChange}
            >
                <Animated.View
                    style={[
                        styles.itemContainer,
                        {
                            transform: [{ translateX }],
                        },
                    ]}
                >
                    <View style={styles.itemContent}>
                        <View style={styles.iconContainer}>
                            <SvgXml xml={itemSvg} width={24} height={24} />
                        </View>
                        <Text style={[
                            styles.itemName,
                            item.is_purchased && styles.purchasedText
                        ]}>
                            {item.name}
                        </Text>
                        <Text style={[
                            styles.quantity,
                            item.is_purchased && styles.purchasedText
                        ]}>
                            {item.quantity} {item.unit}
                        </Text>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={onToggle}
                        >
                            <Ionicons 
                                name={item.is_purchased ? "checkbox" : "square-outline"} 
                                size={20} 
                                color={item.is_purchased ? colors.btn.primary : colors.text.tertiary} 
                            />
                        </TouchableOpacity>
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
    itemName: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        fontWeight: typography.fontWeight.normal,
    },
    quantity: {
        fontSize: typography.fontSize.sm,
        color: colors.text.tertiary,
        marginRight: spacing.sm,
    },
    purchasedText: {
        textDecorationLine: 'line-through',
        color: colors.text.tertiary,
        fontWeight: typography.fontWeight.normal,
    },
    checkbox: {
        padding: spacing.xs,
    },
});

export default ItemList;