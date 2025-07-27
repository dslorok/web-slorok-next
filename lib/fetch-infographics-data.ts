import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

// Fetch Population Data
export async function fetchPopulationData() {
  try {
    const docRef = doc(db, "infographics", "population")
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log("No population data found!")
      return null
    }
  } catch (error) {
    console.error("Error fetching population data:", error)
    throw error
  }
}

// Fetch Agriculture Data
export async function fetchAgricultureData() {
  try {
    const docRef = doc(db, "infographics", "agriculture")
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log("No agriculture data found!")
      return null
    }
  } catch (error) {
    console.error("Error fetching agriculture data:", error)
    throw error
  }
}

// Fetch Budget Data
export async function fetchBudgetData() {
  try {
    const docRef = doc(db, "infographics", "budget")
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log("No budget data found!")
      return null
    }
  } catch (error) {
    console.error("Error fetching budget data:", error)
    throw error
  }
}

// Fetch Tabs Configuration
export async function fetchTabsData() {
  try {
    const tabs = []
    const tabIds = ["population", "agriculture", "budget"]
    
    for (const tabId of tabIds) {
      const docRef = doc(db, "tabs", tabId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        tabs.push({ id: tabId, ...docSnap.data() })
      }
    }
    
    return tabs
  } catch (error) {
    console.error("Error fetching tabs data:", error)
    throw error
  }
}
