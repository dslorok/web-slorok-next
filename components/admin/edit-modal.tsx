"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSave: () => void
  loading?: boolean
}

export default function EditModal({ isOpen, onClose, title, children, onSave, loading = false }: EditModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            <i className="fas fa-edit mr-2 text-blue-600"></i>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
