import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import type { CardProps } from '../../types';
import CardComponent from './CardComponent';
import Modal from '../common/Modal';
import { cardFormFields, formatCardNumber, formatExpiryDate, validateCardData } from '../../utils/cardValidation';
import Button from '../common/Button';
import PaymentMethods from './PaymentMethods';
import { useRegistration } from '../../hooks/useRegistration';
import type { PaymentData } from '../../types/registration';
import { colors, spacing, typography } from '../../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

type CardInputProps = {
  planSelect: string;
};

function CardInput({ planSelect }: CardInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [CardProps, setCardData] = useState<CardProps>({
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBack, setShowBack] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { setPaymentData, submitRegistration, clearRegistration, state } = useRegistration();
  // Configuración de campos para el formulario dinámico
  const formFields = cardFormFields;

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Navegar a login después del registro exitoso
    router.push('/login');
    // Limpiar después de navegar
    setTimeout(() => {
      clearRegistration();
    }, 100);
  }


  // Manejar cambios en tiempo real para actualizar la vista previa
  const handleFormChange = (name: string, value: string) => {
    let formattedValue = value;

    // Aplicar formateo específico según el campo
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validar los datos antes de enviar
      const validation = validateCardData(CardProps);

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Guardar los datos de pago en el contexto ANTES de submitRegistration
      const paymentData: PaymentData = {
        cardholderName: CardProps.cardholderName,
        cardNumber: CardProps.cardNumber,
        expiryDate: CardProps.expiryDate,
        cvv: CardProps.cvv
      };
      
      console.log('Procesando pago...');

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enviar todos los datos del registro directamente con paymentData
      const success = await submitRegistration(paymentData);
      if (success) {
        console.log('Registro completado exitosamente');
      } else {
        Alert.alert('Error', 'Error al completar el registro. Intenta nuevamente.');
        setIsSubmitting(false);
        return;
      }

      // Limpiar errores
      setErrors({});
      console.log('Datos de la tarjeta procesados:', CardProps);
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error al procesar los datos:', error);
      Alert.alert('Error', 'Error al procesar los datos de la tarjeta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.grid}>
          {/* Columna izquierda: Vista previa de la tarjeta */}
          <View style={styles.cardColumn}>
            <View style={styles.cardContainer}>
              <CardComponent
                cardholderName={CardProps.cardholderName}
                cardNumber={CardProps.cardNumber}
                expiryDate={CardProps.expiryDate}
                cvv={CardProps.cvv}
                showBack={showBack}
              />
              {/* Información de seguridad */}
              <View style={styles.securityInfo}>
                <View style={styles.securityHeader}>
                  <Ionicons name="shield-checkmark" size={20} color="#2563EB" />
                  <Text style={styles.securityTitle}>
                    Transacción Segura
                  </Text>
                </View>
                <Text style={styles.securityText}>
                  Tus datos están protegidos con encriptación SSL de 256 bits
                </Text>
              </View>
            </View>
          </View>
          
          {/* Columna derecha: Formulario */}
          <View style={styles.formColumn}>
            <Text style={styles.formTitle}>
              Datos de la Tarjeta
            </Text>
            
            <View style={styles.formContainer}>
              <View style={styles.form}>
                {formFields.map((field) => (
                  <View key={field.name} style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      {field.label}
                      {field.required && (
                        <Text style={styles.required}> *</Text>
                      )}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors[field.name] ? styles.inputError : styles.inputNormal
                      ]}
                      placeholder={field.placeholder}
                      value={CardProps[field.name as keyof CardProps]}
                      onChangeText={(value) => handleFormChange(field.name, value)}
                      onFocus={() => {
                        if (field.name === 'cvv') {
                          setShowBack(true);
                        }
                      }}
                      onBlur={() => {
                        if (field.name === 'cvv') {
                          setShowBack(false);
                        }
                      }}
                      secureTextEntry={field.name === 'cvv'}
                      maxLength={field.name === 'cardNumber' ? 23 : field.name === 'expiryDate' ? 5 : field.name === 'cvv' ? 3 : undefined}
                    />
                    {errors[field.name] && (
                      <Text style={styles.errorText}>
                        {errors[field.name]}
                      </Text>
                    )}
                  </View>
                ))}
                <Button
                  label={isSubmitting ? 'Procesando...' : 'Procesar Pago'}
                  size='medium'
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                />
              </View>
            </View>

            {/* Métodos de pago aceptados */}
            <PaymentMethods />
          </View>
        </View>
      </View>
      
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          type="info"
          title="Tu cuenta ha sido creada exitosamente"
          onConfirm={() => closeModal()}
          onCancel={() => closeModal()}
        >
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" style={styles.checkIcon} />
            <Text style={styles.modalText}>
              ¡Gracias por unirte al{'\n'}
              <Text style={styles.planText}>{planSelect}</Text>!
            </Text>
            <View style={styles.emailInfo}>
              <Text style={styles.emailText}>
                Ya puedes iniciar sesión con tu email{' '}
              </Text>
              <Text style={styles.emailValue}>
                {state.personalData?.email}
              </Text>
              <Text style={styles.emailText}>
                {' '}y comenzar a explorar todas las funcionalidades de Cooky.
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  cardColumn: {
    flex: 1,
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
  },
  securityInfo: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  securityTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#1E40AF',
    marginLeft: spacing.sm,
  },
  securityText: {
    fontSize: typography.fontSize.xs,
    color: '#1D4ED8',
  },
  formColumn: {
    flex: 1,
  },
  formTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  formContainer: {
    backgroundColor: colors.bg.primary,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  form: {
    gap: spacing.lg,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#374151',
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.feedback.error,
  },
  input: {
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
  },
  inputNormal: {
    borderColor: '#461604',
    opacity: 0.3,
    backgroundColor: colors.bg.primary,
  },
  inputError: {
    borderColor: colors.feedback.error,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.feedback.error,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: spacing.sm,
  },
  checkIcon: {
    marginBottom: spacing.md,
  },
  modalText: {
    textAlign: 'center',
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  planText: {
    fontWeight: typography.fontWeight.bold,
  },
  emailInfo: {
    padding: spacing.md,
    alignItems: 'center',
  },
  emailText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    textAlign: 'center',
  },
  emailValue: {
    fontFamily: 'monospace',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.bg.secondary,
    borderRadius: 4,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
});

export default CardInput;