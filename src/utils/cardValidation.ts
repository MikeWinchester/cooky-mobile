import type { FormFieldConfig } from '../types';

/**
 * Configuración de campos para formulario de tarjeta de crédito
 */
export const cardFormFields: FormFieldConfig[] = [
  {
    name: 'cardholderName',
    label: 'Nombre del propietario',
    type: 'text',
    placeholder: 'Ingresa el nombre como aparece en la tarjeta',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
      pattern: '^[a-zA-ZÀ-ÿ\\s]+$'
    }
  },
  {
    name: 'cardNumber',
    label: 'Número de tarjeta',
    type: 'text',
    placeholder: '1234 5678 9012 3456',
    required: true,
    validation: {
      pattern: '^[0-9\\s]{13,23}$',
      minLength: 13,
      maxLength: 23
    }
  },
  {
    name: 'expiryDate',
    label: 'Fecha de expiración',
    type: 'text',
    placeholder: 'MM/YY',
    required: true,
    validation: {
      pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
      minLength: 5,
      maxLength: 5
    }
  },
  {
    name: 'cvv',
    label: 'CVV',
    type: 'text',
    placeholder: '123',
    required: true,
    validation: {
      pattern: '^[0-9]{3,4}$',
      minLength: 3,
      maxLength: 3
    }
  }
];

/**
 * Formatea el número de tarjeta agregando espacios cada 4 dígitos
 * @param value - Número de tarjeta sin formato
 * @returns Número de tarjeta formateado
 */
export const formatCardNumber = (value: string): string => {
  // Remover todo excepto números
  const cleaned = value.replace(/\D/g, '');
  // Agregar espacios cada 4 dígitos
  const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
  return formatted;
};

/**
 * Formatea la fecha de expiración en formato MM/YY
 * @param value - Fecha sin formato
 * @returns Fecha formateada MM/YY
 */
export const formatExpiryDate = (value: string): string => {
  // Remover todo excepto números
  const cleaned = value.replace(/\D/g, '');
  // Agregar barra después de 2 dígitos
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
  }
  return cleaned;
};

/**
 * Valida si un número de tarjeta tiene el formato correcto
 * @param cardNumber - Número de tarjeta a validar
 * @returns true si el formato es válido
 */
export const isValidCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

/**
 * Valida si una fecha de expiración es válida y no está vencida
 * @param expiryDate - Fecha en formato MM/YY
 * @returns true si la fecha es válida y no está vencida
 */
export const isValidExpiryDate = (expiryDate: string): boolean => {
  const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!pattern.test(expiryDate)) return false;

  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Obtener últimos 2 dígitos
  const currentMonth = currentDate.getMonth() + 1;

  const cardYear = parseInt(year, 10);
  const cardMonth = parseInt(month, 10);

  // Verificar que no esté vencida
  if (cardYear < currentYear) return false;
  if (cardYear === currentYear && cardMonth < currentMonth) return false;

  return true;
};

/**
 * Valida si un CVV tiene el formato correcto
 * @param cvv - Código CVV
 * @returns true si el CVV es válido
 */
export const isValidCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Valida si el nombre del titular es válido
 * @param name - Nombre del titular
 * @returns true si el nombre es válido
 */
export const isValidCardholderName = (name: string): boolean => {
  return /^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(name.trim());
};

/**
 * Detecta el tipo de tarjeta basado en el número
 * @param cardNumber - Número de tarjeta
 * @returns Tipo de tarjeta detectado
 */
export const detectCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6/.test(cleaned)) return 'discover';
  
  return 'unknown';
};

/**
 * Valida todos los campos de la tarjeta
 * @param cardData - Datos de la tarjeta
 * @returns Objeto con errores de validación
 */
export const validateCardData = (cardData: {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}) => {
  const errors: Record<string, string> = {};

  if (!isValidCardholderName(cardData.cardholderName)) {
    errors.cardholderName = 'Nombre inválido. Solo se permiten letras y espacios (2-50 caracteres)';
  }

  if (!isValidCardNumber(cardData.cardNumber)) {
    errors.cardNumber = 'Número de tarjeta inválido';
  }

  if (!isValidExpiryDate(cardData.expiryDate)) {
    errors.expiryDate = 'Fecha de expiración inválida o vencida';
  }

  if (!isValidCVV(cardData.cvv)) {
    errors.cvv = 'CVV inválido. Debe tener 3 o 4 dígitos';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
