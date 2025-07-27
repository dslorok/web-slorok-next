"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
    fetchRegulations,
    fetchRegulationsByYear,
    addRegulation,
    updateRegulation,
    deleteRegulation,
    RegulationItem,
    RegulationFormData,
    getRegulationTypeLabel
} from "@/lib/regulation-firebase"
import { deleteRegulationPDF } from "@/lib/regulation-pdf-upload"
import RegulationEditModal from "@/components/regulations/regulation-edit-modal"

export default function RegulationsContent() {
    const [regulations, setRegulations] = useState<RegulationItem[]>([])
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [editingRegulation, setEditingRegulation] = useState<RegulationItem | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const { isAdmin } = useAuth()

    const years = Array.from({ length: 16 }, (_, i) => 2025 - i)

    useEffect(() => {
        loadRegulations()
    }, [selectedYear])

    const loadRegulations = async () => {
        setLoading(true)
        try {
            const regulationsData = await fetchRegulationsByYear(selectedYear)
            setRegulations(regulationsData)
        } catch (error) {
            console.error("Error loading regulations:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (regulation: RegulationItem, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingRegulation(regulation)
        setIsEditModalOpen(true)
    }

    const handleDelete = async (regulation: RegulationItem, e: React.MouseEvent) => {
        e.stopPropagation()

        if (confirm(`Hapus peraturan "${regulation.title}"?`)) {
            try {
                // Delete from Firebase
                await deleteRegulation(regulation.id)

                // Delete PDF from Supabase if it exists
                if (regulation.pdfUrl && regulation.pdfUrl.includes('supabase')) {
                    await deleteRegulationPDF(regulation.pdfUrl)
                }

                // Update local state
                setRegulations(regulations.filter(item => item.id !== regulation.id))

                console.log('Regulation deleted successfully:', regulation)
            } catch (error) {
                console.error('Error deleting regulation:', error)
                alert('Terjadi kesalahan saat menghapus peraturan')
            }
        }
    }

    const handleAddRegulation = () => {
        setEditingRegulation(null)
        setIsEditModalOpen(true)
    }

    const handleSaveRegulation = async (formData: RegulationFormData) => {
        try {
            if (editingRegulation) {
                // Update existing regulation
                await updateRegulation(editingRegulation.id, formData)
                console.log('Regulation updated successfully')
            } else {
                // Add new regulation
                await addRegulation(formData)
                console.log('Regulation added successfully')
            }

            // Refresh the regulations list
            await loadRegulations()
            setIsEditModalOpen(false)
            setEditingRegulation(null)
        } catch (error) {
            console.error('Error saving regulation:', error)
            throw error // Let the modal handle the error display
        }
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
        setEditingRegulation(null)
    }

    return (
        <>
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Admin Controls */}
                    {isAdmin && (
                        <div className="mb-8 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-green-800 dark:text-green-200 flex items-center">
                                        <i className="fas fa-edit mr-2"></i>
                                        Mode Admin - Kelola Peraturan Desa
                                    </h3>
                                    <p className="text-sm text-green-600 dark:text-green-300">Anda dapat menambah, mengedit, atau menghapus peraturan</p>
                                </div>
                                <button
                                    onClick={handleAddRegulation}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <i className="fas fa-plus mr-2"></i>
                                    Tambah Peraturan
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Year Filter */}
                    <div className="mb-8 flex items-center gap-4">
                        <label htmlFor="year-filter" className="font-semibold text-lg">
                            Pilih Tahun:
                        </label>
                        <select
                            id="year-filter"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-md px-4 py-2"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Regulations List */}
                    <div className="space-y-12">
                        {loading ? (
                            // Loading State
                            <div className="space-y-8">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
                                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                                        <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                    </div>
                                ))}
                            </div>
                        ) : regulations.length > 0 ? (
                            regulations.map((regulation) => (
                                <div
                                    key={regulation.id}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative group"
                                >
                                    {/* Admin Controls */}


                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                {regulation.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
                                                    {getRegulationTypeLabel(regulation.type)}
                                                </span>
                                                <span>Tahun {regulation.year}</span>
                                                {regulation.description && (
                                                    <span className="italic">"{regulation.description}"</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right side buttons container */}
                                        <div className="flex flex-col gap-2">
                                            {/* Download PDF Button */}
                                            <a
                                                href={regulation.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-2"
                                            >
                                                <i className="fas fa-download"></i>
                                                Download PDF
                                            </a>

                                            {/* Admin Controls - Edit and Delete buttons */}
                                            {isAdmin && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => handleEdit(regulation, e)}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                                                        title="Edit peraturan"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(regulation, e)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                                                        title="Hapus peraturan"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {regulation.pdfUrl && (
                                        <iframe
                                            src={regulation.pdfUrl}
                                            className="w-full h-[75vh] rounded-md border border-gray-300 dark:border-gray-600"
                                            title={regulation.title}
                                        >
                                            Browser Anda tidak mendukung pratinjau PDF. Silakan{" "}
                                            <a
                                                href={regulation.pdfUrl}
                                                className="text-primary-600 underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                unduh dokumennya
                                            </a>
                                            .
                                        </iframe>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <i className="fas fa-file-pdf text-4xl text-gray-400 mb-4"></i>
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    Tidak ada peraturan untuk tahun {selectedYear}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500">
                                    {isAdmin ? 'Klik "Tambah Peraturan" untuk menambahkan peraturan baru' : 'Peraturan akan ditampilkan di sini'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Regulation Edit Modal */}
            <RegulationEditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleSaveRegulation}
                regulationItem={editingRegulation}
                title={editingRegulation ? "Edit Peraturan" : "Tambah Peraturan Baru"}
            />
        </>
    )
}
