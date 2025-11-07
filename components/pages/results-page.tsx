"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { calculateSAW, formatScore, getTopStudents } from "@/lib/saw-calculation"
import { exportToJSON, exportToXLSX } from "@/lib/export-utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download } from "lucide-react"

interface Student {
  id: string
  name: string
  nisn: string
  class: number // ubah dari string ke number untuk konsistensi dengan input-data-page
  c1: number
  c2: number
  c3: number
  c4: number
}

interface ResultsPageProps {
  students: Student[]
}

const CustomTooltip = ({ active, payload, label, borderColor = "#0066cc" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-lg shadow-lg border-2"
        style={{
          backgroundColor: "#ffffff",
          borderColor: borderColor,
        }}
      >
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ResultsPage({ students }: ResultsPageProps) {
  const [selectedClass, setSelectedClass] = useState<number>(10) // ubah dari string ke number
  const classStudents = students.filter((s) => s.class === selectedClass)

  const results = useMemo(() => {
    if (classStudents.length === 0) return []
    const calculated = calculateSAW(classStudents)
    return getTopStudents(calculated, 10)
  }, [classStudents])

  const chartData = useMemo(() => {
    return results.map((student) => ({
      name: student.name.substring(0, 15),
      score: Number.parseFloat((student.score * 100).toFixed(2)),
      rank: student.rank,
    }))
  }, [results])

  const criteriaData = useMemo(() => {
    if (students.length === 0) return []
    const avgC1 = students.reduce((sum, s) => sum + s.c1, 0) / students.length
    const avgC2 = students.reduce((sum, s) => sum + s.c2, 0) / students.length
    const avgC3 = students.reduce((sum, s) => sum + s.c3, 0) / students.length
    const avgC4 = students.reduce((sum, s) => sum + s.c4, 0) / students.length

    return [
      { name: "C1: Rapor(40%)", value: Number.parseFloat(avgC1.toFixed(2)) },
      { name: "C2: Ujian(30%)", value: Number.parseFloat(avgC2.toFixed(2)) },
      { name: "C3: Prestasi(20%)", value: Number.parseFloat(avgC3.toFixed(2)) },
      { name: "C4: Kehadiran(10%)", value: Number.parseFloat(avgC4.toFixed(2)) },
    ]
  }, [students])

  const topStudentCriteria = useMemo(() => {
    if (results.length === 0) return []
    const topStudent = results[0]
    return [
      { criteria: "C1: Rapor", value: topStudent.c1, normalized: Number.parseFloat((topStudent.n1 * 100).toFixed(2)) },
      { criteria: "C2: Ujian", value: topStudent.c2, normalized: Number.parseFloat((topStudent.n2 * 100).toFixed(2)) },
      {
        criteria: "C3: Prestasi",
        value: topStudent.c3,
        normalized: Number.parseFloat((topStudent.n3 * 100).toFixed(2)),
      },
      {
        criteria: "C4: Kehadiran",
        value: topStudent.c4,
        normalized: Number.parseFloat((topStudent.n4 * 100).toFixed(2)),
      },
    ]
  }, [results])

  const COLORS = ["#0066cc", "#0080ff", "#3399ff", "#66b3ff"]

  const handleExportXLSX = async () => {
    await exportToXLSX(results, `hasil_saw_kelas_${selectedClass}_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportJSON = () => {
    exportToJSON(results, `hasil_saw_kelas_${selectedClass}_${new Date().toISOString().split("T")[0]}.json`)
  }

  if (students.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Hasil Analisis</h2>
        <p className="text-muted-foreground">Belum ada data siswa untuk dianalisis</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-primary text-primary-foreground">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Hasil Analisis SAW - Kelas {selectedClass}</h2>
            <p className="text-sm text-primary-foreground/80">
              Peringkat siswa berdasarkan metode Simple Additive Weighting dengan visualisasi komprehensif
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {[10, 11, 12].map(
                (
                  classNum, // ubah dari string ke number
                ) => (
                  <button
                    key={classNum}
                    onClick={() => setSelectedClass(classNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedClass === classNum
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                    }`}
                  >
                    Kelas {classNum}
                  </button>
                ),
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportXLSX}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                XLSX
              </Button>
              <Button
                onClick={handleExportJSON}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                JSON
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Siswa Kelas {selectedClass}</p>
          <p className="text-3xl font-bold text-primary">{classStudents.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Skor Tertinggi</p>
          <p className="text-3xl font-bold text-primary">{formatScore(results[0]?.score || 0)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Skor Terendah (Top 10)</p>
          <p className="text-3xl font-bold text-primary">{formatScore(results[results.length - 1]?.score || 0)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Rata-rata Skor</p>
          <p className="text-3xl font-bold text-primary">
            {formatScore(results.reduce((sum, s) => sum + s.score, 0) / (results.length || 1) || 0)}
          </p>
        </Card>
      </div>

      {/* Top Students Bar Chart */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-6">
          Grafik Skor 10 Siswa Terbaik - Kelas {selectedClass}
        </h3>
        {results.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip borderColor="#0066cc" />} cursor={{ fill: "rgba(0, 102, 204, 0.1)" }} />
              <Legend />
              <Bar dataKey="score" fill="#0066cc" name="Skor SAW" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground py-8">Tidak ada data untuk Kelas {selectedClass}</p>
        )}
      </Card>

      {/* Criteria Distribution */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Criteria Chart */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-primary mb-6">
              Rata-rata Nilai Kriteria - Kelas {selectedClass}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={criteriaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" angle={-25} textAnchor="end" height={80} />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  content={<CustomTooltip borderColor="#00a86b" />}
                  cursor={{ fill: "rgba(0, 168, 107, 0.1)" }}
                />
                <Bar dataKey="value" fill="#00a86b" name="Nilai Rata-rata" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Criteria Distribution Pie Chart */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-primary mb-6">Distribusi Bobot Kriteria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "C1: Rapor (40%)", value: 40 },
                    { name: "C2: Ujian (30%)", value: 30 },
                    { name: "C3: Prestasi (20%)", value: 20 },
                    { name: "C4: Kehadiran (10%)", value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Top Student Criteria Comparison */}
      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-primary mb-6">
            Perbandingan Kriteria - Siswa Terbaik Kelas {selectedClass}: {results[0].name}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topStudentCriteria}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="criteria" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip borderColor="#0066cc" />} cursor={{ fill: "rgba(0, 102, 204, 0.1)" }} />
              <Legend />
              <Bar dataKey="value" fill="#0066cc" name="Nilai Asli" radius={[8, 8, 0, 0]} />
              <Bar dataKey="normalized" fill="#ff9500" name="Nilai Normalisasi (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Top Students Table */}
      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-primary mb-6">10 Siswa Terbaik - Kelas {selectedClass}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Peringkat</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Nama Siswa</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">NISN</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Kelas</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Skor SAW</th>
                </tr>
              </thead>
              <tbody>
                {results.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {student.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-foreground">{student.nisn}</td>
                    <td className="py-3 px-4 text-foreground">{student.class}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold">
                        {formatScore(student.score)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {results.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Belum ada data siswa untuk dianalisis di Kelas {selectedClass}</p>
        </Card>
      )}
    </div>
  )
}
