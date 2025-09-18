
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingProps {
    description: string;
}

function Loading({ description }: LoadingProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator size="large" color="#FE6700" style={styles.spinner} />
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
    },
    content: {
        alignItems: 'center',
    },
    spinner: {
        marginBottom: 16,
    },
    description: {
        color: '#461604',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Loading;