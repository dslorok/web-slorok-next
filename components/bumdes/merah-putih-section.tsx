"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import NewsModal from "@/components/news/news-modal"
import { useAuth } from "@/lib/auth-context"
import { 
  fetchNewsData, 
  addNews, 
  updateNews, 
  deleteNews, 
  NewsItem, 
  NewsFormData,
  NewsType 
} from "@/lib/news-firebase"
import { deleteNewsImage } from "@/lib/news-image-upload"
import NewsEditModal from "@/components/news/news-edit-modal"

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setLoading(true)
    try {
      const newsData = await fetchNewsData('koperasi')
      setNews(newsData)
    } catch (error) {
      console.error("Error loading news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
  }

  const closeModal = () => {
    setSelectedNews(null)
  }

  const handleEdit = (newsItem: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal
    setEditingNews(newsItem)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (newsItem: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal
    
    if (confirm(`Hapus berita "${newsItem.title}"?`)) {
      try {
        // Delete from Firebase
        await deleteNews(newsItem.id.toString(), 'koperasi')
        
        // Delete image from Supabase if it exists
        if (newsItem.image && newsItem.image.includes('supabase')) {
          await deleteNewsImage(newsItem.image)
        }
        
        // Update local state
        setNews(news.filter(item => item.id !== newsItem.id))
        
        console.log('News deleted successfully:', newsItem)
      } catch (error) {
        console.error('Error deleting news:', error)
        alert('Terjadi kesalahan saat menghapus berita')
      }
    }
  }

  const handleAddNews = () => {
    setEditingNews(null)
    setIsEditModalOpen(true)
  }

  const handleSaveNews = async (formData: NewsFormData) => {
    try {
      if (editingNews) {
        // Update existing news
        await updateNews(editingNews.id.toString(), formData, 'koperasi')
        console.log('News updated successfully')
      } else {
        // Add new news
        await addNews(formData, 'koperasi')
        console.log('News added successfully')
      }
      
      // Refresh the news list
      await loadNews()
      setIsEditModalOpen(false)
      setEditingNews(null)
    } catch (error) {
      console.error('Error saving news:', error)
      throw error // Let the modal handle the error display
    }
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingNews(null)
  }

  return (
    <>
      <section className={`py-16 bg-gray-50 dark:bg-gray-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Controls */}
          {isAdmin && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-green-800 flex items-center">
                    <i className="fas fa-edit mr-2"></i>
                    Mode Admin - Kelola Kegiatan Koperasi Merah Putih
                  </h3>
                  <p className="text-sm text-green-600">Anda dapat menambah, mengedit, atau menghapus berita</p>
                </div>
                <button 
                  onClick={handleAddNews}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Tambah Berita
                </button>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">Galeri Kegiatan Koperasi Merah Putih</h2>
            <p className="text-gray-600 dark:text-gray-300">Foto-foto kegiatan di desa slorok</p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-newspaper text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Belum ada berita
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {isAdmin ? 'Klik "Tambah Berita" untuk menambahkan berita pertama' : 'Berita akan ditampilkan di sini'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative group"
                  onClick={() => handleNewsClick(item)}
                >
                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleEdit(item, e)}
                          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                          title="Edit berita"
                        >
                          <i className="fas fa-edit text-sm"></i>
                        </button>
                        <button
                          onClick={(e) => handleDelete(item, e)}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Hapus berita"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{item.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Oleh: {item.author}</span>
                      <button className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 transition-colors duration-200 flex items-center space-x-1">
                        <span>Baca Selengkapnya</span>
                        <i className="fas fa-arrow-right text-sm"></i>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News View Modal */}
      {selectedNews && <NewsModal news={selectedNews} onClose={closeModal} />}
      
      {/* News Edit Modal */}
      <NewsEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveNews}
        newsItem={editingNews}
        title={editingNews ? "Edit Berita" : "Tambah Berita Baru"}
      />
    </>
  )
}