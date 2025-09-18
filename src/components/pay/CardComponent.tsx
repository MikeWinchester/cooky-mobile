import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { paymentMethods } from '../../data/PaymentMethods';
import type { CardProps, CardInfo, CardType } from '../../types';
import { colors, spacing, typography } from '../../styles/globalStyles';

const detectCardType = (number: string): CardType => {
  // Remove spaces and non-numeric characters for detection
  const cleanNumber = number.replace(/\D/g, '');

  if (cleanNumber.startsWith('4')) return 'visa';
  if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
  if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) return 'amex';
  if (cleanNumber.startsWith('6011') || cleanNumber.startsWith('65') || cleanNumber.startsWith('644') || cleanNumber.startsWith('645')) return 'discover';

  return 'unknown';
};

const validateCardInfo = (cardNumber: string, expiryDate: string, cardholderName: string, cvv: string): CardInfo => {
  const errors: CardInfo['errors'] = {};
  let isValid = true;
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // Validate number
  if (!cleanNumber) {
    errors.number = 'Número de tarjeta es requerido.';
    isValid = false;
  } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    errors.number = 'Número de tarjeta debe tener entre 13-19 digitos.';
    isValid = false;
  } else if (!luhnCheck(cleanNumber)) {
    errors.number = 'Número de tarjeta invalido.';
    isValid = false;
  }

  // Validate expiry
  if (!expiryDate) {
    errors.expiry = 'Fecha de expiración es requerida.';
    isValid = false;
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    errors.expiry = 'Formato invalido (MM/YY)';
    isValid = false;
  } else {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      errors.expiry = 'Tarjeta expirada.';
      isValid = false;
    }
  }

  // Validate name
  if (!cardholderName.trim()) {
    errors.name = 'Nombre del propietario es requerido.';
    isValid = false;
  } else if (cardholderName.trim().length < 2) {
    errors.name = 'Nombre debe tener al menos 2 caracteres.';
    isValid = false;
  }

  // Validate CVV
  if (!cvv.trim()) {
    errors.cvv = 'Card Verification Value (CVV) es requerido.';
    isValid = false;
  } else if (cvv.trim().length < 3) {
    errors.cvv = 'Card Verification Value (CVV) debe tener al menos 3 caracteres.';
    isValid = false;
  }

  const type = detectCardType(cardNumber);

  return { type, isValid, errors };
};

// Luhn algorithm for card number validation
const luhnCheck = (number: string): boolean => {
  let sum = 0;
  let alternate = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  return sum % 10 === 0;
};

interface CardComponentProps extends CardProps {
  showBack?: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({ cardholderName, cardNumber, expiryDate, cvv, showBack = false }) => {
  const { type, isValid, errors } = validateCardInfo(cardNumber, expiryDate, cardholderName, cvv);
  const hasErrors = Object.keys(errors).length > 0;

  // Format card number for display
  const formatCardNumber = (num: string): string => {
    const clean = num.replace(/\D/g, '');
    if (type === 'amex') {
      return clean.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const renderCardIcon = () => {
    const matchedPayment = paymentMethods.find(pay => pay.name === type.toUpperCase());
    if (matchedPayment) {
      return (
        <Text style={styles.cardIcon}>{matchedPayment.icon}</Text>
      );
    } else {
      return (
        <Text style={styles.cardTypeText}>CARD</Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {!showBack ? (
          // FRENTE DE LA TARJETA
          <View style={[styles.card, styles.cardFront, !isValid && styles.cardError]}>
            {/* Diseño de curvas decorativas */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />

            {/* Card Type Icon */}
            <View style={styles.cardTypeContainer}>
              {renderCardIcon()}
            </View>

            {/* Número de tarjeta */}
            <Text style={styles.cardNumber}>
              {cardNumber ? formatCardNumber(cardNumber) : '•••• •••• •••• ••••'}
            </Text>

            {/* Nombre y fecha */}
            <View style={styles.cardInfo}>
              <View style={styles.cardholderContainer}>
                <Text style={styles.label}>CARDHOLDER NAME</Text>
                <Text style={styles.cardholderName} numberOfLines={1}>
                  {cardholderName || 'YOUR NAME'}
                </Text>
              </View>
              <View style={styles.expiryContainer}>
                <Text style={styles.label}>VALID THRU</Text>
                <Text style={styles.expiryDate}>
                  {expiryDate || 'MM/YY'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          // REVERSO DE LA TARJETA
          <View style={[styles.card, styles.cardBack]}>
            {/* Diseño de curvas decorativas para el reverso */}
            <View style={styles.decorativeCircle4} />
            <View style={styles.decorativeCircle5} />

            {/* Banda magnética */}
            <View style={styles.magneticStripe} />

            {/* Área del CVV */}
            <View style={styles.cvvContainer}>
              <View style={styles.cvvBox}>
                <Text style={styles.cvvText}>
                  {cvv || '•••'}
                </Text>
              </View>

              {/* Texto informativo */}
              <Text style={styles.securityText}>
                For your security, this code is used to verify card-not-present transactions.
              </Text>

              {/* Logo del banco/tipo de tarjeta */}
              <View style={styles.backCardType}>
                {renderCardIcon()}
              </View>
            </View>
          </View>
        )}
      </View>

      {hasErrors && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Por favor corrige los siguientes errores:</Text>
          <View style={styles.errorList}>
            {errors.number && <Text style={styles.errorItem}>• {errors.number}</Text>}
            {errors.name && <Text style={styles.errorItem}>• {errors.name}</Text>}
            {errors.expiry && <Text style={styles.errorItem}>• {errors.expiry}</Text>}
            {errors.cvv && <Text style={styles.errorItem}>• {errors.cvv}</Text>}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  cardContainer: {
    width: 320,
    height: 200,
    marginBottom: spacing.md,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    padding: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: '#FF8C00',
  },
  cardBack: {
    backgroundColor: '#FF8C00',
  },
  cardError: {
    borderWidth: 2,
    borderColor: colors.feedback.error,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFA500',
    opacity: 0.2,
  },
  decorativeCircle2: {
    position: 'absolute',
    top: -80,
    right: 0,
    width: 208,
    height: 208,
    borderRadius: 104,
    backgroundColor: '#FFB84D',
    opacity: 0.1,
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FF7F00',
    opacity: 0.2,
  },
  decorativeCircle4: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFA500',
    opacity: 0.2,
  },
  decorativeCircle5: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 208,
    height: 208,
    borderRadius: 104,
    backgroundColor: '#FFB84D',
    opacity: 0.1,
  },
  cardTypeContainer: {
    alignItems: 'flex-end',
    zIndex: 10,
  },
  cardIcon: {
    fontSize: 24,
    opacity: 0.9,
  },
  cardTypeText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  },
  cardNumber: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xl,
    letterSpacing: 4,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    zIndex: 10,
    fontFamily: 'monospace',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    zIndex: 10,
  },
  cardholderContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  expiryContainer: {
    alignItems: 'flex-end',
  },
  label: {
    color: colors.text.secondary,
    opacity: 0.8,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  cardholderName: {
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
    textTransform: 'uppercase',
  },
  expiryDate: {
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
    fontFamily: 'monospace',
  },
  magneticStripe: {
    width: '100%',
    height: 48,
    backgroundColor: '#1F2937',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  cvvContainer: {
    paddingHorizontal: spacing.lg,
  },
  cvvBox: {
    backgroundColor: '#FFFFFF',
    height: 32,
    borderRadius: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  cvvText: {
    color: '#1F2937',
    fontFamily: 'monospace',
    fontSize: typography.fontSize.sm,
    letterSpacing: 2,
  },
  securityText: {
    color: colors.text.secondary,
    opacity: 0.8,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.xs,
  },
  backCardType: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
  },
  errorContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    width: '100%',
  },
  errorTitle: {
    color: colors.feedback.error,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.sm,
  },
  errorList: {
    gap: spacing.xs,
  },
  errorItem: {
    color: colors.feedback.error,
    fontSize: typography.fontSize.xs,
  },
});

export default CardComponent;
