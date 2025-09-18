
// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_AUTH_PATH = process.env.EXPO_PUBLIC_API_AUTH_URL;

if (!API_BASE_URL || !API_AUTH_PATH) {
  throw new Error('API configuration is missing. Please check your environment variables.');
}

const LOGIN_ENDPOINT = `${API_BASE_URL}${API_AUTH_PATH}/login`;

import { getBasicHeaders } from '../../utils/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  user_id: string;
  email: string;
  name: string;
  dietary_restrictions: string[];
  banned_ingredients: string[];
  favorite_ingredients: string[];
  allergies: string[];
  subscription_status: 'free' | 'premium' | 'trial';
  trial_end_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
    expires_in?: number;
    premium: boolean;
  };
}

export interface LoginErrorResponse {
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

function validateLoginData(data: LoginRequest): void {
  if (!data.email?.trim()) {
    throw new Error('Email is required');
  }
  
  if (!data.password?.trim()) {
    throw new Error('Password is required');
  }
  
  if (!validateEmail(data.email)) {
    throw new Error('Please enter a valid email address');
  }
  
  if (data.password.length < 12) {
    throw new Error('Password must be at least 12 characters long');
  }
}

export async function postLogin(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    // Validate input data
    validateLoginData(credentials);    
    console.log('Attempting login for user:', credentials.email);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('LOGIN_ENDPOINT:', LOGIN_ENDPOINT);
    
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: getBasicHeaders(),
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });
    
    const responseData = await response.json().catch(() => {
      throw new Error('Invalid response format from server');
    });
    console.log('Login response status:', response.status);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = responseData?.message || getErrorMessage(response.status);
      throw new Error(errorMessage);
    }
    
    // Handle API errors
    if (!responseData.success) {
      throw new Error(responseData.message || 'Login failed');
    }
    
    // Validate response structure
    if (!responseData.data?.user || !responseData.data?.token) {
      throw new Error('Invalid response structure from server');
    }
    
    // Transform and return successful response
    // Handle missing fields from API response
    const userData = responseData.data.user;
    const transformedUser: User = {
      ...userData,
      // Ensure favorite_ingredients exists even if not provided by API
      favorite_ingredients: userData.favorite_ingredients || [],
      // Ensure banned_ingredients exists even if not provided by API
      banned_ingredients: userData.banned_ingredients || [],
      // Ensure allergies exists even if not provided by API
      allergies: userData.allergies || []
    };
    
    const loginResponse: LoginResponse = {
      success: true,
      data: {
        user: transformedUser,
        token: responseData.data.token,
        expires_in: responseData.data.expires_in,
        premium: transformedUser.subscription_status !== 'free'
      }
    };
    
    console.log('Login successful for user:', responseData.data.user.email);
    
    return loginResponse;
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Return structured error response
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred during login'
    };
  }
}


// HELPER FUNCTION
// Helper function for HTTP status error messages
function getErrorMessage(status: number): string {
  const errorMessages: Record<number, string> = {
    400: 'Invalid email or password format',
    401: 'Invalid email or password',
    403: 'Account is temporarily locked',
    404: 'Login service not available',
    422: 'Please check your email and password',
    429: 'Too many login attempts. Please try again later',
    500: 'Server error. Please try again later',
    502: 'Service temporarily unavailable',
    503: 'Service temporarily unavailable'
  };
  
  return errorMessages[status] || `Login failed with status ${status}`;
}

// Utility function to check if user has premium access
export function isPremiumUser(user: User): boolean {
  if (user.subscription_status === 'premium') {
    return true;
  }
  
  if (user.subscription_status === 'trial' && user.trial_end_date) {
    const trialEnd = new Date(user.trial_end_date);
    return trialEnd > new Date();
  }
  
  return false;
}
