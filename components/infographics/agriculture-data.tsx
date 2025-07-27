"use client"

import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { fetchAgricultureData } from "@/lib/fetch-infographics-data"
import { updateAgricultureField } from "@/lib/update-infographics-data"
import { useAuth } from "@/lib/auth-context"
import EditModal from "@/components/admin/edit-modal"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function AgricultureData() {
  const [agricultureData, setAgricultureData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editType, setEditType] = useState('')
  const [editData, setEditData] = useState<any>({})
  const { isAdmin } = useAuth()

  useEffect(() => {
    const loadAgricultureData = async () => {
      try {
        setLoading(true)
        const data = await fetchAgricultureData()
        if (data) {
          setAgricultureData(data)
        }
      } catch (error) {
        console.error("Error loading agriculture data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAgricultureData()
  }, [])

  // Get data from Firebase or use fallback
  const years = agricultureData?.years || ["2018", "2019", "2020", "2021", "2022"]

  const livestockData = {
    labels: years,
    datasets: [
      {
        label: "Sapi",
        data: agricultureData?.livestock?.sapi || [1235, 1236, 1240, 1240, 1240],
        backgroundColor: "#4caf50",
      },
      {
        label: "Kambing",
        data: agricultureData?.livestock?.kambing || [153, 155, 160, 160, 160],
        backgroundColor: "#8dd18d",
      },
      {
        label: "Ayam",
        data: agricultureData?.livestock?.ayam || [1720, 1700, 1750, 1750, 1750],
        backgroundColor: "#bce5bc",
      },
    ],
  }

  const plantationData = {
    labels: years,
    datasets: [
      {
        label: "Kelapa",
        data: agricultureData?.plantation?.kelapa || [2, 2, 2, 2, 2],
        backgroundColor: "#4caf50",
      },
      {
        label: "Karet",
        data: agricultureData?.plantation?.karet || [0, 0, 0, 0, 0],
        backgroundColor: "#8dd18d",
      },
      {
        label: "Kopi",
        data: agricultureData?.plantation?.kopi || [0, 0, 0, 0, 0],
        backgroundColor: "#bce5bc",
      },
    ],
  }

  const foodCropData = {
    labels: years,
    datasets: [
      {
        label: "Padi",
        data: agricultureData?.foodCrop?.padi || [118, 120, 120, 120, 120],
        borderColor: "#ff6b35",
        tension: 0.1,
      },
      {
        label: "Jagung",
        data: agricultureData?.foodCrop?.jagung || [93, 96, 96, 96, 96],
        borderColor: "#4caf50",
        tension: 0.1,
      },
      {
        label: "Kacang Tanah",
        data: agricultureData?.foodCrop?.kacang_tanah || [5, 5, 5, 5, 5],
        borderColor: "#2e7d32",
        tension: 0.1,
      },
      {
        label: "Tomat",
        data: agricultureData?.foodCrop?.tomat || [13, 15, 15, 15, 15],
        borderColor: "#8dd18d",
        tension: 0.1,
      },
      {
        label: "Cabe",
        data: agricultureData?.foodCrop?.cabe || [24, 25, 25, 25, 25],
        borderColor: "#bce5bc",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: { y: { beginAtZero: true } },
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: {
      y: {
        beginAtZero: true,
        max: 150,
      },
    },
  }

  // Edit functions
  const handleEditLivestock = () => {
    setEditType('livestock')
    setEditData({
      sapi: agricultureData?.livestock?.sapi || [38, 38, 38, 38, 38],
      kerbau: agricultureData?.livestock?.kerbau || [25, 25, 25, 25, 25],
      kambing: agricultureData?.livestock?.kambing || [153, 155, 160, 160, 160],
      ayam: agricultureData?.livestock?.ayam || [1720, 1700, 1750, 1750, 1750]
    })
    setIsEditModalOpen(true)
  }

  const handleEditPlantation = () => {
    setEditType('plantation')
    setEditData({
      kelapa: agricultureData?.plantation?.kelapa || [2, 2, 2, 2, 2],
      pisang: agricultureData?.plantation?.pisang || [8, 8, 8, 8, 8],
      rambutan: agricultureData?.plantation?.rambutan || [5, 5, 5, 5, 5],
      mangga: agricultureData?.plantation?.mangga || [12, 12, 12, 12, 12]
    })
    setIsEditModalOpen(true)
  }

  const handleEditFoodCrop = () => {
    setEditType('foodCrop')
    setEditData({
      padi: agricultureData?.foodCrop?.padi || [200, 210, 220, 230, 240],
      jagung: agricultureData?.foodCrop?.jagung || [15, 18, 20, 22, 25],
      kedelai: agricultureData?.foodCrop?.kedelai || [8, 10, 12, 14, 16],
      kacangTanah: agricultureData?.foodCrop?.kacangTanah || [5, 6, 7, 8, 9]
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      await updateAgricultureField(editType, editData)
      
      // Refresh data
      const updatedData = await fetchAgricultureData()
      setAgricultureData(updatedData)
      
      setIsEditModalOpen(false)
    } catch (error) {
      console.error(`Error updating ${editType}:`, error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Data Potensi Peternakan
            </h3>
            {isAdmin && (
              <button
                onClick={handleEditLivestock}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
            )}
          </div>
          <div className="h-80">
            <Bar data={livestockData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Data Potensi Perkebunan (Ton)
            </h3>
            {isAdmin && (
              <button
                onClick={handleEditPlantation}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
            )}
          </div>
          <div className="h-80">
            <Bar data={plantationData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Data Potensi Tanaman Pangan
            </h3>
            {isAdmin && (
              <button
                onClick={handleEditFoodCrop}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <div className="relative h-96" style={{ minWidth: "800px" }}>
              <Line data={foodCropData} options={lineChartOptions} />
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title={`Edit ${editType === 'livestock' ? 'Peternakan' : editType === 'plantation' ? 'Perkebunan' : 'Tanaman Pangan'} Data`}
      >
        {editType === 'livestock' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Sapi (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.sapi?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newSapi = [...editData.sapi]
                      newSapi[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, sapi: newSapi})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Kerbau (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.kerbau?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newKerbau = [...editData.kerbau]
                      newKerbau[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, kerbau: newKerbau})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Kambing (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.kambing?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newKambing = [...editData.kambing]
                      newKambing[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, kambing: newKambing})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Ayam (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.ayam?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newAyam = [...editData.ayam]
                      newAyam[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, ayam: newAyam})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {editType === 'plantation' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Kelapa (Ton - 5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.kelapa?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newKelapa = [...editData.kelapa]
                      newKelapa[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, kelapa: newKelapa})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Pisang (Ton - 5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.pisang?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newPisang = [...editData.pisang]
                      newPisang[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, pisang: newPisang})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Rambutan (Ton - 5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.rambutan?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newRambutan = [...editData.rambutan]
                      newRambutan[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, rambutan: newRambutan})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Mangga (Ton - 5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.mangga?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newMangga = [...editData.mangga]
                      newMangga[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, mangga: newMangga})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {editType === 'foodCrop' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Padi (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.padi?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newPadi = [...editData.padi]
                      newPadi[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, padi: newPadi})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Jagung (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.jagung?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newJagung = [...editData.jagung]
                      newJagung[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, jagung: newJagung})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Kedelai (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.kedelai?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newKedelai = [...editData.kedelai]
                      newKedelai[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, kedelai: newKedelai})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Kacang Tanah (5 tahun terakhir)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editData.kacangTanah?.map((value: number, index: number) => (
                  <input
                    key={index}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const newKacangTanah = [...editData.kacangTanah]
                      newKacangTanah[index] = parseInt(e.target.value) || 0
                      setEditData({...editData, kacangTanah: newKacangTanah})
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder={`Tahun ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </EditModal>
    </div>
  )
}
