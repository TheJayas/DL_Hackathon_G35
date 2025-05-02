"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, UploadIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Upload() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      handleFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      handleFile(selectedFile)
    }
  }

  const handleFile = (selectedFile: File) => {
    // Check if file is PDF, PNG, or JPG
    const fileType = selectedFile.type
    if (fileType === "application/pdf" || fileType === "image/png" || fileType === "image/jpeg") {
      setFile(selectedFile)
    } else {
      alert("Please upload a PDF, PNG, or JPG file.")
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsUploading(false)
      router.push(`/results?fileName=${encodeURIComponent(file.name)}`)
    }, 1500)
  }

  return (
    <Card
      className={`border-2 ${isDragging ? "border-[#1E3A8A] border-dashed" : "border-gray-200"} shadow-lg transition-all duration-200 hover:shadow-xl`}
    >
      <CardContent className="p-8">
        <div
          className="flex flex-col items-center justify-center gap-6 py-10 bg-gradient-to-b from-white to-gray-50 rounded-lg"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="rounded-full bg-[#1E3A8A]/10 p-6">
            <FileUp className="h-12 w-12 text-[#1E3A8A]" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#1E3A8A]">Upload Your Document</h3>
            <p className="text-sm text-gray-500 mt-2">Drag & drop your file here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supports PDF, PNG, and JPG files</p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <label htmlFor="file-upload" className="w-full">
              <Button
                variant="outline"
                className="w-full cursor-pointer border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors"
                size="lg"
                asChild
              >
                <span>Browse Files</span>
              </Button>
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </label>

            {file ? (
              <div className="w-full space-y-3">
                <div className="p-3 bg-[#1E3A8A]/5 rounded-lg border border-[#1E3A8A]/20">
                  <p className="text-sm truncate">
                    Selected: <span className="font-medium">{file.name}</span>
                  </p>
                </div>
                <Button
                  className="w-full gap-2 bg-[#1E3A8A] hover:bg-[#152C6B] transition-colors"
                  size="lg"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <UploadIcon className="h-4 w-4" />
                      Process Document
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                className="w-full gap-2 bg-[#1E3A8A] hover:bg-[#152C6B] transition-colors"
                size="lg"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <UploadIcon className="h-4 w-4" />
                Upload Document
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
