// Tipos para el flujo de registro

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PlanData {
  planTitle: string;
  planSubtitle: string;
  planPrice: string;
  planDuration: string;
  planFeatures: string[];
}

export interface PaymentData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface RegistrationState {
  personalData: PersonalData | null;
  selectedPlan: PlanData | null;
  paymentData: PaymentData | null;
  currentStep: number;
  isLoading: boolean;
}

export interface RegistrationContextType {
  // Estado
  state: RegistrationState;
  
  // Acciones para actualizar datos
  setPersonalData: (data: PersonalData) => void;
  setSelectedPlan: (plan: PlanData) => void;
  setPaymentData: (data: PaymentData) => void;
  
  // Función específica para seleccionar plan y navegar
  selectPlanAndNavigate: (plan: PlanData) => 'free' | 'paid';
  
  // Navegación de steps
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Acciones del flujo
  submitRegistration: (providedPaymentData?: PaymentData) => Promise<boolean>;
  clearRegistration: () => void;
  
  // Utilidades
  isStepComplete: (step: number) => boolean;
  isPlanFree: () => boolean;
  needsPayment: () => boolean;
}

export const REGISTRATION_STEPS = {
  PERSONAL_DATA: 1,
  PLAN_SELECTION: 2,
  PAYMENT: 3,
  CONFIRMATION: 4,
} as const;
