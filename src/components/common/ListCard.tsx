import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ListCardProps } from "../../types";
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

function ListCard({ nameList, description, date, itemsList, onDelete, onClick }: ListCardProps) {
    const handleDelete = () => {
        if (onDelete) {
            onDelete();            
        }
    };

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onClick}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    <Text style={styles.title}>{nameList}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.date}>{date}</Text>
                    <View style={styles.itemsBadge}>
                        <Text style={styles.itemsText}>
                            {itemsList ? itemsList.length : 0} items
                        </Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={handleDelete}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.btn.primary,
        borderRadius: 12,
        padding: spacing.md,
        marginVertical: spacing.sm,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    leftContent: {
        flex: 1,
        gap: spacing.xs,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.text.secondary,
    },
    description: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
        opacity: 0.9,
    },
    date: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        opacity: 0.8,
    },
    itemsBadge: {
        backgroundColor: '#A1390B',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#461604',
        alignSelf: 'flex-start',
    },
    itemsText: {
        color: colors.text.secondary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    deleteButton: {
        padding: spacing.xs,
        marginLeft: spacing.sm,
    },
});

export default ListCard;