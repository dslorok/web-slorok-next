import { db } from "@/lib/firebase"
import { doc, updateDoc, setDoc } from "firebase/firestore"

// Update Population Data
export async function updatePopulationData(data: any) {
  try {
    const docRef = doc(db, "infographics", "population")
    await updateDoc(docRef, data)
    console.log("Population data updated successfully")
  } catch (error) {
    console.error("Error updating population data:", error)
    throw error
  }
}

// Update Agriculture Data
export async function updateAgricultureData(data: any) {
  try {
    const docRef = doc(db, "infographics", "agriculture")
    await updateDoc(docRef, data)
    console.log("Agriculture data updated successfully")
  } catch (error) {
    console.error("Error updating agriculture data:", error)
    throw error
  }
}

// Update Budget Data
export async function updateBudgetData(data: any) {
  try {
    const docRef = doc(db, "infographics", "budget")
    await updateDoc(docRef, data)
    console.log("Budget data updated successfully")
  } catch (error) {
    console.error("Error updating budget data:", error)
    throw error
  }
}

// Update specific fields
export async function updatePopulationField(field: string, value: any) {
  try {
    const docRef = doc(db, "infographics", "population")
    await updateDoc(docRef, { [field]: value })
    console.log(`Population ${field} updated successfully`)
  } catch (error) {
    console.error(`Error updating population ${field}:`, error)
    throw error
  }
}

export async function updateAgricultureField(field: string, value: any) {
  try {
    const docRef = doc(db, "infographics", "agriculture")
    await updateDoc(docRef, { [field]: value })
    console.log(`Agriculture ${field} updated successfully`)
  } catch (error) {
    console.error(`Error updating agriculture ${field}:`, error)
    throw error
  }
}

export async function updateBudgetField(field: string, value: any) {
  try {
    const docRef = doc(db, "infographics", "budget")
    await updateDoc(docRef, { [field]: value })
    console.log(`Budget ${field} updated successfully`)
  } catch (error) {
    console.error(`Error updating budget ${field}:`, error)
    throw error
  }
}
