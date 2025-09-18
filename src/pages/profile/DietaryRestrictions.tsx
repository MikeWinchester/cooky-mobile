import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { categories } from "../../data/Categories";
import type { Item } from "../../data/DislikeIngredientes";
import type { FormFieldConfig } from "../../types";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import DynamicForm from "../../components/common/DynamicForm";
import ItemListProfile from "../../components/common/ItemListProfile";
import { useProfileStore } from "../../store/useProfileStore";
import { normalizeDietaryRestriction, denormalizeDietaryRestriction } from "../../utils/dietaryUtils";
import { colors, spacing, typography } from "../../styles/globalStyles";

const DIET_QUICK: { id: string; name: string; svg: string }[] = [
  { id: "vegano",        name: "Vegano",        svg: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2L4 20h16L12 2z" fill="#4ADE80"/></svg>` },
  { id: "vegetariano",   name: "Vegetariano",   svg: `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="8" fill="#A3E635"/></svg>` },
  { id: "sin_gluten",    name: "Sin Gluten",    svg: `<svg viewBox="0 0 24 24" width="24" height="24"><rect x="4" y="4" width="16" height="16" fill="#FBBF24"/></svg>` },
  { id: "paleo",         name: "Paleo",         svg: `<svg viewBox="0 0 24 24" width="24" height="24"><ellipse cx="12" cy="12" rx="8" ry="6" fill="#F59E0B"/></svg>` },
  { id: "sin_lactosa",   name: "Sin Lactosa",   svg: `<svg viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="4" width="12" height="16" rx="2" fill="#60A5FA"/></svg>` },
];

interface DietaryRestrictionsProps {
  onBack?: () => void;
}

export default function DietaryRestrictions({ onBack }: DietaryRestrictionsProps) {
  const router = useRouter();
  const { profile, status, error, fetchProfile, saveDietaryRestrictions, clearError } = useProfileStore();

  const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Cargar perfil al montar
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const restrictions = profile?.dietary_restrictions ?? [];

    const findSvgByName = (name: string): string => {
      for (const cat of categories) {
        for (const p of (cat.products ?? [])) {
          if (p.name.toLowerCase() === name.toLowerCase()) return p.svg;
        }
      }
      const q = DIET_QUICK.find(x => x.name.toLowerCase() === name.toLowerCase());
      if (q) return q.svg;

      return `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="8" fill="#E5E7EB"/></svg>`;
    };

    const mapped: Item[] = restrictions.map(n => {
      // El backend devuelve las restricciones normalizadas, necesitamos convertirlas de vuelta
      // a formato legible para mostrar en la UI
      const displayName = denormalizeDietaryRestriction(n);
      return {
        id: n, // Usar el valor normalizado del backend como ID
        name: displayName,
        svg: findSvgByName(displayName),
      };
    });
    setItems(mapped);
  }, [profile]);

  const loading = status === "loading";

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  const getProductOptions = (categoryId: string) => {
    const selectedCat = categories.find(cat => cat.id === categoryId);
    return selectedCat?.products?.map(product => ({
      value: product.id,
      label: product.name
    })) || [];
  };

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

  const persist = async (nextItems: Item[]) => {
    const prev = items;
    setItems(nextItems);
    try {
      await saveDietaryRestrictions(nextItems.map(i => i.name));
    } catch {
      setItems(prev);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Eliminando: ', id)
    if (loading) return;
    await persist(items.filter(it => it.id !== id));
  };

  const addItem = async (name: string, svg: string) => {
    if (loading) return;
    const cleaned = name.trim();
    if (!cleaned) return;

    // Verificar si ya existe usando normalización consistente
    const normalizedNew = normalizeDietaryRestriction(cleaned);
    if (items.some(x => x.id === normalizedNew)) {
      setAdding(false);
      setSelectedCategory("");
      return;
    }

    // Usar el valor normalizado como ID para consistencia
    const id = normalizedNew;
    await persist([...items, { id, name: cleaned, svg }]);
    setAdding(false);
    setSelectedCategory("");
  };

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
        <TouchableOpacity style={styles.backButton} onPress={() => onBack ? onBack() : router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Restricciones dietéticas</Text>
      </View>

      {/* Lista */}
      <View style={styles.listContainer}>
        {error && (
          <TouchableOpacity style={styles.errorContainer} onPress={clearError}>
            <Text style={styles.errorText}>{error}</Text>
          </TouchableOpacity>
        )}

        {items.length === 0 && (
          <Text style={styles.emptyText}>
            Aún no has agregado restricciones dietéticas.
          </Text>
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
          <Modal title="Añadir restricción dietética" isOpen={adding} type="form">
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

      {!adding && (
        <Button
          label="Añadir restricción"
          variant="secondary"
          size="medium"
          style={styles.addButton}
          onPress={() => setAdding(true)}
          disabled={loading}
        />
      )}

      <View style={styles.quickList}>
        {DIET_QUICK.map(q => (
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
              <Text style={styles.quickAvatarText}>🥗</Text>
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
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.md,
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
    backgroundColor: '#D1FAE5',
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
