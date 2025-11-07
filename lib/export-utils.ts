// Export utilities for CSV and PDF
import ExcelJS from "exceljs"

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

interface NormalizedStudent extends Student {
  n1: number
  n2: number
  n3: number
  n4: number
  score: number
  rank: number
}

export async function exportToXLSX(results: NormalizedStudent[], filename = "hasil_saw.xlsx") {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Hasil Analisis SAW")

  // Set column widths
  worksheet.columns = [
    { header: "Peringkat", key: "rank", width: 12 },
    { header: "Nama", key: "name", width: 25 },
    { header: "NISN", key: "nisn", width: 15 },
    { header: "Kelas", key: "class", width: 10 },
    { header: "N1", key: "n1", width: 12 },
    { header: "N2", key: "n2", width: 12 },
    { header: "N3", key: "n3", width: 12 },
    { header: "N4", key: "n4", width: 12 },
    { header: "Skor SAW", key: "score", width: 15 },
  ]

  // Style header row
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0066CC" } }
  worksheet.getRow(1).alignment = { horizontal: "center", vertical: "center" }

  // Add data rows
  results.forEach((student) => {
    worksheet.addRow({
      rank: student.rank,
      name: student.name,
      nisn: student.nisn,
      class: student.class,
      n1: Number.parseFloat(student.n1.toFixed(3)),
      n2: Number.parseFloat(student.n2.toFixed(3)),
      n3: Number.parseFloat(student.n3.toFixed(3)),
      n4: Number.parseFloat(student.n4.toFixed(3)),
      score: Number.parseFloat((student.score * 100).toFixed(2)),
    })
  })

  for (let i = 2; i <= results.length + 1; i++) {
    const row = worksheet.getRow(i)
    row.alignment = { horizontal: "center", vertical: "center" }
    row.eachCell({ includeEmpty: false }, (cell) => {
      if (typeof cell.value === "general") {
        cell.numFmt = "0.00"
      }
    })
  }

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export results to JSON
export function exportToJSON(results: NormalizedStudent[], filename = "hasil_saw.json") {
  const data = {
    timestamp: new Date().toISOString(),
    totalStudents: results.length,
    results: results.map((student) => ({
      rank: student.rank,
      name: student.name,
      nisn: student.nisn,
      class: student.class,
      criteria: {
        c1: student.c1,
        c2: student.c2,
        c3: student.c3,
        c4: student.c4,
      },
      normalized: {
        n1: student.n1,
        n2: student.n2,
        n3: student.n3,
        n4: student.n4,
      },
      score: student.score,
      scorePercentage: (student.score * 100).toFixed(2),
    })),
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function exportStudentDataToXLSX(students: Student[], filename = "data_siswa.xlsx") {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Data Siswa")

  // Set column widths
  worksheet.columns = [
    { header: "Nama", key: "name", width: 25 },
    { header: "NISN", key: "nisn", width: 15 },
    { header: "Kelas", key: "class", width: 10 },
    { header: "C1: Rapor", key: "c1", width: 15 },
    { header: "C2: Ujian", key: "c2", width: 15 },
    { header: "C3: Prestasi", key: "c3", width: 15 },
    { header: "C4: Kehadiran", key: "c4", width: 15 },
  ]

  // Style header row
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0066CC" } }
  worksheet.getRow(1).alignment = { horizontal: "center", vertical: "center" }

  // Add data rows
  students.forEach((student) => {
    worksheet.addRow({
      name: student.name,
      nisn: student.nisn,
      class: student.class,
      c1: student.c1,
      c2: student.c2,
      c3: student.c3,
      c4: student.c4,
    })
  })

  for (let i = 2; i <= students.length + 1; i++) {
    const row = worksheet.getRow(i)
    row.alignment = { horizontal: "center", vertical: "center" }
    row.eachCell({ includeEmpty: false }, (cell) => {
      if (typeof cell.value === "number") {
        cell.numFmt = "0.00"
      }
    })
  }

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
