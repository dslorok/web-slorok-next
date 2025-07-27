import { createClient } from '@/lib/supabase-client'

export const uploadRegulationPDF = async (file: File, regulationId?: string): Promise<string> => {
  try {
    const supabase = createClient()
    
    // Generate unique filename with better organization
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    const fileName = regulationId 
      ? `regulations/${regulationId}/${timestamp}_${sanitizedFileName}`
      : `regulations/temp/${timestamp}_${sanitizedFileName}`
    
    console.log('Uploading regulation PDF:', { fileName, fileSize: file.size, fileType: file.type })
    
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
    
    console.log('Regulation PDF uploaded successfully:', data.publicUrl)
    return data.publicUrl
  } catch (error) {
    console.error('Error uploading regulation PDF:', error)
    throw error
  }
}

export const deleteRegulationPDF = async (pdfUrl: string): Promise<void> => {
  try {
    const supabase = createClient()
    
    // Extract the file path from the Supabase URL
    // Format: https://[project].supabase.co/storage/v1/object/public/slorok/path/to/file
    const urlParts = pdfUrl.split('/')
    const bucketIndex = urlParts.findIndex(part => part === 'slorok')
    
    if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
      const filePath = urlParts.slice(bucketIndex + 1).join('/')
      
      console.log('Deleting regulation PDF:', filePath)
      
      const { error } = await supabase.storage
        .from('slorok')
        .remove([filePath])
      
      if (error) {
        throw error
      }
      
      console.log('Regulation PDF deleted successfully:', filePath)
    } else {
      console.warn('Could not extract file path from URL:', pdfUrl)
    }
  } catch (error) {
    console.error('Error deleting regulation PDF:', error)
    // Don't throw here to prevent blocking other operations
  }
}

// Helper function to validate PDF files
export const validatePDFFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'File harus berupa PDF' }
  }

  // Check file size (max 2MB for PDFs)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    return { isValid: false, error: 'Ukuran file tidak boleh lebih dari 10MB' }
  }
  
  return { isValid: true }
}
