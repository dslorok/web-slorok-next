"use client"

import { useState, useEffect } from "react"
import { RegulationItem, RegulationFormData } from "@/lib/regulation-firebase"
import { uploadRegulationPDF, validatePDFFile } from "@/lib/regulation-pdf-upload"

interface RegulationEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: RegulationFormData) => Promise<void>
  regulationItem?: RegulationItem | null
  title: string
}

export default function RegulationEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  regulationItem, 
  title 
}: RegulationEditModalProps) {
  const [formData, setFormData] = useState<RegulationFormData>({
    title: '',
    year: new Date().getFullYear(),
    type: 'peraturan-desa',
    pdfUrl: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  useEffect(() => {
    if (regulationItem) {
      setFormData({
        title: regulationItem.title,
        year: regulationItem.year,
        type: regulationItem.type,
        pdfUrl: regulationItem.pdfUrl,
        description: regulationItem.description || '',
      })
    } else {
      // Reset form for new item
      setFormData({
        title: '',
        year: new Date().getFullYear(),
        type: 'peraturan-desa',
        pdfUrl: '',
        description: '',
      })
    }
    setPdfFile(null)
  }, [regulationItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setUploadProgress('')
    
    try {
      let finalFormData = { ...formData }
      
      // Upload PDF if a new file was selected
      if (pdfFile) {
        setUploadProgress('Mengupload PDF ke Supabase...')
        const pdfUrl = await uploadRegulationPDF(pdfFile, regulationItem?.id)
        finalFormData.pdfUrl = pdfUrl
        setUploadProgress('PDF berhasil diupload!')
      }
      
      setUploadProgress('Menyimpan data ke Firebase...')
      await onSave(finalFormData)
      setUploadProgress('Data berhasil disimpan!')
      onClose()
    } catch (error) {
      console.error('Error saving regulation:', error)
      setUploadProgress('Terjadi kesalahan saat menyimpan')
      
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('Terjadi kesalahan saat menyimpan peraturan')
      }
    } finally {
      setIsLoading(false)
      setTimeout(() => setUploadProgress(''), 3000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }))
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate the file
      const validation = validatePDFFile(file)
      if (!validation.isValid) {
        alert(validation.error)
        e.target.value = '' // Reset the input
        return
      }
      
      setPdfFile(file)
      setUploadProgress('')
    }
  }

  // Generate year options
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Judul Peraturan
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Masukkan judul peraturan..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tahun
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Peraturan
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="peraturan-desa">Peraturan Desa</option>
                  <option value="peraturan-kepala-desa">Peraturan Kepala Desa</option>
                  <option value="surat-keputusan">Surat Keputusan Kepala Desa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi (Opsional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Masukkan deskripsi peraturan..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File PDF
              </label>
              
              {/* Current PDF Preview */}
              {formData.pdfUrl && !pdfFile && (
                <div className="mb-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">File PDF saat ini:</p>
                    <a 
                      href={formData.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      <i className="fas fa-file-pdf mr-2"></i>
                      Lihat PDF
                    </a>
                  </div>
                </div>
              )}
              
              {/* Upload Progress */}
              {uploadProgress && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900 rounded-md">
                  <p className="text-sm text-blue-700 dark:text-blue-300">{uploadProgress}</p>
                </div>
              )}
              
              {/* PDF Upload */}
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500">
                  Pilih file PDF untuk upload ke Supabase (max 2MB). {pdfFile && `File terpilih: ${pdfFile.name}`}
                </p>
                
                {/* URL Input as fallback */}
                <div className="border-t pt-2">
                  <label className="block text-xs text-gray-500 mb-1">Atau masukkan URL PDF langsung:</label>
                  <input
                    type="url"
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
