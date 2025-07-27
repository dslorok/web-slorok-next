"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `slorok/${fileName}`

      const supabase = createClient()
      console.log('Supabase client created:', !!supabase)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('File details:', { name: file.name, size: file.size, type: file.type })

      const { error: uploadError } = await supabase.storage
        .from('slorok') // Replace with your bucket name
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('slorok')
        .getPublicUrl(filePath)

      setImageUrl(data.publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      let errorMessage = 'Unknown error'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error)
      }
      
      alert(`Error uploading image: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {uploading && <p>Uploading...</p>}

      {imageUrl && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Uploaded successfully!</p>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="max-w-xs rounded-lg shadow-md"
          />
          <p className="text-xs text-gray-500 mt-2 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  )
}