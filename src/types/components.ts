// Component Props
export interface FeatureSectionProps {
  title: string;
  description: string;
  icon: string | React.ReactNode;
}

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
}

export interface GraphicsProps {
  variant?: 'right' | 'left';
  className?: string;
  title?: string;
  subtitle?: string;
}

// Dynamic Form Types
export interface FormFieldConfig {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'list';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  className?: string;
}

export interface DynamicFormProps {
  fields: FormFieldConfig[];
  onSubmit: (formData: Record<string, string | number | boolean>) => void | Promise<void>;
  submitButtonText?: string;
  submitButtonVariant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  className?: string;
  style?: any;
  resetOnSubmit?: boolean;
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  onFieldChange?: (fieldName: string, value: string) => void;
  initialValues?: Record<string, string | number>;
}

export interface PlanCardProps {
  plan: {
    planTitle: string;
    planSubtitle: string;
    planPrice: string;
    planDuration: string;
    planFeatures: string[];
  };
  onPlanSelect?: (plan: PlanCardProps['plan']) => void;
}

export interface ItemType {
  id: string;
  name: string;
  quantity?: string;
  svg: string;
  isSelected?: boolean;
}

export interface ItemListType {
  item: ItemType;
  onToggle?: () => void;
  onDelete?: (id: string) => void;
}

export interface ListCardProps {
  id: string;
  nameList: string; // Se mantiene para compatibilidad con componentes existentes
  description?: string;
  date: string;     // Se mantiene para compatibilidad con componentes existentes  
  itemsList: ItemType[]; // Cambiar de ItemListType[] a ItemType[] para simplicidad
  onDelete?: () => void;
  onClick?: () => void;
}

//Modal
export interface ModalProps {
    isOpen: boolean;
    type?: 'signout' | 'form' | 'info' | 'delete';
    title: string;
    children: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
}

//CategoryCard
export interface CategoryCardProps {
    id: string;
    name: string;
    icon: string;
    onClick?: (categoryId: string) => void;
    className?: string;
}

//Card
export interface CardProps {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface CardInfo {
  type: CardType;
  isValid: boolean;
  errors: {
    number?: string;
    expiry?: string;
    name?: string;
    cvv?: string;
  };
}
