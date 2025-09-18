import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Graphics from "../../components/common/Graphics";
import Button from "../../components/common/Button";
import { useProfileStore } from "../../store/useProfileStore";
import ProfileAvatar from "../../components/ui/ProfileAvatar";
import { colors, spacing, typography } from "../../styles/globalStyles";

const { width: screenWidth } = Dimensions.get('window');

interface ProfileFormProps {
  onBack?: () => void;
}

export default function ProfileReadEdit({ onBack }: ProfileFormProps) {
  const { profile, status, error, fetchProfile, saveProfile, clearError } = useProfileStore();
  const [editMode, setEditMode] = useState<boolean>(false);
  const router = useRouter();

  // avatar (preview local)
  const [avatar, setAvatar] = useState<string>("https://randomuser.me/api/portraits/men/75.jpg");

  useEffect(() => { 
    fetchProfile(); 
  }, []);

  // Relleno inicial desde profile
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!profile) return;
    const parts = (profile.name || "").trim().split(" ").filter(Boolean);
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setEmail(profile.email || "");
    // Si el backend trae avatar, úsalo como base; si no, placeholder
    if ((profile as any).avatar) setAvatar((profile as any).avatar);
  }, [profile]);

  const loading = status === "loading";

  const dirty = useMemo(() => {
    if (!profile) return false;
    const full = (profile.name || "").trim().replace(/\s+/g, " ");
    const local = `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");
    return full !== local;
  }, [firstName, lastName, profile]);

  const onSave = async () => {
    const name = `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");
    if (!name) return;
    // TODO: si deseas subir avatar al backend, aquí adjunta el File y guarda
    await saveProfile({ name /*, avatar: file */ });
    setEditMode(false);
  };

  const onCancel = () => {
    const parts = (profile?.name || "").trim().split(" ").filter(Boolean);
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    clearError();
    setEditMode(false);
    setAvatar((profile as any)?.avatar || "https://randomuser.me/api/portraits/men/75.jpg");
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const onAvatarBtnClick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
        // Si estamos en modo visualización, activar modo edición después de cambiar la foto
        if (!editMode) {
          setEditMode(true);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#FF8A65', '#FF7043', '#FF5722']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decoraciones flotantes */}
          <View style={[styles.floatingShape, styles.shape1]} />
          <View style={[styles.floatingShape, styles.shape2]} />
          
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={20} color="#1E293B" />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Datos Personales</Text>
              <Text style={styles.headerSubtitle}>Actualiza tu información básica</Text>
            </View>
          </View>
          
          {/* Onda inferior */}
          <View style={styles.waveContainer}>
            <View style={styles.wave} />
          </View>
        </LinearGradient>
      </View>

      <View 
        style={styles.scrollContainer}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <ProfileAvatar
                src={avatar}
                showBadge={false} 
                showInfo={false}
                name=""
                size="lg"
              />
            </View>
            
            {/* Badge de editar foto */}
            <TouchableOpacity
              style={styles.editPhotoBadge}
              onPress={onAvatarBtnClick}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Error Message */}
          {error && (
            <TouchableOpacity
              style={styles.errorContainer}
              onPress={clearError}
              activeOpacity={0.8}
            >
              <View style={styles.errorIcon}>
                <Ionicons name="warning" size={16} color="#DC2626" />
              </View>
              <Text style={styles.errorText}>{error}</Text>
              <Ionicons name="close" size={16} color="#DC2626" />
            </TouchableOpacity>
          )}

          {/* Form Fields */}
          <View style={styles.formFields}>
            <View style={styles.fieldRow}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Nombres <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons 
                    name="person-outline" 
                    size={18} 
                    color={editMode ? "#64748B" : "#CBD5E1"} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      editMode ? styles.textInputEnabled : styles.textInputDisabled
                    ]}
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={editMode && !loading}
                    placeholder="Tu nombre"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Apellidos <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons 
                    name="people-outline" 
                    size={18} 
                    color={editMode ? "#64748B" : "#CBD5E1"} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      editMode ? styles.textInputEnabled : styles.textInputDisabled
                    ]}
                    value={lastName}
                    onChangeText={setLastName}
                    editable={editMode && !loading}
                    placeholder="Tus apellidos"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Correo electrónico
                <View style={styles.lockedBadge}>
                  <Ionicons name="lock-closed" size={12} color="#6B7280" />
                  <Text style={styles.lockedText}>Bloqueado</Text>
                </View>
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="mail-outline" 
                  size={18} 
                  color="#CBD5E1" 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.textInputDisabled]}
                  value={email}
                  editable={false}
                  placeholder="tu@email.com"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {!editMode ? (
              <View style={styles.viewModeContainer}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setEditMode(true)} 
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Editar Información</Text>
                </TouchableOpacity>
                
              </View>
            ) : (
              <View style={styles.editActionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    (!dirty || loading) && styles.saveButtonDisabled
                  ]}
                  onPress={onSave} 
                  disabled={!dirty || loading}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={loading ? "hourglass-outline" : "checkmark-circle-outline"} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.saveButtonText}>
                    {loading ? "Guardando..." : "Guardar"}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={onCancel} 
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close-circle-outline" size={18} color="#64748B" />
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },

  // Header con gradiente
  headerContainer: {
    height: 160,
    position: 'relative',
  },
  headerGradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingShape: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  shape1: {
    width: 100,
    height: 100,
    top: -20,
    right: -30,
  },
  shape2: {
    width: 60,
    height: 60,
    top: 60,
    left: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: '#FAFBFC',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  // Scroll container
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },

  // Avatar section
  avatarSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: spacing.md,
    zIndex: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF8A65',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },


  // Form card
  formCard: {
    backgroundColor: 'transparent',
    marginHorizontal: spacing.lg,
    padding: 0,
    marginTop: spacing.md,
  },

  // Error container
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },

  // Form fields
  formFields: {
    gap: spacing.sm,
  },
  fieldRow: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  fieldContainer: {
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  required: {
    color: '#EF4444',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    gap: 4,
  },
  lockedText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  textInputEnabled: {
    borderColor: '#FF8A65',
  },
  textInputDisabled: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    color: '#6B7280',
  },

  // Actions
  actionsContainer: {
    marginTop: spacing.xl,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8A65',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    shadowColor: '#FF8A65',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editActionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7043',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowColor: '#CBD5E1',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  bottomSpacing: {
    height: spacing.xl,
  },
  
  // View mode container
  viewModeContainer: {
    gap: spacing.md,
  },
});