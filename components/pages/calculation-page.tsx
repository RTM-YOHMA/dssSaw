"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { calculateSAW, formatScore } from "@/lib/saw-calculation"

interface Student {
  id: string
  name: string
  nisn: string
  class: number
  c1: number
  c2: number
  c3: number
  c4: number
}

interface CalculationPageProps {
  students: Student[]
}

export function CalculationPage({ students }: CalculationPageProps) {
  const [selectedClass, setSelectedClass] = useState<number>(10)
  const [isCalculated, setIsCalculated] = useState(false)

  const classStudents = students.filter((s) => s.class === selectedClass)

  const results = useMemo(() => {
    if (!isCalculated || classStudents.length === 0) return []
    return calculateSAW(classStudents)
  }, [classStudents, isCalculated])

  const handleCalculate = () => {
    if (classStudents.length === 0) {
      alert(`Mohon tambahkan data siswa untuk Kelas ${selectedClass} terlebih dahulu`)
      return
    }
    setIsCalculated(true)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-muted border-border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Metode SAW (Simple Additive Weighting)</h3>
            <p className="text-sm text-muted-foreground">
              Sistem ini menggunakan metode SAW dengan bobot: C1 (40%), C2 (30%), C3 (20%), C4 (10%)
            </p>
          </div>
          {/* Kelas Selector */}
          <div className="flex gap-2">
            {[10, 11, 12].map((classNum) => (
              <button
                key={classNum}
                onClick={() => {
                  setSelectedClass(classNum)
                  setIsCalculated(false)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedClass === classNum
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:bg-muted"
                }`}
              >
                Kelas {classNum}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Total siswa Kelas {selectedClass} yang siap dihitung: <strong>{classStudents.length}</strong>
        </p>
      </Card>

      {/* Calculate Button */}
      {!isCalculated && (
        <div className="flex justify-center">
          <Button
            onClick={handleCalculate}
            className="bg-primary hover:bg-accent text-primary-foreground font-semibold px-8"
            disabled={classStudents.length === 0}
          >
            Mulai Perhitungan SAW - Kelas {selectedClass}
          </Button>
        </div>
      )}

      {/* Results Table */}
      {isCalculated && results.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-primary">Hasil Perhitungan SAW - Kelas {selectedClass}</h3>
            <Button onClick={() => setIsCalculated(false)} variant="outline" className="border-border bg-transparent">
              Reset
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Nama</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">NISN</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Kelas</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">N1</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">N2</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">N3</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">N4</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Skor</th>
                </tr>
              </thead>
              <tbody>
                {results.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {student.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-foreground">{student.nisn}</td>
                    <td className="py-3 px-4 text-foreground">{student.class}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.n1.toFixed(3)}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.n2.toFixed(3)}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.n3.toFixed(3)}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.n4.toFixed(3)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded font-semibold">
                        {formatScore(student.score)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Siswa</p>
              <p className="text-2xl font-bold text-primary">{results.length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Skor Tertinggi</p>
              <p className="text-2xl font-bold text-primary">{formatScore(results[0]?.score || 0)}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Skor Terendah</p>
              <p className="text-2xl font-bold text-primary">{formatScore(results[results.length - 1]?.score || 0)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {isCalculated && results.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Tidak ada data siswa untuk dihitung di Kelas {selectedClass}</p>
          <Button onClick={() => setIsCalculated(false)} className="bg-primary hover:bg-accent text-primary-foreground">
            Kembali
          </Button>
        </Card>
      )}
    </div>
  )
}
