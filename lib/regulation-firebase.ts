import { db } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore'

export interface RegulationItem {
  id: string
  title: string
  year: number
  type: 'peraturan-desa' | 'peraturan-kepala-desa' | 'surat-keputusan'
  pdfUrl: string
  uploadDate: string
  description?: string
}

export interface RegulationFormData {
  title: string
  year: number
  type: 'peraturan-desa' | 'peraturan-kepala-desa' | 'surat-keputusan'
  pdfUrl: string
  description?: string
}

const COLLECTION_NAME = 'regulations'

// Fetch all regulations
export const fetchRegulations = async (): Promise<RegulationItem[]> => {
  try {
    console.log('Fetching regulations from Firebase...')
    
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('year', 'desc'),
      orderBy('uploadDate', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const regulations: RegulationItem[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      regulations.push({
        id: doc.id,
        title: data.title || '',
        year: data.year || new Date().getFullYear(),
        type: data.type || 'peraturan-desa',
        pdfUrl: data.pdfUrl || '',
        uploadDate: data.uploadDate?.toDate?.()?.toISOString?.() || data.uploadDate || new Date().toISOString(),
        description: data.description || ''
      })
    })
    
    console.log(`Fetched ${regulations.length} regulations`)
    return regulations
  } catch (error) {
    console.error('Error fetching regulations:', error)
    throw error
  }
}

// Fetch regulations by year
export const fetchRegulationsByYear = async (year: number): Promise<RegulationItem[]> => {
  try {
    console.log('Fetching regulations for year:', year)
    
    // Try with composite query first
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('year', '==', year),
        orderBy('uploadDate', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const regulations: RegulationItem[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        regulations.push({
          id: doc.id,
          title: data.title || '',
          year: data.year || year,
          type: data.type || 'peraturan-desa',
          pdfUrl: data.pdfUrl || '',
          uploadDate: data.uploadDate?.toDate?.()?.toISOString?.() || data.uploadDate || new Date().toISOString(),
          description: data.description || ''
        })
      })
      
      console.log(`Fetched ${regulations.length} regulations for year ${year}`)
      return regulations
      
    } catch (indexError) {
      // Fallback: fetch by year only, then sort client-side
      console.log('Index not available, using fallback query...')
      
      const q = query(
        collection(db, COLLECTION_NAME),
        where('year', '==', year)
      )
      
      const querySnapshot = await getDocs(q)
      const regulations: RegulationItem[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        regulations.push({
          id: doc.id,
          title: data.title || '',
          year: data.year || year,
          type: data.type || 'peraturan-desa',
          pdfUrl: data.pdfUrl || '',
          uploadDate: data.uploadDate?.toDate?.()?.toISOString?.() || data.uploadDate || new Date().toISOString(),
          description: data.description || ''
        })
      })
      
      // Sort client-side by uploadDate (newest first)
      regulations.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      
      console.log(`Fetched ${regulations.length} regulations for year ${year} (client-side sorted)`)
      return regulations
    }
    
  } catch (error) {
    console.error('Error fetching regulations by year:', error)
    throw error
  }
}
// Add new regulation
export const addRegulation = async (regulationData: RegulationFormData): Promise<string> => {
  try {
    console.log('Adding new regulation to Firebase:', regulationData)
    
    const docData = {
      ...regulationData,
      uploadDate: serverTimestamp(),
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData)
    console.log('Regulation added with ID:', docRef.id)
    
    return docRef.id
  } catch (error) {
    console.error('Error adding regulation:', error)
    throw error
  }
}

// Update regulation
export const updateRegulation = async (id: string, regulationData: Partial<RegulationFormData>): Promise<void> => {
  try {
    console.log('Updating regulation:', id, regulationData)
    
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...regulationData,
      lastModified: serverTimestamp()
    })
    
    console.log('Regulation updated successfully')
  } catch (error) {
    console.error('Error updating regulation:', error)
    throw error
  }
}

// Delete regulation
export const deleteRegulation = async (id: string): Promise<void> => {
  try {
    console.log('Deleting regulation:', id)
    
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
    
    console.log('Regulation deleted successfully')
  } catch (error) {
    console.error('Error deleting regulation:', error)
    throw error
  }
}

// Get regulation types for display
export const getRegulationTypeLabel = (type: string): string => {
  switch (type) {
    case 'peraturan-desa':
      return 'Peraturan Desa'
    case 'peraturan-kepala-desa':
      return 'Peraturan Kepala Desa'
    case 'surat-keputusan':
      return 'Surat Keputusan Kepala Desa'
    default:
      return 'Peraturan Desa'
  }
}
