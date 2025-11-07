"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Student {
  id: string
  name: string
  nisn: string
  class: number // ubah dari string ke number untuk konsistensi
  c1: number
  c2: number
  c3: number
  c4: number
}

interface InputDataPageProps {
  students: Student[]
  setStudents: (students: Student[]) => void
}

export function InputDataPage({ students, setStudents }: InputDataPageProps) {
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string>("")
  const [selectedClassFilter, setSelectedClassFilter] = useState<number>(10) // ubah dari string ke number
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    nisn: "",
    class: undefined, // ubah default value
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setError("")
    setFormData((prev) => ({
      ...prev,
      [name]: name === "class" ? Number.parseInt(value) : name.startsWith("c") ? Number.parseFloat(value) || 0 : value, // parse class sebagai number
    }))
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("[v0] Form Data:", formData)
    console.log("[v0] Current Students:", students)

    if (!formData.name || !formData.nisn || formData.class === undefined) {
      setError("Mohon isi semua field yang diperlukan")
      return
    }

    const nisnExists = students.some((s) => s.nisn === formData.nisn && s.id !== editingId)
    if (nisnExists) {
      setError("NISN sudah terdaftar. Gunakan NISN yang berbeda.")
      return
    }

    if (editingId) {
      setStudents(students.map((s) => (s.id === editingId ? { ...s, ...formData } : s)))
      setEditingId(null)
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: formData.name || "",
        nisn: formData.nisn || "",
        class: formData.class || 10, // pastikan class selalu number
        c1: formData.c1 || 0,
        c2: formData.c2 || 0,
        c3: formData.c3 || 0,
        c4: formData.c4 || 0,
      }
      console.log("[v0] New Student Added:", newStudent)
      setStudents([...students, newStudent])
    }

    setActiveTab("manage")
    setSelectedClassFilter(formData.class || 10) // pastikan filter juga number

    setFormData({
      name: "",
      nisn: "",
      class: undefined,
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
    })
  }

  const handleEditStudent = (student: Student) => {
    setFormData(student)
    setEditingId(student.id)
    setActiveTab("add")
    setError("")
  }

  const handleDeleteStudent = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      setStudents(students.filter((s) => s.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      nisn: "",
      class: undefined,
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
    })
    setEditingId(null)
    setError("")
  }

  const filteredStudents = students.filter((s) => s.class === selectedClassFilter) // sekarang keduanya number, akan cocok

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "add"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Plus className="inline mr-2 h-4 w-4" />
          {editingId ? "Edit Data Siswa" : "Tambah Data Siswa"}
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "manage"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Kelola Data ({students.length})
        </button>
      </div>

      {/* Add/Edit Form */}
      {activeTab === "add" && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-primary mb-6">
            {editingId ? "Edit Data Siswa" : "Tambah Data Siswa Baru"}
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleAddStudent} className="space-y-6">
            {/* Student Info Section */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Informasi Siswa</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nama Siswa *</label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama siswa"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">NISN *</label>
                  <Input
                    type="text"
                    name="nisn"
                    placeholder="Masukkan NISN"
                    value={formData.nisn || ""}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    NISN harus unik dan tidak boleh sama dengan siswa lain
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Kelas *</label>
                  <select
                    name="class"
                    value={formData.class || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="10">Kelas 10</option>
                    <option value="11">Kelas 11</option>
                    <option value="12">Kelas 12</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Criteria Section */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Kriteria Penilaian</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    C1: Nilai Rata-rata Rapor (0-100)
                  </label>
                  <Input
                    type="number"
                    name="c1"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.c1 || ""}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    C2: Nilai Ujian Sekolah (0-100)
                  </label>
                  <Input
                    type="number"
                    name="c2"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.c2 || ""}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    C3: Prestasi Non-Akademik (0-100)
                  </label>
                  <Input
                    type="number"
                    name="c3"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.c3 || ""}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">C4: Kehadiran (0-100)</label>
                  <Input
                    type="number"
                    name="c4"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.c4 || ""}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-accent text-primary-foreground font-semibold">
                {editingId ? "Perbarui Data" : "Tambah Siswa"}
              </Button>
              {editingId && (
                <Button type="button" onClick={handleCancel} variant="outline" className="border-border bg-transparent">
                  Batal
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* Manage Data */}
      {activeTab === "manage" && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-primary">Kelola Data Siswa</h3>
            {/* Filter kelas */}
            <div className="flex gap-2">
              {[10, 11, 12].map(
                (
                  classNum, // ubah ke number
                ) => (
                  <button
                    key={classNum}
                    onClick={() => setSelectedClassFilter(classNum)} // set sebagai number
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedClassFilter === classNum
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Kelas {classNum}
                  </button>
                ),
              )}
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Belum ada data siswa di Kelas {selectedClassFilter}</p>
              <Button
                onClick={() => setActiveTab("add")}
                className="bg-primary hover:bg-accent text-primary-foreground"
              >
                Tambah Data Siswa
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Nama</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">NISN</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Kelas</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">C1</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">C2</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">C3</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">C4</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{student.name}</td>
                      <td className="py-3 px-4 text-foreground">{student.nisn}</td>
                      <td className="py-3 px-4 text-foreground">Kelas {student.class}</td>
                      <td className="py-3 px-4 text-center text-foreground">{student.c1}</td>
                      <td className="py-3 px-4 text-center text-foreground">{student.c2}</td>
                      <td className="py-3 px-4 text-center text-foreground">{student.c3}</td>
                      <td className="py-3 px-4 text-center text-foreground">{student.c4}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-2 hover:bg-primary/10 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-primary" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 hover:bg-destructive/10 rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
