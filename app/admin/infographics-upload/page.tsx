"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { 
  uploadPopulationData, 
  uploadAgricultureData, 
  uploadBudgetData, 
  uploadTabs,
  uploadNews,
  uploadAllInfographicsData
} from '@/lib/upload-infographics-data'

export default function InfographicsUploadPage() {
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  const handleUpload = async (uploadFunction: () => Promise<void>, dataType: string) => {
    setLoading(true)
    setMessage('')
    
    try {
      await uploadFunction()
      setMessage(`✅ ${dataType} uploaded successfully!`)
    } catch (error) {
      setMessage(`❌ Error uploading ${dataType}: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const uploadOptions = [
    {
      title: "Population Data",
      description: "Upload population statistics, religion data, jobs, and education data",
      action: () => handleUpload(uploadPopulationData, "Population Data"),
      icon: "fas fa-users"
    },
    {
      title: "Agriculture Data", 
      description: "Upload livestock, plantation, and food crop data for 2018-2022",
      action: () => handleUpload(uploadAgricultureData, "Agriculture Data"),
      icon: "fas fa-seedling"
    },
    {
      title: "Budget Data",
      description: "Upload APBD 2024 revenue and expenditure data",
      action: () => handleUpload(uploadBudgetData, "Budget Data"),
      icon: "fas fa-chart-pie"
    },
    {
      title: "Tabs Configuration",
      description: "Upload infographics tabs configuration",
      action: () => handleUpload(uploadTabs, "Tabs Configuration"),
      icon: "fas fa-tabs"
    },
     {
      title: "News Configuration",
      description: "Upload infographics news configuration",
      action: () => handleUpload(uploadNews, "News Configuration"),
      icon: "fas fa-cat"
    },
    {
      title: "Upload All Data",
      description: "Upload all infographics data at once",
      action: () => handleUpload(uploadAllInfographicsData, "All Infographics Data"),
      icon: "fas fa-cloud-upload-alt",
      primary: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Infographics Data Upload
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload infographics data to Firebase Firestore
          </p>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadOptions.map((option, index) => (
            <div 
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border ${
                option.primary ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  option.primary ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <i className={`${option.icon} text-xl`}></i>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {option.title}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                {option.description}
              </p>
              
              <button
                onClick={option.action}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  option.primary
                    ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                } disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  `Upload ${option.title}`
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-info-circle text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Firebase Collections Structure
              </h3>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p><strong>infographics/population</strong> - Population, religion, jobs, education data</p>
                <p><strong>infographics/agriculture</strong> - Livestock, plantation, food crop data</p>
                <p><strong>infographics/budget</strong> - APBD revenue and expenditure data</p>
                <p><strong>tabs/[id]</strong> - Infographics tabs configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
