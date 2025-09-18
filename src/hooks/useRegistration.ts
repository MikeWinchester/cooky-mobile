import { useContext } from 'react';
import { RegistrationContext } from '../contexts/RegistrationContext';
import type { RegistrationContextType } from '../types/registration';

export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration debe ser usado dentro de RegistrationProvider');
  }
  return context;
};
