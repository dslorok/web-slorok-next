import ImageUpload from '@/components/upload'

export default function AdminUploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Gambar</h1>
        <p className="text-gray-600 dark:text-gray-300">Upload gambar untuk digunakan dalam konten website</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <ImageUpload />
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Panduan Upload Gambar:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Pastikan bucket "slorok" sudah dibuat di Supabase Storage</li>
          <li>• Gunakan format gambar JPG, PNG, atau WebP</li>
          <li>• Ukuran file maksimal 2MB</li>
          <li>• Copy URL gambar yang berhasil diupload untuk digunakan dalam konten</li>
          <li>• URL gambar dapat digunakan di form berita, BUMDes, atau koperasi</li>
        </ul>
      </div>
    </div>
  )
}
