import { createClient } from '@/lib/supabase-client'

export const uploadNewsImage = async (file: File, newsId?: string): Promise<string> => {
  try {
    const supabase = createClient()
    
    // Generate unique filename with better organization
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    const fileName = newsId 
      ? `news/${newsId}/${timestamp}_${sanitizedFileName}`
      : `news/temp/${timestamp}_${sanitizedFileName}`
    
    console.log('Uploading news image:', { fileName, fileSize: file.size, fileType: file.type })
    
    // Upload to Supabase storage (using your 'slorok' bucket)
    const { error: uploadError } = await supabase.storage
      .from('slorok')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('slorok')
      .getPublicUrl(fileName)
    
    console.log('News image uploaded successfully:', data.publicUrl)
    return data.publicUrl
  } catch (error) {
    console.error('Error uploading news image:', error)
    throw error
  }
}

export const deleteNewsImage = async (imageUrl: string): Promise<void> => {
  try {
    const supabase = createClient()
    
    // Extract the file path from the Supabase URL
    // Format: https://[project].supabase.co/storage/v1/object/public/slorok/path/to/file
    const urlParts = imageUrl.split('/')
    const bucketIndex = urlParts.findIndex(part => part === 'slorok')
    
    if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
      const filePath = urlParts.slice(bucketIndex + 1).join('/')
      
      console.log('Deleting news image:', filePath)
      
      const { error } = await supabase.storage
        .from('slorok')
        .remove([filePath])
      
      if (error) {
        throw error
      }
      
      console.log('News image deleted successfully:', filePath)
    } else {
      console.warn('Could not extract file path from URL:', imageUrl)
    }
  } catch (error) {
    console.error('Error deleting news image:', error)
    // Don't throw here to prevent blocking other operations
  }
}

// Helper function to validate image files
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File harus berupa gambar' }
  }
  
  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    return { isValid: false, error: 'Ukuran file tidak boleh lebih dari 2MB' }
  }
  
  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!supportedFormats.includes(file.type)) {
    return { isValid: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP' }
  }
  
  return { isValid: true }
}
