
// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_AUTH_PATH = process.env.EXPO_PUBLIC_API_AUTH_URL;

if (!API_BASE_URL || !API_AUTH_PATH) {
  throw new Error('API configuration is missing. Please check your environment variables.');
}

const REGISTER_ENDPOINT = `${API_BASE_URL}${API_AUTH_PATH}/signup`;

import { getBasicHeaders } from '../../utils/auth';

// Types
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  
}

export interface User {
  user_id: string;
  email: string;
  name: string;
  dietary_restrictions: string[];
  banned_ingredients: string[];
  subscription_status: 'free' | 'premium' | 'trial';
  trial_end_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
    expires_in?: number;
  };
}

export interface RegisterErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50;
}

function validatePassword(password: string): boolean {
  // Al menos 12 caracteres, una mayúscula, una minúscula, un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{12,}$/;
  return passwordRegex.test(password);
}

function validateRegisterData(data: RegisterRequest): void {
  if (!data.email?.trim()) {
    throw new Error('Email is required');
  }
  
  if (!data.password?.trim()) {
    throw new Error('Password is required');
  }
  
  if (!data.name?.trim()) {
    throw new Error('Name is required');
  }
  
  if (!validateEmail(data.email)) {
    throw new Error('Please enter a valid email address');
  }
  
  if (!validateName(data.name)) {
    throw new Error('Name must be between 2 and 50 characters');
  }
  
  if (!validatePassword(data.password)) {
    throw new Error('Password must be at least 12 characters with uppercase, lowercase and number');
  }
  
  // Validar confirmación de contraseña si está presente
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }
}

export async function postRegister(credentials: RegisterRequest): Promise<RegisterResponse> {
  try {
    // Validate input data
    validateRegisterData(credentials);
    
    console.log('Attempting registration for user:', credentials.email);
    
    const response = await fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      headers: getBasicHeaders(),
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name
      })
    });
    
    const responseData = await response.json().catch(() => {
      throw new Error('Invalid response format from server');
    });
    
    console.log('Registration response status:', response.status);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = responseData?.message || getRegisterErrorMessage(response.status);
      throw new Error(errorMessage);
    }
    
    // Handle API errors
    if (!responseData.success) {
      throw new Error(responseData.message || 'Registration failed');
    }
    
    // Validate response structure
    if (!responseData.data?.user || !responseData.data?.token) {
      throw new Error('Invalid response structure from server');
    }
    
    // Transform and return successful response
    const registerResponse: RegisterResponse = {
      success: true,
      data: {
        user: responseData.data.user,
        token: responseData.data.token,
        expires_in: responseData.data.expires_in
      }
    };
    
    console.log('Registration successful for user:', responseData.data.user.email);
    
    return registerResponse;
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Return structured error response
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred during registration'
    };
  }
}


// HELPER FUNCTION
// Helper function for HTTP status error messages specific to registration
function getRegisterErrorMessage(status: number): string {
  const errorMessages: Record<number, string> = {
    400: 'Invalid registration data format',
    409: 'Email address is already registered',
    422: 'Please check your registration information',
    429: 'Too many registration attempts. Please try again later',
    500: 'Server error. Please try again later',
    502: 'Registration service temporarily unavailable',
    503: 'Registration service temporarily unavailable'
  };
  
  return errorMessages[status] || `Registration failed with status ${status}`;
}

// Utility function to check password strength
export function getPasswordStrength(password: string): { score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 12) score += 1;
  else feedback.push('At least 12 characters');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('At least one lowercase letter');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('At least one uppercase letter');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('At least one number');
  
  if (/[@$!%*?&]/.test(password)) score += 1;
  
  return { score, feedback };
}
