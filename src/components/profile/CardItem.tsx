
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface CardItemProps {
    label: string;
    icon: React.ReactNode | string;
    href: string;
}

function CardItem({ label, icon, href }: CardItemProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push(href);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.container}
            activeOpacity={0.8}
        >
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    {typeof icon === 'string' ? (
                        <Ionicons 
                            name={icon as keyof typeof Ionicons.glyphMap} 
                            size={16} 
                            color="#381C08" 
                        />
                    ) : (
                        icon
                    )}
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>

            <Ionicons 
                name="chevron-forward" 
                size={16} 
                color="#381C08" 
                style={styles.chevron}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        marginVertical: spacing.xs,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FED7AA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: typography.fontSize.sm,
        color: '#381C08',
    },
    chevron: {
        opacity: 0.6,
    },
});

export default CardItem;