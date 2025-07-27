"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { fetchBudgetData } from "@/lib/fetch-infographics-data"
import { updateBudgetField } from "@/lib/update-infographics-data"
import { useAuth } from "@/lib/auth-context"
import EditModal from "@/components/admin/edit-modal"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BudgetData() {
  const [budgetData, setBudgetData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editType, setEditType] = useState('')
  const [editData, setEditData] = useState<any>({})
  const { isAdmin } = useAuth()

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true)
        const data = await fetchBudgetData()
        if (data) {
          setBudgetData(data)
        }
      } catch (error) {
        console.error("Error loading budget data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBudgetData()
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1.0e9) return "Rp " + (value / 1.0e9).toFixed(2) + " M"
    if (value >= 1.0e6) return "Rp " + (value / 1.0e6).toFixed(1) + " Jt"
    if (value >= 1.0e3) return "Rp " + (value / 1.0e3).toFixed(1) + " Rb"
    return "Rp " + value
  }

  const revenueData = {
    labels: budgetData?.revenue?.labels || ["Pendapatan Asli Desa", "Pendapatan Transfer", "Pendapatan Lain-lain"],
    datasets: [
      {
        label: "Anggaran (Rp)",
        data: budgetData?.revenue?.data || [325310200, 2089649500, 0],
        backgroundColor: ["#2e7d32", "#4caf50", "#8dd18d"],
        borderRadius: 5,
      },
    ],
  }

  const expenditureData = {
    labels: budgetData?.expenditure?.labels || [
      "Penyelenggaraan Pemerintahan Desa",
      "Pelaksanaan Pembangunan Desa",
      "Pembinaan Kemasyarakatan",
      "Pemberdayaan Masyarakat Desa",
      "Penanggulangan Bencana, Keadaan Darurat dan Mendesak",
    ],
    datasets: [
      {
        label: "Anggaran (Rp)",
        data: budgetData?.expenditure?.data || [1123785756.34, 1187744000, 73627444, 218317000, 173093000],
        backgroundColor: ["#bf360c", "#ff5722", "#ff7043", "#ff8a65", "#ffab91"],
        borderRadius: 5,
      },
    ],
  }

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  }

  const expenditureOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  }

  // Edit functions
  const handleEditRevenue = () => {
    setEditType('revenue')
    setEditData({
      labels: budgetData?.revenue?.labels || ["Pendapatan Asli Desa", "Pendapatan Transfer", "Pendapatan Lain-lain"],
      data: budgetData?.revenue?.data || [325310200, 2089649500, 0]
    })
    setIsEditModalOpen(true)
  }

  const handleEditExpenditure = () => {
    setEditType('expenditure')
    setEditData({
      labels: budgetData?.expenditure?.labels || ["Bidang Penyelenggaraan Pemerintahan Desa", "Bidang Pelaksanaan Pembangunan Desa", "Bidang Pembinaan Kemasyarakatan", "Bidang Pemberdayaan Masyarakat", "Bidang Penanggulangan Bencana, Darurat dan Mendesak"],
      data: budgetData?.expenditure?.data || [1325976800, 751976400, 247528000, 297888000, 153198000]
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      await updateBudgetField(editType, editData)

      // Refresh data
      const updatedData = await fetchBudgetData()
      setBudgetData(updatedData)

      setIsEditModalOpen(false)
    } catch (error) {
      console.error(`Error updating ${editType}:`, error)
    }
  }

  // Get summary data from Firebase or use fallback
  const summary = budgetData?.summary
  // Replace lines 140-141 with this:

  // Calculate totals by summing the arrays
  const revenue = budgetData?.revenue?.data ?
    budgetData.revenue.data.reduce((total: number, value: number) => total + value, 0) :
    2414959700 // fallback

  const expenditure = budgetData?.expenditure?.data ?
    budgetData.expenditure.data.reduce((total: number, value: number) => total + value, 0) :
    2776567200 // fallback

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-16">
        <div className="lg:col-span-1 text-center lg:text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">
                APBD Desa {budgetData?.year || 2024}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Ringkasan Anggaran Pendapatan dan Belanja Desa tahun berjalan.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
              <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                <i className="fas fa-arrow-up text-green-500 mr-2"></i>
                Pendapatan
              </div>
              <p className="mt-2 text-2xl font-bold text-green-500">
                Rp{revenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
              <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                <i className="fas fa-arrow-down text-red-500 mr-2"></i>
                Belanja
              </div>
              <p className="mt-2 text-2xl font-bold text-red-500">
                Rp{expenditure.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-16 border-gray-200 dark:border-gray-700" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Detail Pendapatan Desa
            </h3>
            {isAdmin && (
              <button
                onClick={handleEditRevenue}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
            )}
          </div>
          <div className="h-96">
            <Bar data={revenueData} options={revenueOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Detail Belanja Desa
            </h3>
            {isAdmin && (
              <button
                onClick={handleEditExpenditure}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
            )}
          </div>
          <div className="h-96">
            <Bar data={expenditureData} options={expenditureOptions} />
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title={`Edit ${editType === 'revenue' ? 'Pendapatan' : editType === 'expenditure' ? 'Belanja' : 'Ringkasan'} Data`}
      >
        {editType === 'summary' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Pendapatan (Rp)
              </label>
              <input
                type="number"
                value={editData.pendapatan || ''}
                onChange={(e) => setEditData({ ...editData, pendapatan: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Belanja (Rp)
              </label>
              <input
                type="number"
                value={editData.belanja || ''}
                onChange={(e) => setEditData({ ...editData, belanja: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )}

        {editType === 'revenue' && (
          <div className="space-y-4">
            {editData.labels?.map((label: string, index: number) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label {index + 1}
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => {
                      const newLabels = [...editData.labels]
                      newLabels[index] = e.target.value
                      setEditData({ ...editData, labels: newLabels })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nilai (Rp)
                  </label>
                  <input
                    type="number"
                    value={editData.data?.[index] || ''}
                    onChange={(e) => {
                      const newData = [...(editData.data || [])]
                      newData[index] = parseInt(e.target.value) || 0
                      setEditData({ ...editData, data: newData })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {editType === 'expenditure' && (
          <div className="space-y-4">
            {editData.labels?.map((label: string, index: number) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bidang {index + 1}
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => {
                      const newLabels = [...editData.labels]
                      newLabels[index] = e.target.value
                      setEditData({ ...editData, labels: newLabels })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anggaran (Rp)
                  </label>
                  <input
                    type="number"
                    value={editData.data?.[index] || ''}
                    onChange={(e) => {
                      const newData = [...(editData.data || [])]
                      newData[index] = parseInt(e.target.value) || 0
                      setEditData({ ...editData, data: newData })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </EditModal>
    </div>
  )
}
