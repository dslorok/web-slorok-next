"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import RegulationsContent from "@/components/regulations/regulations-content";

export default function PeraturanPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="pt-16 min-h-screen">
        <section className="gradient-bg py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Peraturan Desa</h1>
            <p className="text-xl opacity-90">
              Kumpulan dokumen peraturan yang berlaku di Desa Slorok.
            </p>
          </div>
        </section>

        <RegulationsContent />
      </main>
      <Footer />
    </div>
  );
}