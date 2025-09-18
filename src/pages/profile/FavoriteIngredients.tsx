import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { categories } from "../../data/Categories";
import { quick, favorite as favoriteSeed } from "../../data/FavoriteIngredients";
import type { Item } from "../../data/DislikeIngredientes";
import type { FormFieldConfig } from "../../types";
import { findSvgByName } from "../../utils/ingredientSvg";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import DynamicForm from "../../components/common/DynamicForm";
import ItemListProfile from "../../components/common/ItemListProfile";
import { useProfileStore } from "../../store/useProfileStore";
import { colors, spacing, typography } from "../../styles/globalStyles";

interface FavoriteIngredientsProps {
  onBack?: () => void;
}

function FavoriteIngredients({ onBack }: FavoriteIngredientsProps) {
  const router = useRouter();
  const { profile, status, error, fetchProfile, saveFavorites, clearError } = useProfileStore();

  const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Cargar perfil al montar
  useEffect(() => {
    fetchProfile();
  }, []);

  // Mapear favoritos del perfil a items con svg
  useEffect(() => {
    const favs = profile?.favorite_ingredients ?? null;

    if (favs && favs.length) {
      const mapped: Item[] = favs.map(n => ({
        id: n.trim().toLowerCase().replace(/\s+/g, "-"),
        name: n,
        svg: findSvgByName(n),
      }));
      setItems(mapped);
    } else {
      setItems(favoriteSeed);
    }
  }, [profile]);

  // Opciones de categoría / producto
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Generate product options based on selected category
  const getProductOptions = (categoryId: string) => {
    const selectedCat = categories.find(cat => cat.id === categoryId);
    if (!selectedCat || !selectedCat.products) return [];
    return selectedCat.products.map(product => ({
      value: product.id,
      label: product.name
    }));
  };

  // Campos del form del modal
  const addProductFormFields: FormFieldConfig[] = useMemo(() => [
    {
      name: "categoria",
      type: "list",
      label: "Categoria",
      placeholder: "Selecciona una categoria",
      required: true,
      options: categoryOptions
    },
    {
      name: "productos",
      type: "list",
      label: "Productos",
      placeholder: selectedCategory ? "Selecciona un producto" : "Primero selecciona una categoria",
      required: true,
      options: getProductOptions(selectedCategory),
      disabled: !selectedCategory
    }
  ], [selectedCategory, categoryOptions]);

  const loading = status === "loading";

  // Guardado inmediato helper
  const persist = async (nextItems: Item[]) => {
    setItems(nextItems);                       
    try {
      await saveFavorites(nextItems.map(i => i.name));
    } catch {
      // si falla, restaura a estado previo del perfil
      const prev = (profile?.favorite_ingredients ?? []).map(n => ({
        id: n.trim().toLowerCase().replace(/\s+/g, "-"),
        name: n,
        svg: findSvgByName(n)
      }));
      setItems(prev);
    }
  };

  // Eliminar 
  const handleDelete = async (id: string) => {
    if (loading) return;
    const next = items.filter(it => it.id !== id);
    await persist(next);
  };

  // Agregar 
  const addItem = async (name: string, svg: string) => {
    if (loading) return;
    const cleaned = name.trim();
    if (!cleaned) return;
    if (items.some(x => x.name.toLowerCase() === cleaned.toLowerCase())) {
      setAdding(false);
      setSelectedCategory("");
      return;
    }
    const next = [...items, {
      id: cleaned.toLowerCase().replace(/\s+/g, "-"),
      name: cleaned,
      svg
    }];
    await persist(next);
    setAdding(false);
    setSelectedCategory("");
  };

  // Submit del DynamicForm 
  const handleFormSubmit = async (formData: Record<string, string | number | boolean>) => {
    const categoriaId = String(formData.categoria || "");
    const productoId  = String(formData.productos || "");
    const selectedCat = categories.find(cat => cat.id === categoriaId);
    const selectedProduct = selectedCat?.products?.find(prod => prod.id === productoId);
    if (selectedProduct) {
      await addItem(selectedProduct.name, selectedProduct.svg);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onBack ? onBack() : router.push('/(app)/profile')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ingredientes Favoritos</Text>
      </View>

      {/* Lista */}
      <View style={styles.listContainer}>
        {error && (
          <TouchableOpacity style={styles.errorContainer} onPress={clearError}>
            <Text style={styles.errorText}>{error}</Text>
          </TouchableOpacity>
        )}

        {items.map(it => (
          <ItemListProfile
            key={it.id}
            item={{ id: it.id, name: it.name, svg: it.svg }}
            onDelete={() => handleDelete(it.id)}
            disabled={loading}
          />
        ))}

        {adding && (
          <Modal title="Añadir ingrediente" isOpen={adding} type="form">
            <DynamicForm
              fields={addProductFormFields}
              onSubmit={handleFormSubmit}
              submitButtonText={loading ? "Guardando…" : "Agregar"}
              submitButtonVariant="secondary"
              resetOnSubmit={true}
              isLoading={loading}
              onFieldChange={(fieldName, value) => {
                if (fieldName === "categoria") {
                  setSelectedCategory(String(value));
                }
              }}
            >
              <Button
                label="Cerrar"
                variant="outline"
                onPress={() => { setAdding(false); setSelectedCategory(""); }}
              />
            </DynamicForm>
          </Modal>
        )}
      </View>

      {/* Botón añadir */}
      {!adding && (
        <Button
          label="Añadir ítem a lista"
          variant="secondary"
          size="medium"
          style={styles.addButton}
          onPress={() => setAdding(true)}
          disabled={loading}
        />
      )}

      {/* Sugerencias rápidas */}
      <View style={styles.quickList}>
        {quick.map(q => (
          <TouchableOpacity
            key={q.id}
            style={[
              styles.quickItem,
              loading && styles.quickItemDisabled
            ]}
            onPress={() => addItem(q.name, q.svg)}
            disabled={loading}
          >
            <View style={styles.quickAvatar}>
              <Text style={styles.quickAvatarText}>❤️</Text>
            </View>
            <Text style={styles.quickName}>{q.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backButtonText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  listContainer: {
    marginBottom: spacing.lg,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  addButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  quickList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '45%',
  },
  quickItemDisabled: {
    opacity: 0.6,
  },
  quickAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  quickAvatarText: {
    fontSize: 12,
  },
  quickName: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default FavoriteIngredients;