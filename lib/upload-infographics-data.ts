import { auth, db } from "@/lib/firebase"
import { collection, setDoc, doc } from "firebase/firestore"

// Population Data Structure
const populationData = {
  summary: {
    total: 8598,
    male: 4317,
    female: 4281
  },
  religion: [
    { name: "Islam", count: 8285, icon: "fas fa-mosque" },
    { name: "Kristen", count: 22, icon: "fas fa-church" },
    { name: "Katolik", count: 268, icon: "fas fa-bible" },
    { name: "Hindu", count: 23, icon: "fas fa-om" },
    { name: "Buddha", count: 0, icon: "fas fa-dharmachakra" },
    { name: "Konghucu", count: 0, icon: "fas fa-yin-yang" },
    { name: "Kepercayaan Lainnya", count: 0, icon: "fas fa-pray" },
    { name: "Aliran Kepercayaan", count: 0, icon: "fas fa-praying-hands" }
  ],
  jobs: {
    semua: [
      { jenis: "BELUM/TIDAK BEKERJA", jumlah: 269 },
      { jenis: "MENGURUS RUMAH TANGGA", jumlah: 269 },
      { jenis: "PELAJAR/MAHASISWA", jumlah: 323 },
      { jenis: "PETANI/PEKEBUN", jumlah: 38 },
      { jenis: "NELAYAN/PERIKANAN", jumlah: 51 },
      { jenis: "KARYAWAN SWASTA", jumlah: 117 },
      { jenis: "WIRASWASTA", jumlah: 27 }
    ],
    laki_laki: [
      { jenis: "BELUM/TIDAK BEKERJA", jumlah: 130 },
      { jenis: "PELAJAR/MAHASISWA", jumlah: 170 },
      { jenis: "PETANI/PEKEBUN", jumlah: 35 },
      { jenis: "NELAYAN/PERIKANAN", jumlah: 50 },
      { jenis: "KARYAWAN SWASTA", jumlah: 90 },
      { jenis: "WIRASWASTA", jumlah: 25 }
    ],
    perempuan: [
      { jenis: "BELUM/TIDAK BEKERJA", jumlah: 139 },
      { jenis: "MENGURUS RUMAH TANGGA", jumlah: 260 },
      { jenis: "PELAJAR/MAHASISWA", jumlah: 153 },
      { jenis: "PETANI/PEKEBUN", jumlah: 3 },
      { jenis: "NELAYAN/PERIKANAN", jumlah: 1 },
      { jenis: "KARYAWAN SWASTA", jumlah: 27 },
      { jenis: "WIRASWASTA", jumlah: 2 }
    ]
  },
  education: {
    labels: [
      "Tidak/Belum Sekolah",
      "Belum Tamat SD/Sederajat",
      "Tamat SD/Sederajat",
      "SLTP/Sederajat",
      "SLTA/Sederajat",
      "Diploma I/II",
      "Diploma III/Sarjana Muda",
      "Diploma IV/Strata I",
      "Strata II",
      "Strata III"
    ],
    data: [173, 201, 285, 140, 286, 22, 13, 26, 2, 0]
  }
}

// Agriculture Data Structure
const agricultureData = {
  years: ["2018", "2019", "2020", "2021", "2022"],
  livestock: {
    labels: ["2018", "2019", "2020", "2021", "2022"],
    sapi: [1235, 1236, 1240, 1240, 1240],
    kambing: [153, 155, 160, 160, 160],
    ayam: [1720, 1700, 1750, 1750, 1750]
  },
  plantation: {
    labels: ["2018", "2019", "2020", "2021", "2022"],
    kelapa: [2, 2, 2, 2, 2],
    karet: [0, 0, 0, 0, 0],
    kopi: [0, 0, 0, 0, 0]
  },
  foodCrop: {
    labels: ["2018", "2019", "2020", "2021", "2022"],
    padi: [118, 120, 120, 120, 120],
    jagung: [93, 96, 96, 96, 96],
    kacang_tanah: [5, 5, 5, 5, 5],
    tomat: [13, 15, 15, 15, 15],
    cabe: [24, 25, 25, 25, 25]
  }
}

// Budget Data Structure
const budgetData = {
  year: 2024,
  summary: {
    pendapatan: 2414959700,
    belanja: 2776567200
  },
  revenue: {
    labels: ["Pendapatan Asli Desa", "Pendapatan Transfer", "Pendapatan Lain-lain"],
    data: [325310200, 2089649500, 0]
  },
  expenditure: {
    labels: [
      "Penyelenggaraan Pemerintahan Desa",
      "Pelaksanaan Pembangunan Desa", 
      "Pembinaan Kemasyarakatan",
      "Pemberdayaan Masyarakat Desa",
      "Penanggulangan Bencana, Keadaan Darurat dan Mendesak"
    ],
    data: [1123785756.34, 1187744000, 73627444, 218317000, 173093000]
  }
}

// Tabs Configuration
const tabs = [
  {
    id: "population",
    title: "Data Penduduk",
    icon: "/assets/img/Penduduk.png",
    component: "PopulationData"
  },
  {
    id: "agriculture", 
    title: "Data Potensi\nPertanian",
    icon: "/assets/img/farmer.png",
    component: "AgricultureData"
  },
  {
    id: "budget",
    title: "Data APBD Desa",
    icon: "/assets/img/money.png", 
    component: "BudgetData"
  }
]

const news = [
    {
      "id": 1,
      "title": "Pembangunan Jalan Desa Tahap II Dimulai",
      "excerpt": "Proyek pembangunan jalan desa tahap kedua telah dimulai dengan target penyelesaian dalam 3 bulan ke depan.",
      "content": "Desa Slorok kembali melanjutkan program pembangunan infrastruktur dengan memulai proyek jalan desa tahap kedua. Proyek ini merupakan kelanjutan dari pembangunan tahap pertama yang telah berhasil diselesaikan tahun lalu. Dengan anggaran sebesar Rp 2,5 miliar yang bersumber dari Dana Desa dan APBD Kabupaten, pembangunan ini diharapkan dapat meningkatkan aksesibilitas warga menuju pusat desa dan fasilitas umum lainnya. Kepala Desa menyampaikan bahwa proyek ini akan melibatkan tenaga kerja lokal untuk memberikan dampak ekonomi langsung bagi masyarakat desa.",
      "image": "/assets/img/desa.jpg",
      "date": "2024-01-15",
      "author": "Tim Redaksi Desa"
    },
    {
      "id": 2,
      "title": "Program Pelatihan Keterampilan untuk Ibu-Ibu PKK",
      "excerpt": "Dinas Pemberdayaan Masyarakat mengadakan pelatihan membuat kerajinan tangan untuk meningkatkan ekonomi keluarga.",
      "content": "Sebanyak 50 ibu-ibu anggota PKK Desa Slorok mengikuti program pelatihan keterampilan membuat kerajinan tangan yang diselenggarakan selama 5 hari. Pelatihan ini bertujuan untuk meningkatkan keterampilan dan membuka peluang usaha bagi para ibu rumah tangga. Materi pelatihan meliputi pembuatan tas rajut, bros kain flanel, dan aksesoris dari bahan daur ulang. Instruktur pelatihan didatangkan langsung dari Dinas Perindustrian Kabupaten. Diharapkan setelah pelatihan ini, para peserta dapat mengembangkan usaha kecil di rumah masing-masing dan meningkatkan pendapatan keluarga.",
      "image": "/assets/img/desa.jpg",
      "date": "2024-01-10",
      "author": "Siti Aminah"
    },
    {
      "id": 3,
      "title": "Panen Raya Padi Musim Tanam Pertama",
      "excerpt": "Petani desa merayakan hasil panen yang melimpah dengan produktivitas meningkat 15% dibanding tahun lalu.",
      "content": "Musim panen raya padi periode pertama tahun 2024 di Desa Slorok menunjukkan hasil yang sangat menggembirakan. Total luas lahan yang dipanen mencapai 450 hektar dengan rata-rata produktivitas 6,2 ton per hektar, meningkat 15% dibandingkan periode yang sama tahun lalu. Keberhasilan ini tidak lepas dari program pendampingan teknis dari Penyuluh Pertanian Lapangan (PPL) dan penggunaan benih unggul serta pupuk bersubsidi. Kepala Kelompok Tani menyampaikan rasa syukur dan berharap hasil ini dapat terus dipertahankan pada musim tanam berikutnya. Sebagian hasil panen akan dijual ke Bulog dengan harga yang menguntungkan petani.",
      "image": "/assets/img/desa.jpg",
      "date": "2024-01-08",
      "author": "Budi Santoso"
    },
    {
      "id": 4,
      "title": "Gotong Royong Pembersihan Sungai Desa",
      "excerpt": "Seluruh warga bergotong royong membersihkan sungai untuk menjaga kelestarian lingkungan dan mencegah banjir.",
      "content": "Kegiatan gotong royong pembersihan Sungai Jernih yang melintasi Desa Slorok diikuti oleh lebih dari 200 warga dari berbagai kalangan. Kegiatan yang berlangsung selama sehari penuh ini berhasil mengangkat sampah seberat 2 ton dan membersihkan gulma yang menyumbat aliran sungai. Kepala Desa menekankan pentingnya menjaga kebersihan sungai untuk mencegah banjir saat musim hujan dan melestarikan ekosistem air. Selain pembersihan, warga juga menanam pohon bambu di sepanjang bantaran sungai sebagai upaya konservasi. Kegiatan ini akan dijadikan program rutin setiap 3 bulan sekali dengan melibatkan seluruh elemen masyarakat.",
      "image": "/assets/img/desa.jpg",
      "date": "2024-01-05",
      "author": "Ahmad Wijaya"
    },
    {
      "id": 5,
      "title": "Launching Website Resmi Desa Slorok",
      "excerpt": "Desa Slorok resmi meluncurkan website untuk meningkatkan transparansi dan pelayanan kepada masyarakat.",
      "content": "Dalam rangka meningkatkan transparansi pemerintahan dan kualitas pelayanan publik, Pemerintah Desa Slorok resmi meluncurkan website resmi desa. Website ini menyediakan berbagai informasi mulai dari profil desa, berita terkini, data statistik, hingga layanan online untuk masyarakat. Melalui website ini, warga dapat mengakses informasi APBDes, program-program desa, dan mengajukan permohonan surat-surat secara online. Kepala Desa berharap dengan adanya website ini, komunikasi antara pemerintah desa dan masyarakat menjadi lebih efektif dan transparan. Website dapat diakses 24 jam dan akan terus diperbarui dengan informasi terbaru.",
      "image": "/assets/img/desa.jpg",
      "date": "2024-01-03",
      "author": "Tim IT Desa"
    },
    {
      "id": 6,
      "title": "Posyandu Balita Raih Penghargaan Terbaik",
      "excerpt": "Posyandu Melati Desa Slorok meraih penghargaan sebagai posyandu terbaik tingkat kabupaten.",
      "content": "Posyandu Melati yang berlokasi di Dusun Mawar, Desa Slorok, berhasil meraih penghargaan sebagai Posyandu Terbaik tingkat Kabupaten Sentosa tahun 2024. Penghargaan ini diberikan berdasarkan penilaian terhadap kelengkapan sarana prasarana, keaktifan kader, cakupan pelayanan, dan inovasi program. Posyandu Melati melayani 150 balita dan 80 ibu hamil dengan tingkat partisipasi mencapai 95%. Inovasi yang dikembangkan antara lain program 'Hari Gizi Seimbang' dan 'Kelas Ibu Hamil' yang mendapat apresiasi tinggi dari tim penilai. Kepala Puskesmas menyampaikan bahwa keberhasilan ini menjadi contoh bagi posyandu lain di wilayah kabupaten.",
      "image": "/assets/img/desa.jpg",
      "date": "2024-01-01",
      "author": "Dr. Sari Indah"
    },
  ]

// Upload Functions
export async function uploadPopulationData() {
  try {
    await setDoc(doc(db, "infographics", "population"), populationData)
    console.log("Population data uploaded successfully")
  } catch (error) {
    console.error("Error uploading population data:", error)
    throw error
  }
}

export async function uploadAgricultureData() {
  try {
    await setDoc(doc(db, "infographics", "agriculture"), agricultureData)
    console.log("Agriculture data uploaded successfully")
  } catch (error) {
    console.error("Error uploading agriculture data:", error)
    throw error
  }
}

export async function uploadBudgetData() {
  try {
    await setDoc(doc(db, "infographics", "budget"), budgetData)
    console.log("Budget data uploaded successfully")
  } catch (error) {
    console.error("Error uploading budget data:", error)
    throw error
  }
}

export async function uploadNews() {
  try {
    for (const galery of news) {
      await setDoc(doc(db, "news", "gallery"), {
        id : galery.id,
        title: galery.title,
        excerpt : galery.excerpt,
        content: galery.content,
        image: galery.image,
        date: galery.date,
        author: galery.author
      })
    }
    console.log("News uploaded successfully")
  } catch (error) {
    console.error("Error uploading news:", error)
    throw error
  }
}

export async function uploadTabs() {
  try {
    for (const tab of tabs) {
      await setDoc(doc(db, "tabs", tab.id), {
        title: tab.title,
        icon: tab.icon,
        component: tab.component
      })
    }
    console.log("Tabs uploaded successfully")
  } catch (error) {
    console.error("Error uploading tabs:", error)
    throw error
  }
}

// Upload All Infographics Data
export async function uploadAllInfographicsData() {
  try {
    console.log("Starting infographics data upload...")
    
    await uploadTabs()
    await uploadPopulationData()
    await uploadAgricultureData()
    await uploadBudgetData()
    await uploadNews()
    
    console.log("All infographics data uploaded successfully!")
  } catch (error) {
    console.error("Error uploading infographics data:", error)
    throw error
  }
}

// Individual data export for components to use
export { populationData, agricultureData, budgetData, tabs, news}
