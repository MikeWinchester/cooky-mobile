import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface CategoryCardProps {
    id: string;
    name: string;
    svg: string;
    onClick?: (categoryId: string) => void;
    style?: any;
}

function CategoryCard({ id, name, svg, onClick, style }: CategoryCardProps) {
    const handlePress = () => {
        console.log('CategoryCard clicked:', id);
        onClick?.(id);
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                <SvgXml xml={svg} width={48} height={48} />
            </View>
            <Text style={styles.name}>
                {name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.btn.secondary,
        borderRadius: 16,
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginBottom: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        width: 64,
    },
    name: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        textAlign: 'center',
    },
});

export default CategoryCard;