"use client"

import { useAuth } from '@/lib/auth-context'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const { isAdmin } = useAuth()

  return (
    <div className={isAdmin ? 'pt-10' : ''}>
      {children}
    </div>
  )
}
