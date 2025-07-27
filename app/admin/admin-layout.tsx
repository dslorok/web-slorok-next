'use client'

import { usePathname } from 'next/navigation'
import AdminLayout from '../../components/admin/layout'

export default function AdminWrapperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return <AdminLayout>{children}</AdminLayout>
}
