import { db } from './firebase'
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore'

export interface NewsItem {
    id: string
    title: string
    excerpt: string
    content: string
    image: string
    date: string
    author: string
    createdAt?: any
    updatedAt?: any
}

export interface NewsFormData {
    title: string
    excerpt: string
    content: string
    image: string
    date: string
    author: string
    category?: string
}

export type NewsType = 'news' | 'bumdes' | 'koperasi';

export async function fetchNews(type: NewsType): Promise<NewsItem[]> {
    try {
        console.log('Loading news from Firebase...')
        let q

        try {
            // Set query based on type
            q = query(collection(db, type), orderBy('createdAt', 'desc'))
            console.log(`${type} type selected`)

            const querySnapshot = await getDocs(q)
            console.log('News snapshot size:', querySnapshot.size)

            const newsData: NewsItem[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as NewsItem))

            console.log('Processed news data:', newsData)
            return newsData

        } catch (orderError) {
            // If ordering or index fails
            console.warn('Ordering failed, fetching without order:', orderError)

            const querySnapshot = await getDocs(collection(db, type))
            console.log('News snapshot size (unordered):', querySnapshot.size)

            const newsData: NewsItem[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as NewsItem))

            console.log('Processed news data (unordered):', newsData)
            return newsData
        }
    } catch (error) {
        console.error(`Error fetching ${type}:`, error)
        throw error
    }
}



// Legacy function name for backward compatibility
export async function fetchNewsData(type: NewsType) {
    return await fetchNews(type)
}

// Add new news item
export async function addNews(newsData: NewsFormData, type: NewsType): Promise<string> {
    try {
        console.log(`Adding ${type} to Firebase:`, newsData)
        const docRef = await addDoc(collection(db, type), {
            ...newsData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        console.log(`${type} added successfully:`, docRef.id)
        return docRef.id
    } catch (error) {
        console.error(`Error adding ${type}:`, error)
        throw error
    }
}

// Update existing news item
export const updateNews = async (newsId: string, newsData: Partial<NewsFormData>,  type: NewsType): Promise<void> => {
    try {
        console.log('Updating news:', newsId, newsData)
        const newsDoc = doc(db, type, newsId)
        await updateDoc(newsDoc, {
            ...newsData,
            updatedAt: serverTimestamp()
        })

        console.log(`${type} updated successfully:`, newsId)
    } catch (error) {
        console.error(`Error updating ${type}:`, error)
        throw error
    }
}

// Delete news item
export const deleteNews = async (newsId: string,  type: NewsType): Promise<void> => {
    try {
        console.log('Deleting news:', newsId)
        const newsDoc = doc(db, type, newsId)
        await deleteDoc(newsDoc)

        console.log('News deleted successfully:', newsId)
    } catch (error) {
        console.error(`Error deleting ${type}:`, error)
        throw error
    }
}
