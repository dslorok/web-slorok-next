"use client"

import { useState } from "react"
import Image from "next/image"
import BumdesSection from "./bumdes-section"
import MerahPutihSection from "./merah-putih-section"

export default function BumdesContent() {
  const [activeTab, setActiveTab] = useState("bumdes")

  const tabs = [
    {
      id: "bumdes",
      title: "Badan Usaha\nMilik Desa",
      icon: "/assets/img/Penduduk.png",
      component: BumdesSection,
    },
    {
      id: "merah-putih",
      title: "Koperasi\n Merah Putih",
      icon: "/assets/img/farmer.png",
      component: MerahPutihSection,
    }
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || BumdesSection

  return (
    <>
      {/* Tab Navigation */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-40 h-40 flex flex-col items-center justify-center font-semibold rounded-lg shadow-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? "gradient-bg"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <Image src={tab.icon || "/placeholder.svg"} alt={tab.title} width={40} height={40} className="mb-2" />
                <span className="text-center leading-tight whitespace-pre-line">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <div className="pb-16">
        <ActiveComponent />
      </div>
    </>
  )
}
