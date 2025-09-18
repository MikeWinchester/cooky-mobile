// Store de autenticación con Zustand para React Native
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { postLogin } from '../services/auth/login'
import type { User } from '../services/auth/login';

interface AuthState {
  success: boolean
  message?: string
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (user: User, token: string) => void
  loginAsync: (email: string, password: string) => Promise<void>
  logout: () => void
  verifyToken: () => void
  clearError: () => void
}

function decodeJWT(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      success: false,
      message: '',
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true, error: null })
        get().verifyToken()
      },

      loginAsync: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await postLogin({ email, password })
          
          // La nueva API ya maneja errores y devuelve success: false en lugar de lanzar excepciones
          if (!response.success) {
            set({
              isLoading: false,
              error: response.message || 'Error en el login',
              isAuthenticated: false
            })
            return
          }
          
          // Login exitoso
          if (response.data) {
            set({
              success: response.success,
              message: response.message,
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            get().verifyToken()
          } else {
            set({
              isLoading: false,
              error: 'Invalid response from server',
              isAuthenticated: false
            })
          }
        } catch (error) {
          // Este catch ahora solo maneja errores de red o parsing
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Network error occurred',
            isAuthenticated: false
          })
        }
      },

      logout: () => {
        // Limpiar ingredientes al cerrar sesión
        import('../store/useRecipesStore').then(({ useRecipesStore }) => {
          useRecipesStore.getState().clearIngredients();
        });
        
        set({
          success: false,
          message: '',
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => set({ error: null }),

      verifyToken: () => {
        const { token, logout } = get()
        if (!token) return logout()

        const payload = decodeJWT(token)
        if (!payload?.exp) return logout()

        const isExpired = Date.now() >= payload.exp * 1000
        if (isExpired) logout()
        else set({ isAuthenticated: true })
      }
    }),
    {
      name: 'auth-storage', // clave en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
