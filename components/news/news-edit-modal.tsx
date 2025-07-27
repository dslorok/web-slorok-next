"use client"

import { useState, useEffect } from "react"
import { NewsItem, NewsFormData } from "@/lib/news-firebase"
import { uploadNewsImage, validateImageFile } from "@/lib/news-image-upload"

interface NewsEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: NewsFormData) => Promise<void>
  newsItem?: NewsItem | null
  title: string
}

export default function NewsEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  newsItem, 
  title 
}: NewsEditModalProps) {
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: '',
    author: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<string>('')

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        image: newsItem.image,
        date: newsItem.date,
        author: newsItem.author,
      })
      setImagePreview(newsItem.image)
    } else {
      // Reset form for new item
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        date: today,
        author: '',
      })
      setImagePreview('')
    }
    setImageFile(null)
  }, [newsItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setUploadProgress('')
    
    try {
      let finalFormData = { ...formData }
      
      // Upload image if a new file was selected
      if (imageFile) {
        setUploadProgress('Mengupload gambar ke Supabase...')
        const imageUrl = await uploadNewsImage(imageFile, newsItem?.id)
        finalFormData.image = imageUrl
        setUploadProgress('Gambar berhasil diupload!')
      }
      
      setUploadProgress('Menyimpan data ke Firebase...')
      await onSave(finalFormData)
      setUploadProgress('Data berhasil disimpan!')
      onClose()
    } catch (error) {
      console.error('Error saving news:', error)
      setUploadProgress('Terjadi kesalahan saat menyimpan')
      
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('Terjadi kesalahan saat menyimpan berita')
      }
    } finally {
      setIsLoading(false)
      setTimeout(() => setUploadProgress(''), 3000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate the file
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        alert(validation.error)
        e.target.value = '' // Reset the input
        return
      }
      
      setImageFile(file)
      setUploadProgress('')
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
                Judul Berita
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Masukkan judul berita..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ringkasan
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Masukkan ringkasan berita..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konten Lengkap
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Masukkan konten lengkap berita..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gambar Berita
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border"
                  />
                </div>
              )}
              
              {/* Upload Progress */}
              {uploadProgress && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900 rounded-md">
                  <p className="text-sm text-blue-700 dark:text-blue-300">{uploadProgress}</p>
                </div>
              )}
              
              {/* Image Upload */}
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500">
                  Pilih file gambar untuk upload ke Supabase (max 2MB). Format yang didukung: JPG, PNG, GIF, WebP
                </p>
                
                {/* URL Input as fallback */}
                <div className="border-t pt-2">
                  <label className="block text-xs text-gray-500 mb-1">Atau masukkan URL gambar langsung:</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Penulis
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Nama penulis"
                />
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
