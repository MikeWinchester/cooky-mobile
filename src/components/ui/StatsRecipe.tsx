
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { capitalize } from "../../utils/utils";
import { colors, spacing, typography } from '../../styles/globalStyles';

interface StatsRecipeProps {
    recipe: {
        ingredientsNumber: number | 0;
        difficulty: string | 'N/A';
        preparationTime: string | '5';
        servings: number | 0
    };
    isSaved: boolean;
    toggleSave: () => void;
}

function StatsRecipe({ recipe, isSaved, toggleSave }: StatsRecipeProps) {
    return (
        <View style={styles.container}>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="nutrition" size={20} color="#B45309" />
                    </View>
                    <Text style={styles.statLabel}>Ingredientes</Text>
                    <Text style={styles.statValue}>{recipe.ingredientsNumber}</Text>
                </View>
                
                <View style={styles.statItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="restaurant" size={20} color="#B45309" />
                    </View>
                    <Text style={styles.statLabel}>Dificultad</Text>
                    <Text style={styles.statValue}>{capitalize(recipe.difficulty)}</Text>
                </View>
                
                <View style={styles.statItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="time" size={20} color="#B45309" />
                    </View>
                    <Text style={styles.statLabel}>Tiempo</Text>
                    <Text style={styles.statValue}>{recipe.preparationTime} min</Text>
                </View>
                
                <View style={styles.statItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="people" size={20} color="#B45309" />
                    </View>
                    <Text style={styles.statLabel}>
                        {recipe.servings > 1 ? 'Porciones' : 'Porcion'}
                    </Text>
                    <Text style={styles.statValue}>{recipe.servings}</Text>
                </View>

                <TouchableOpacity
                    onPress={toggleSave}
                    style={styles.saveButton}
                    activeOpacity={0.8}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons 
                            name={isSaved ? "bookmark" : "bookmark-outline"} 
                            size={20} 
                            color="#B45309" 
                        />
                    </View>
                    <Text style={styles.statLabel}>
                        {isSaved ? "Guardado" : "¿Guardar?"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFDDA5',
        padding: spacing.md,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    statLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
        fontWeight: typography.fontWeight.semibold,
        textAlign: 'center',
    },
    statValue: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: '#B45309',
        textAlign: 'center',
    },
    saveButton: {
        alignItems: 'center',
        flex: 1,
    },
});

export default StatsRecipe;