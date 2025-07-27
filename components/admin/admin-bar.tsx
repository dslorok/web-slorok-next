"use client"

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function AdminBar() {
  const { isAdmin, logout } = useAuth()

  if (!isAdmin) return null

  return (
    <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600
                text-white z-40 px-4 py-3 sm:px-6 sm:py-4 text-sm shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center
                  gap-y-2 sm:gap-y-0">
        {/* Kiri */}
        <div className="flex items-center space-x-4">
          <i className="fas fa-shield-alt"></i>
          <span className="font-medium">Mode Admin Aktif</span>
          <span className="text-red-200">|</span>
          <span>Anda dapat mengedit konten halaman</span>
        </div>

        {/* Kanan */}
        <div className="flex items-center space-x-4">
          {/* Pemisah putih */}
          <span className="h-5 w-px bg-white/70"></span>

          {/* Tombol logout – inline‑flex + whitespace‑nowrap supaya tidak wrap */}
          <button
            onClick={logout}
            className="inline-flex items-center space-x-1 hover:text-red-200 transition-colors whitespace-nowrap"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}