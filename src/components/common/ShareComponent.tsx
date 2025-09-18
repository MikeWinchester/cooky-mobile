import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShareComponentProps {
  recipe: {
    title: string;
    description?: string;
    ingredients: string[];
    instructions: string[];
    image?: string;
  };
}

export default function ShareComponent({ recipe }: ShareComponentProps) {
  const shareRecipe = async () => {
    try {
      const message = `🍳 ${recipe.title}\n\n${recipe.description || ''}\n\n📝 Ingredientes:\n${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}\n\n👨‍🍳 Instrucciones:\n${recipe.instructions.map((inst, index) => `${index + 1}. ${inst}`).join('\n')}\n\n📱 Compartido desde Cooky App`;

      await Share.share({
        message,
        title: recipe.title,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la receta');
    }
  };

  const shareToWhatsApp = async () => {
    try {
      const message = `🍳 ${recipe.title}\n\n${recipe.description || ''}\n\n📝 Ingredientes:\n${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}\n\n👨‍🍳 Instrucciones:\n${recipe.instructions.map((inst, index) => `${index + 1}. ${inst}`).join('\n')}\n\n📱 Compartido desde Cooky App`;

      await Share.share({
        message: `whatsapp://send?text=${encodeURIComponent(message)}`,
        title: 'Compartir en WhatsApp',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir en WhatsApp');
    }
  };

  const shareToInstagram = async () => {
    try {
      const message = `🍳 ${recipe.title}\n\n${recipe.description || ''}\n\n📝 Ingredientes:\n${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}\n\n👨‍🍳 Instrucciones:\n${recipe.instructions.map((inst, index) => `${index + 1}. ${inst}`).join('\n')}\n\n📱 Compartido desde Cooky App`;

      await Share.share({
        message: `instagram://story?text=${encodeURIComponent(message)}`,
        title: 'Compartir en Instagram',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir en Instagram');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compartir Receta</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={shareRecipe}>
          <Ionicons name="share-outline" size={24} color="#FFF8EC" />
          <Text style={styles.buttonText}>Compartir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.shareButton, styles.whatsappButton]} onPress={shareToWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color="#FFF8EC" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.shareButton, styles.instagramButton]} onPress={shareToInstagram}>
          <Ionicons name="logo-instagram" size={24} color="#FFF8EC" />
          <Text style={styles.buttonText}>Instagram</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#461604',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FE6700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  instagramButton: {
    backgroundColor: '#E4405F',
  },
  buttonText: {
    color: '#FFF8EC',
    fontSize: 14,
    fontWeight: '600',
  },
});
