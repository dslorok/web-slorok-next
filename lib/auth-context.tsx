"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase' // Make sure db is exported from here

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user')
      setUser(user)

      if (user) {
        try {
          console.log('Checking user role for UID:', user.uid)
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          const data = userDoc.data()
          console.log('User document data:', data)

          const isUserAdmin = data?.role === 'admin'
          setIsAdmin(isUserAdmin)
          console.log('Is admin?', isUserAdmin)

          // Temporary fallback: if no document found, set as admin for testing
          if (!userDoc.exists()) {
            console.log('No user document found, setting as admin for testing')
            setIsAdmin(false)
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    console.log('Attempting login for:', email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('Login successful, UID:', userCredential.user.uid)
    setUser(userCredential.user)

    try {
      console.log('Fetching user role from Firestore...')
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      const data = userDoc.data()
      console.log('User document exists:', userDoc.exists())
      console.log('User document data:', data)

      const isUserAdmin = data?.role === 'admin'
      console.log('Setting isAdmin to:', isUserAdmin)

      // Temporary fallback: if no document found, set as admin for testing
      if (!userDoc.exists()) {
        console.log('No user document found, setting as admin for testing')
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error fetching user role on login:', error)
      setIsAdmin(false)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
