import React, { useEffect } from 'react'
import { Redirect } from 'expo-router'
import { useAuthStore } from '../../store/useAuthStore'

interface PrivateRouteProps {
  children: React.ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, verifyToken } = useAuthStore()

  useEffect(() => {
    verifyToken()
  }, [verifyToken])

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />
  }

  return <>{children}</>
}
