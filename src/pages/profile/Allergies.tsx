import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, Ellipse } from "react-native-svg";

import { categories } from "../../data/Categories";
import type { Item } from "../../data/DislikeIngredientes"; 
import type { FormFieldConfig } from "../../types";
import { findSvgByName } from "../../utils/ingredientSvg";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import DynamicForm from "../../components/common/DynamicForm";
import ItemListProfile from "../../components/common/ItemListProfile";
import { useProfileStore } from "../../store/useProfileStore";
import { colors, spacing, typography } from "../../styles/globalStyles";

// Componentes SVG mejorados para alergias
const AllergyIcons = {
  gluten: ({ size = 24 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="4" y="8" width="16" height="8" rx="2" fill="#F59E0B" />
      <Circle cx="8" cy="12" r="1.5" fill="#FFFFFF" opacity="0.7" />
      <Circle cx="16" cy="12" r="1.5" fill="#FFFFFF" opacity="0.7" />
      <Path d="M6 10 L18 10" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />
      <Path d="M6 14 L18 14" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />
    </Svg>
  ),
  
  lactosa: ({ size = 24 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 4 C6 4 4 6 4 8 L4 18 C4 20 6 20 8 20 L16 20 C18 20 20 20 20 18 L20 8 C20 6 18 4 16 4 Z" fill="#3B82F6" />
      <Ellipse cx="12" cy="10" rx="6" ry="3" fill="#FFFFFF" opacity="0.9" />
      <Circle cx="10" cy="14" r="1" fill="#FFFFFF" opacity="0.6" />
      <Circle cx="14" cy="16" r="0.8" fill="#FFFFFF" opacity="0.6" />
      <Path d="M8 18 Q12 16 16 18" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.4" />
    </Svg>
  ),
  
  mani: ({ size = 24 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Ellipse cx="9" cy="12" rx="4" ry="5" fill="#D97706" />
      <Ellipse cx="15" cy="12" rx="4" ry="5" fill="#F59E0B" />
      <Path d="M9 8 Q12 6 15 8" stroke="#92400E" strokeWidth="0.8" fill="none" />
      <Path d="M9 16 Q12 18 15 16" stroke="#92400E" strokeWidth="0.8" fill="none" />
      <Circle cx="8" cy="10" r="0.8" fill="#FEF3C7" opacity="0.8" />
      <Circle cx="16" cy="10" r="0.8" fill="#FEF3C7" opacity="0.8" />
    </Svg>
  ),
  
  nueces: ({ size = 24 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 4 C8 4 5 7 5 11 C5 15 8 18 12 18 C16 18 19 15 19 11 C19 7 16 4 12 4 Z" fill="#059669" />
      <Path d="M12 6 C10 6 8 8 8 11 C8 14 10 16 12 16 C14 16 16 14 16 11 C16 8 14 6 12 6 Z" fill="#10B981" />
      <Path d="M10 11 L14 11" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
      <Path d="M12 9 L12 13" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
      <Circle cx="11" cy="9" r="0.5" fill="#FFFFFF" opacity="0.4" />
      <Path d="M12 18 L12 20" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  
  soya: ({ size = 24 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="9" cy="12" r="4" fill="#16A34A" />
      <Circle cx="15" cy="12" r="4" fill="#22C55E" />
      <Circle cx="8" cy="10" r="1" fill="#FFFFFF" opacity="0.7" />
      <Circle cx="16" cy="10" r="1" fill="#FFFFFF" opacity="0.7" />
      <Path d="M6 15 Q9 17 12 15 Q15 17 18 15" stroke="#15803D" strokeWidth="1" fill="none" />
      <Circle cx="12" cy="12" r="1.5" fill="#4ADE80" />
    </Svg>
  )
};

const ALLERGY_QUICK: { id: string; name: string; icon: keyof typeof AllergyIcons; gradient: string[] }[] = [
  { id: "gluten", name: "Gluten", icon: "gluten", gradient: ["#FEF3C7", "#F59E0B"] },
  { id: "lactosa", name: "Lactosa", icon: "lactosa", gradient: ["#DBEAFE", "#3B82F6"] },
  { id: "mani", name: "Maní", icon: "mani", gradient: ["#FED7AA", "#D97706"] },
  { id: "nueces", name: "Nueces", icon: "nueces", gradient: ["#D1FAE5", "#059669"] },
  { id: "soya", name: "Soya", icon: "soya", gradient: ["#DCFCE7", "#16A34A"] },
];

interface AllergiesProps {
  onBack?: () => void;
}

export default function Allergies({ onBack }: AllergiesProps) {
  const router = useRouter();
  const { profile, status, error, fetchProfile, saveAllergies, clearError } = useProfileStore();

  const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Cargar perfil al montar
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const allergies = profile?.allergies ?? [];

    // Función mejorada para encontrar íconos
    const findAllergyIcon = (name: string): React.ReactNode => {
      const normalizedName = name.toLowerCase().trim();
      const quickAllergy = ALLERGY_QUICK.find(x => x.name.toLowerCase() === normalizedName);
      
      if (quickAllergy) {
        const IconComponent = AllergyIcons[quickAllergy.icon];
        return <IconComponent size={20} />;
      }
      
      // Ícono por defecto para alergias no reconocidas
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="10" fill="#EF4444" />
          <Path d="M8 8 L16 16 M16 8 L8 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    };

    if (allergies.length) {
      const mapped: Item[] = allergies.map(n => ({
        id: n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
        name: n,
        svg: "", // Ya no usamos string SVG
        icon: findAllergyIcon(n), // Añadimos componente de ícono
      }));
      setItems(mapped);
    } else {
      setItems([]); 
    }
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
      label: "Categoría",
      placeholder: "Selecciona una categoría",
      required: true,
      options: categoryOptions
    },
    {
      name: "productos",
      type: "list",
      label: "Productos",
      placeholder: selectedCategory ? "Selecciona un producto" : "Primero selecciona una categoría",
      required: true,
      options: getProductOptions(selectedCategory),
      disabled: !selectedCategory
    }
  ], [selectedCategory, categoryOptions]);

  const persist = async (nextItems: Item[]) => {
    const prev = items;
    setItems(nextItems);
    try {
      await saveAllergies(nextItems.map(i => i.name));
    } catch {
      setItems(prev);
    }
  };

  // Eliminar
  const handleDelete = async (id: string) => {
    if (loading) return;
    await persist(items.filter(it => it.id !== id));
  };

  // Agregar 
  const addItem = async (name: string, icon?: React.ReactNode) => {
    if (loading) return;
    const cleaned = name.trim();
    if (!cleaned) return;

    const normalized = cleaned.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (items.some(x => x.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized)) {
      setAdding(false);
      setSelectedCategory("");
      return;
    }

    const id = normalized.replace(/\s+/g, "-");
    const defaultIcon = (
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill="#F97316" />
        <Path d="M12 7 L12 13 M12 15 L12 17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
    
    await persist([...items, { id, name: cleaned, svg: "", icon: icon || defaultIcon }]);
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
      await addItem(selectedProduct.name);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onBack ? onBack() : router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Alergias</Text>
          <Text style={styles.subtitle}>Gestiona tus restricciones alimentarias</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Mensaje de error mejorado */}
        {error && (
          <TouchableOpacity style={styles.errorContainer} onPress={clearError}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>⚠️</Text>
            </View>
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Lista de alergias con diseño mejorado */}
        <View style={styles.listContainer}>
          {items.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🥗</Text>
              <Text style={styles.emptyTitle}>Sin alergias registradas</Text>
              <Text style={styles.emptyText}>
                Agrega los alimentos que debes evitar para recibir recomendaciones personalizadas
              </Text>
            </View>
          )}

          {items.map(it => (
            <View key={it.id} style={styles.allergyItem}>
              <View style={styles.allergyIcon}>
                {it.icon}
              </View>
              <View style={styles.allergyContent}>
                <Text style={styles.allergyName}>{it.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(it.id)}
                disabled={loading}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Botón de agregar mejorado */}
        {!adding && (
          <Button
            label="+ Añadir nueva alergia"
            variant="secondary"
            size="medium"
            style={styles.addButton}
            onPress={() => setAdding(true)}
            disabled={loading}
          />
        )}

        {/* Lista rápida mejorada */}
        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>Alergias comunes</Text>
          <View style={styles.quickList}>
            {ALLERGY_QUICK.map(q => {
              const IconComponent = AllergyIcons[q.icon];
              const isAdded = items.some(item => 
                item.name.toLowerCase() === q.name.toLowerCase()
              );
              
              return (
                <TouchableOpacity
                  key={q.id}
                  style={[
                    styles.quickItem,
                    loading && styles.quickItemDisabled,
                    isAdded && styles.quickItemAdded
                  ]}
                  onPress={() => !isAdded && addItem(q.name, <IconComponent size={20} />)}
                  disabled={loading || isAdded}
                >
                  <View style={[styles.quickAvatar, { backgroundColor: q.gradient[0] }]}>
                    <IconComponent size={18} />
                  </View>
                  <Text style={[styles.quickName, isAdded && styles.quickNameAdded]}>
                    {q.name}
                  </Text>
                  {isAdded && (
                    <View style={styles.addedCheck}>
                      <Text style={styles.addedCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Modal mejorado */}
        {adding && (
          <Modal title="Añadir alérgeno" isOpen={adding} type="form">
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
                label="Cancelar"
                variant="outline"
                onPress={() => { setAdding(false); setSelectedCategory(""); }}
              />
            </DynamicForm>
          </Modal>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 4,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  errorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  errorIconText: {
    fontSize: 16,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B91C1C',
    marginBottom: 2,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    lineHeight: 18,
  },
  listContainer: {
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  allergyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  allergyContent: {
    flex: 1,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#DC2626',
    fontWeight: '600',
  },
  addButton: {
    width: '100%',
    marginBottom: spacing.xl,
    borderRadius: 16,
    height: 52,
  },
  quickSection: {
    marginBottom: spacing.xl,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
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
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    minWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  quickItemDisabled: {
    opacity: 0.6,
  },
  quickItemAdded: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  quickAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  quickName: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },
  quickNameAdded: {
    color: '#059669',
  },
  addedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});