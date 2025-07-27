"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { fetchPopulationData } from "@/lib/fetch-infographics-data"
import { updatePopulationField } from "@/lib/update-infographics-data"
import { useAuth } from "@/lib/auth-context"
import EditModal from "@/components/admin/edit-modal"
import PopulationEditModal from "./population-edit-modal"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface JobData {
  jenis: string
  jumlah: number
}

interface JobDataSet {
  semua: JobData[]
  laki_laki: JobData[]
  perempuan: JobData[]
}

interface ReligionData {
  name: string
  count: number
  icon: string
}

export default function PopulationData() {
  const [filter, setFilter] = useState<"semua" | "laki_laki" | "perempuan">("semua")
  const [jobData, setJobData] = useState<JobDataSet | null>(null)
  const [populationData, setPopulationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  // Edit modal states
  const [editModal, setEditModal] = useState<{
    isOpen: boolean
    type: 'summary' | 'religion' | 'jobs' | 'education' | null
    data: any
  }>({
    isOpen: false,
    type: null,
    data: null
  })

  // Population edit modal states
  const [populationEditModal, setPopulationEditModal] = useState<{
    isOpen: boolean
    type: 'job' | 'education' | null
    data: { labels: string[], data: number[] }
  }>({
    isOpen: false,
    type: null,
    data: { labels: [], data: [] }
  })

  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    const loadPopulationData = async () => {
      try {
        setLoading(true)
        const data = await fetchPopulationData()
        if (data) {
          setPopulationData(data)
          setJobData(data.jobs)
        }
      } catch (error) {
        console.error("Error loading population data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPopulationData()
  }, [])

  const educationData = {
    labels: populationData?.education?.labels || {},
    datasets: [
      {
        label: "Jumlah Penduduk",
        data: populationData?.education?.data || {},
        backgroundColor: "#ff6b35",
        borderRadius: 5,
      },
    ],
  }

  const educationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  // Get data from Firebase or use fallback
  const summary = populationData?.summary || {}
  const total = summary.male + summary.female

  const religionData = populationData?.religion || [
    { name: "Islam", count: 8285, icon: "fas fa-mosque" },
    { name: "Kristen", count: 22, icon: "fas fa-church" },
    { name: "Katolik", count: 268, icon: "fas fa-bible" },
    { name: "Hindu", count: 23, icon: "fas fa-om" },
    { name: "Buddha", count: 0, icon: "fas fa-dharmachakra" },
    { name: "Konghucu", count: 0, icon: "fas fa-yin-yang" },
    { name: "Kepercayaan Lainnya", count: 0, icon: "fas fa-pray" },
    { name: "Aliran Kepercayaan", count: 0, icon: "fas fa-praying-hands" },
  ]

  // Admin functions
  const handleEdit = (type: 'summary' | 'religion' | 'jobs' | 'education', data: any) => {
    setEditModal({ isOpen: true, type, data })
  }

  const handleSave = async () => {
    if (!editModal.type || !editModal.data) return

    setEditLoading(true)
    try {
      await updatePopulationField(editModal.type, editModal.data)

      // Refresh data
      const updatedData = await fetchPopulationData()
      if (updatedData) {
        setPopulationData(updatedData)
        if (editModal.type === 'jobs') {
          setJobData(updatedData.jobs)
        }
      }

      setEditModal({ isOpen: false, type: null, data: null })
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Error saving data. Please try again.")
    } finally {
      setEditLoading(false)
    }
  }

  // New population edit handlers
  const handleEditJobs = () => {
    if (jobData?.[filter]) {
      const currentJobData = jobData[filter];
      setPopulationEditModal({
        isOpen: true,
        type: 'job',
        data: {
          labels: currentJobData.map(job => job.jenis),
          data: currentJobData.map(job => job.jumlah)
        }
      })
    }
  }

  const handleEditEducation = (data: { labels: string[], data: number[] }) => {
    setPopulationEditModal({
      isOpen: true,
      type: 'education',
      data
    })
  }

  const handleSavePopulationData = async (data: { labels: string[], data: number[] }) => {
    setEditLoading(true)
    try {
      let updateData;

      if (populationEditModal.type === 'job') {
        // Convert back to job format
        const jobDataFormatted = data.labels.map((label, index) => ({
          jenis: label,
          jumlah: data.data[index]
        }));

        // Update the specific filter category
        updateData = {
          ...jobData,
          [filter]: jobDataFormatted
        };

        await updatePopulationField('jobs', updateData);
      } else {
        // Education data
        await updatePopulationField('education', data);
      }

      // Refresh data
      const updatedData = await fetchPopulationData()
      if (updatedData) {
        setPopulationData(updatedData)
        if (populationEditModal.type === 'job') {
          setJobData(updatedData.jobs)
        }
      }

      setPopulationEditModal({ isOpen: false, type: null, data: { labels: [], data: [] } })
    } catch (error) {
      console.error("Error saving population data:", error)
      alert("Error saving data. Please try again.")
    } finally {
      setEditLoading(false)
    }
  }

  const renderEditForm = () => {
    if (!editModal.type) return null

    switch (editModal.type) {
      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Laki-laki</label>
              <input
                type="number"
                value={editModal.data.male}
                onChange={(e) => setEditModal(prev => ({
                  ...prev,
                  data: { ...prev.data, male: parseInt(e.target.value) }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Perempuan</label>
              <input
                type="number"
                value={editModal.data.female}
                onChange={(e) => setEditModal(prev => ({
                  ...prev,
                  data: { ...prev.data, female: parseInt(e.target.value) }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )
      case 'religion':
        return (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {editModal.data.map((religion: any, index: number) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">{religion.name}</label>
                  <input
                    type="number"
                    value={religion.count}
                    onChange={(e) => {
                      const newData = [...editModal.data]
                      newData[index].count = parseInt(e.target.value)
                      setEditModal(prev => ({ ...prev, data: newData }))
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )
      default:
        return <div>Edit form for {editModal.type} coming soon...</div>
    }
  }

  const currentJobData = jobData?.[filter] || []
  const filteredJobData = currentJobData.filter((job: JobData) => job.jumlah > 0)
  const sortedJobData = [...filteredJobData].sort((a, b) => b.jumlah - a.jumlah)
  const top6Jobs = sortedJobData.slice(0, 6)
  
  // State for showing all jobs
  const [showAllJobs, setShowAllJobs] = useState(false)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Population Summary */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center space-x-4">
              <h2 className="text-3xl font-bold text-black dark:text-white">Jumlah Penduduk</h2>
              {isAdmin && (
                <button
                  onClick={() => handleEdit('summary', summary)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg flex items-center justify-center space-x-6">
              <div className="flex-shrink-0">
                <i className="fas fa-people-arrows text-blue-600 text-5xl"></i>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Penduduk
                </p>
                <p className="text-4xl font-bold text-black dark:text-white">{total.toLocaleString("id-ID")} Jiwa</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg flex items-center space-x-6">
              <div className="flex-shrink-0">
                <i className="fas fa-person-dress text-blue-600 text-5xl"></i>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Perempuan
                </p>
                <p className="text-4xl font-bold text-black dark:text-white">{summary.female.toLocaleString("id-ID")} Jiwa</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg flex items-center space-x-6">
              <div className="flex-shrink-0">
                <i className="fas fa-person text-blue-600 text-5xl"></i>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Laki-laki
                </p>
                <p className="text-4xl font-bold text-black dark:text-white">{summary.male.toLocaleString("id-ID")} Jiwa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Religion Statistics */}
      <section className="mb-4 bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Statistik Berdasarkan Agama</h2>
              {isAdmin && (
                <button
                  onClick={() => handleEdit('religion', religionData)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {religionData.map((religion: ReligionData, index: number) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center flex flex-col items-center"
              >
                <i className={`${religion.icon} text-blue-600 text-4xl mt-2 mb-6`}></i>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {religion.count.toLocaleString("id-ID")}
                </p>
                <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">{religion.name}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Jiwa</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Statistics */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-4">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Berdasarkan Pekerjaan</h2>
              {isAdmin && (
                <button
                  onClick={handleEditJobs}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-8 gap-2 pt-2">
            {[
              { key: "semua", label: "Semua" },
              { key: "laki_laki", label: "Laki-laki" },
              { key: "perempuan", label: "Perempuan" },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 ${filter === filterOption.key
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
              <div className="flex items-center bg-blue-600 text-white p-3 rounded-t-lg">
                <span className="font-semibold flex-1">Jenis Pekerjaan</span>
                <span className="font-semibold text-right">Jumlah</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {sortedJobData.length > 0 ? (
                  sortedJobData.map((job: JobData, index: number) => (
                    <div key={index} className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm flex-1">{job.jenis}</span>
                      <span className="text-sm font-semibold text-right">{job.jumlah.toLocaleString("id-ID")}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <i className="fas fa-briefcase text-3xl mb-2"></i>
                    <p>Tidak ada data pekerjaan dengan nilai &gt; 0</p>
                  </div>
                )}
              </div>
              
              {/* Show All Jobs Button */}
              {sortedJobData.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowAllJobs(true)}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-list"></i>
                    Lihat Semua Pekerjaan ({sortedJobData.length})
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {top6Jobs.map((job: JobData, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{job.jenis}</p>
                  <p className="text-4xl font-bold">{job.jumlah.toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Statistics */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4">
              <h2 className="text-3xl font-bold text-black dark:text-white">Berdasarkan Pendidikan</h2>
              {isAdmin && (
                <button
                  onClick={() => handleEditEducation(populationData?.education || { labels: [], data: [] })}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
            <div className="overflow-x-auto">
              <div className="relative h-96" style={{ minWidth: "800px" }}>
                <Bar data={educationData} options={educationOptions} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, type: null, data: null })}
        title={`Edit ${editModal.type === 'summary' ? 'Population Summary' :
          editModal.type === 'religion' ? 'Religion Data' :
            editModal.type === 'jobs' ? 'Job Data' : 'Education Data'}`}
        onSave={handleSave}
        loading={editLoading}
      >
        {renderEditForm()}
      </EditModal>

      {/* Population Edit Modal */}
      <PopulationEditModal
        isOpen={populationEditModal.isOpen}
        onClose={() => setPopulationEditModal({ isOpen: false, type: null, data: { labels: [], data: [] } })}
        onSave={handleSavePopulationData}
        type={populationEditModal.type || 'job'}
        initialData={populationEditModal.data}
      />

      {/* All Jobs View Modal */}
      {showAllJobs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Semua Pekerjaan dengan Nilai &gt; 0 ({filter === 'semua' ? 'Semua' : filter === 'laki_laki' ? 'Laki-laki' : 'Perempuan'})
              </h2>
              <button
                onClick={() => setShowAllJobs(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Pekerjaan</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{sortedJobData.length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-600 dark:text-green-300 font-medium">Total Pekerja</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-200">
                    {sortedJobData.reduce((sum, job) => sum + job.jumlah, 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg text-center">
                  <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Pekerjaan Teratas</p>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-200 truncate">
                    {sortedJobData[0]?.jenis || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold text-sm">
                  <div className="col-span-1">#</div>
                  <div className="col-span-7">Nama Pekerjaan</div>
                  <div className="col-span-2 text-right">Jumlah</div>
                  <div className="col-span-2 text-right">Persentase</div>
                </div>
                
                {sortedJobData.map((job: JobData, index: number) => {
                  const totalWorkers = sortedJobData.reduce((sum, j) => sum + j.jumlah, 0);
                  const percentage = ((job.jumlah / totalWorkers) * 100).toFixed(1);
                  
                  return (
                    <div 
                      key={index} 
                      className="grid grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {index + 1}
                      </div>
                      <div className="col-span-7 text-sm font-medium text-gray-900 dark:text-white">
                        {job.jenis}
                      </div>
                      <div className="col-span-2 text-sm font-bold text-right text-gray-900 dark:text-white">
                        {job.jumlah.toLocaleString("id-ID")}
                      </div>
                      <div className="col-span-2 text-sm text-right text-gray-600 dark:text-gray-400">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {sortedJobData.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-briefcase text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Tidak ada data pekerjaan
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Tidak ada pekerjaan dengan nilai lebih dari 0 untuk kategori {filter === 'semua' ? 'semua' : filter === 'laki_laki' ? 'laki-laki' : 'perempuan'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAllJobs(false)}
                className="px-4 py-[1px] text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
