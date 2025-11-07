"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputDataPage } from "./pages/input-data-page"
import { CalculationPage } from "./pages/calculation-page"
import { ResultsPage } from "./pages/results-page"

interface DashboardProps {
  onLogout: () => void
}

type Page = "home" | "input" | "calculation" | "results"

interface Student {
  id: string
  name: string
  nisn: string
  class: string
  c1: number
  c2: number
  c3: number
  c4: number
}

const STORAGE_KEY = "dss_students_data"

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [students, setStudents] = useState<Student[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        setStudents(JSON.parse(savedData))
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
    }
  }, [students, isLoaded])

  const handleLogout = () => {
    onLogout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sistem Penunjang Keputusan</h1>
            <p className="text-sm text-primary-foreground/80">
              Penentuan Siswa Berprestasi Akademik SMK Kanisius Ungaran
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-secondary text-secondary-foreground shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4 flex-wrap">
          <Button
            onClick={() => setCurrentPage("home")}
            variant={currentPage === "home" ? "default" : "ghost"}
            className={
              currentPage === "home"
                ? "bg-accent text-accent-foreground"
                : "text-secondary-foreground hover:bg-secondary/80"
            }
          >
            Beranda
          </Button>
          <Button
            onClick={() => setCurrentPage("input")}
            variant={currentPage === "input" ? "default" : "ghost"}
            className={
              currentPage === "input"
                ? "bg-accent text-accent-foreground"
                : "text-secondary-foreground hover:bg-secondary/80"
            }
          >
            Input Data
          </Button>
          <Button
            onClick={() => setCurrentPage("calculation")}
            variant={currentPage === "calculation" ? "default" : "ghost"}
            className={
              currentPage === "calculation"
                ? "bg-accent text-accent-foreground"
                : "text-secondary-foreground hover:bg-secondary/80"
            }
          >
            Perhitungan
          </Button>
          <Button
            onClick={() => setCurrentPage("results")}
            variant={currentPage === "results" ? "default" : "ghost"}
            className={
              currentPage === "results"
                ? "bg-accent text-accent-foreground"
                : "text-secondary-foreground hover:bg-secondary/80"
            }
          >
            Hasil
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === "home" && (
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-primary mb-4">Selamat Datang</h2>
            <p className="text-foreground mb-4 leading-relaxed">
              Sistem Penunjang Keputusan (DSS) ini dirancang untuk membantu SMK Kanisius Ungaran dalam menentukan siswa
              berprestasi akademik menggunakan metode Simple Additive Weighting (SAW).
            </p>
            <p className="text-foreground mb-6 leading-relaxed">Sistem ini menganalisis empat kriteria utama:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">C1: Nilai Rata-rata Rapor (40%)</h3>
                <p className="text-sm text-muted-foreground">Nilai akademik utama siswa</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">C2: Nilai Ujian Sekolah (30%)</h3>
                <p className="text-sm text-muted-foreground">Hasil ujian sekolah siswa</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">C3: Prestasi Non-Akademik (20%)</h3>
                <p className="text-sm text-muted-foreground">Jumlah piagam dan sertifikat</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">C4: Kehadiran (10%)</h3>
                <p className="text-sm text-muted-foreground">Persentase kehadiran siswa</p>
              </div>
            </div>
          </Card>
        )}

        {currentPage === "input" && <InputDataPage students={students} setStudents={setStudents} />}

        {currentPage === "calculation" && <CalculationPage students={students} />}

        {currentPage === "results" && <ResultsPage students={students} />}
      </main>
    </div>
  )
}
