"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PopulationData {
  labels: string[];
  data: number[];
}

interface PopulationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PopulationData) => void;
  type: 'job' | 'education';
  initialData: PopulationData;
}

// Sample job list (in real app, this would come from database)
const AVAILABLE_JOBS = [
  "Belum Tidak Bekerja", "Mengurus Rumah Tangga", "Pelajar Mahasiswa", "Pensiunan",
  "Pegawai Negeri Sipil", "Tentara Nasional Indonesia", "Kepolisian RI", "Perdagangan",
  "Petani Pekebun", "Peternak", "Nelayan Perikanan", "Industri", "Konstruksi",
  "Transportasi", "Karyawan Swasta", "Karyawan BUMN", "Karyawan BUMD", "Karyawan Honorer",
  "Buruh Harian Lepas", "Buruh Tani Perkebunan", "Buruh Nelayan Perikanan", "Buruh Peternakan",
  "Pembantu Rumah Tangga", "Tukang Cukur", "Tukang Listrik", "Tukang Batu", "Tukang Kayu",
  "Tukang Sol Sepatu", "Tukang Las Pandai Besi", "Tukang Jahit", "Tukang Gigi", "Penata Rias",
  "Penata Busana", "Penata Rambut", "Mekanik", "Seniman", "Tabib", "Paraji", "Perancang Busana",
  "Penterjemah", "Imam Masjid", "Pendeta", "Pastor", "Wartawan", "Ustadz Mubaligh", "Juru Masak",
  "Promotor Acara", "Anggota DPR RI", "Anggota DPD RI", "Anggota BPK", "Presiden", "Wakil Presiden",
  "Anggota Mahkamah Konstitusi", "Anggota Kabinet Kementrian", "Duta Besar", "Gubernur", "Wakil Gubernur",
  "Bupati", "Wakil Bupati", "Walikota", "Wakil Walikota", "Anggota DPRD Prop", "Anggota DPRD Kab Kota",
  "Dosen", "Guru", "Pilot", "Pengacara", "Notaris", "Arsitek", "Akuntan", "Konsultan", "Dokter", "Bidan",
  "Perawat", "Apoteker", "Psikiater Psikolog", "Penyiar Televisi", "Penyiar Radio", "Pelaut", "Peneliti",
  "Sopir", "Pialang", "Paranormal", "Pedagang", "Perangkat Desa", "Kepala Desa", "Biarawan Biarawati",
  "Wiraswasta", "Anggota Lembaga Tinggi Lainnya", "Artis", "Atlit", "Cheff", "Manajer", "Tenaga Tata Usaha",
  "Operator", "Pekerja Pengolahan Kerajinan", "Teknisi", "Asisten Ahli", "Pekerjaan Lainnya", "Jumlah Total"
];

export default function PopulationEditModal({
  isOpen,
  onClose,
  onSave,
  type,
  initialData
}: PopulationEditModalProps) {
  const [data, setData] = useState<PopulationData>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemValue, setNewItemValue] = useState('');

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  const handleAddItem = () => {
    if (newItemLabel && newItemValue) {
      setData(prev => ({
        labels: [...prev.labels, newItemLabel],
        data: [...prev.data, parseInt(newItemValue)]
      }));
      setNewItemLabel('');
      setNewItemValue('');
    }
  };

  const handleUpdateItem = (index: number, label: string, value: string) => {
    setData(prev => ({
      labels: prev.labels.map((l, i) => i === index ? label : l),
      data: prev.data.map((d, i) => i === index ? parseInt(value) : d)
    }));
  };

  const handleDeleteItem = (index: number) => {
    setData(prev => ({
      labels: prev.labels.filter((_, i) => i !== index),
      data: prev.data.filter((_, i) => i !== index)
    }));
  };

  const filteredJobs = AVAILABLE_JOBS.filter(job => {
    const matchesSearch = job.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const selectJob = (job: string) => {
    setNewItemLabel(job);
    setShowJobDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Data {type === 'job' ? 'Pekerjaan' : 'Pendidikan'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add New Item */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Tambah Data Baru
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {type === 'job' ? 'Pekerjaan' : 'Tingkat Pendidikan'}
                </label>
                {type === 'job' ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={newItemLabel}
                      onChange={(e) => setNewItemLabel(e.target.value)}
                      onFocus={() => setShowJobDropdown(true)}
                      placeholder="Cari atau pilih pekerjaan..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                    />
                    {showJobDropdown && (
                      <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-64 overflow-y-auto z-10">
                        {/* Search and Filter */}
                        <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari pekerjaan..."
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        {/* Job List */}
                        <div className="max-h-48 overflow-y-auto">
                          {filteredJobs.map((job, index) => (
                            <div
                              key={index}
                              onClick={() => selectJob(job)}
                              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-900 dark:text-white"
                            >
                              {job}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    placeholder="Contoh: SD, SMP, SMA, S1..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jumlah
                </label>
                <input
                  type="number"
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddItem}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>

          {/* Existing Data */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Data Saat Ini
            </h3>
            <div className="space-y-2">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={label}
                        onChange={(e) => handleUpdateItem(index, e.target.value, data.data[index].toString())}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
                      />
                      <input
                        type="number"
                        value={data.data[index]}
                        onChange={(e) => handleUpdateItem(index, label, e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900 dark:text-white">{label}</span>
                      <span className="w-24 text-gray-900 dark:text-white">{data.data[index]}</span>
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
