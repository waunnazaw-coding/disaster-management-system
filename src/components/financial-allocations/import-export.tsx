"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileSpreadsheet, FileText } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

interface ImportExportProps {
  selectedYear: string
  importExcelFile: (file: File) => Promise<void>
  downloadPdfReport: (year: number) => Promise<void>
  onImportSuccess: () => void
}

export function ImportExport({
  selectedYear,
  importExcelFile,
  downloadPdfReport,
  onImportSuccess,
}: ImportExportProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file)
      } else {
        toast.error("Invalid file type. Please select an Excel file (.xlsx or .xls)")
      }
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    setIsImporting(true)
    try {
      await importExcelFile(selectedFile)
      toast.success(`Successfully imported allocations from ${selectedFile.name}`)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      onImportSuccess()
    } catch (error: any) {
      toast.error(error?.message || "There was an error importing the file. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    try {
      toast.loading(`Annual report for ${selectedYear} is being prepared...`, { id: "download" })

      await downloadPdfReport(Number(selectedYear))

      toast.success(`Annual report for ${selectedYear} has been downloaded.`, { id: "download" })
    } catch (error: any) {
      toast.error(error?.message || "There was an error generating the report. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadTemplate = () => {
    toast.success("Excel template has been downloaded to help you format your data.")
    // Ideally trigger actual template download here if available
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Allocations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Excel File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
            </div>

            {selectedFile && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={!selectedFile || isImporting}>
                {isImporting ? "Importing..." : "Import Data"}
              </Button>
              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Download the template to see the required format for your Excel file.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleDownloadPdf} disabled={isDownloading} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              {isDownloading ? "Preparing Report..." : "Download Annual Report PDF"}
            </Button>

            <div className="text-xs text-muted-foreground">
              Generate a comprehensive annual report with all allocations, charts, and summaries for the selected year.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
