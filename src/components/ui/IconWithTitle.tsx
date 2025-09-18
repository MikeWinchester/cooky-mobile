import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface IconWithTitleProps {
    title: string;
    url: string;
    onBack?: () => void;
}

function IconWithTitle({ title, url, onBack }: IconWithTitleProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onBack) {
            onBack();
        } else {
            console.log('IconWithTitle navigating to:', url);
            router.push(url);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={handlePress}
                style={styles.button}
                activeOpacity={0.8}
            >
                <Ionicons 
                    name="chevron-back" 
                    size={20} 
                    color="#461604" 
                />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    button: {
        width: 40,
        height: 40,
        backgroundColor: colors.bg.primary,
        borderWidth: 1,
        borderColor: '#461604',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#461604',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: 0,
    },
});

export default IconWithTitle;