"use client"

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function AdminBar() {
  const { isAdmin, logout } = useAuth()

  if (!isAdmin) return null

  return (
    <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 text-white z-40 px-4 py-3 text-sm shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <i className="fas fa-shield-alt"></i>
          <span className="font-medium">Mode Admin Aktif</span>
          <span className="text-red-200">|</span>
          <span>Anda dapat mengedit konten halaman</span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={logout}
            className="hover:text-red-200 transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-1"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}