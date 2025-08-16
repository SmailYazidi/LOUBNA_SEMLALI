"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminCvPage() {
  const router = useRouter()
  const [cvFiles, setCvFiles] = useState<{ fr?: File; en?: File }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [cvUrls, setCvUrls] = useState<{ fr?: string; en?: string }>({})
  const [error, setError] = useState<string | null>(null)

  // Fetch existing CV URLs
  useEffect(() => {
    const fetchCvUrls = async () => {
      try {
        const res = await fetch("/api/cv")
        if (!res.ok) throw new Error("Failed to fetch CVs")
        const data = await res.json()
        setCvUrls(data)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load CVs")
      }
    }
    fetchCvUrls()
  }, [])

  const handleFileChange = (lang: "fr" | "en", file: File | null) => {
    setCvFiles(prev => ({ ...prev, [lang]: file || undefined }))
    setError(null)
  }

  const handleUpload = async () => {
    if (!cvFiles.fr && !cvFiles.en) {
      setError("Please select at least one file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      if (cvFiles.fr) formData.append("fr", cvFiles.fr)
      if (cvFiles.en) formData.append("en", cvFiles.en)

      const res = await fetch("/api/cv", {
        method: "PUT",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update CVs")
      }

      const data = await res.json()
      setCvUrls(data)
      setCvFiles({}) // Clear selected files after successful upload
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update CV</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">French CV (PDF only)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange("fr", e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {cvUrls.fr && (
            <p className="text-sm mt-1">
              Current: <a href={cvUrls.fr} target="_blank" className="text-blue-600 hover:underline">{cvUrls.fr}</a>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">English CV (PDF only)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange("en", e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {cvUrls.en && (
            <p className="text-sm mt-1">
              Current: <a href={cvUrls.en} target="_blank" className="text-blue-600 hover:underline">{cvUrls.en}</a>
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={isUploading || (!cvFiles.fr && !cvFiles.en)}
          className="w-full sm:w-auto"
        >
          {isUploading ? "Uploading..." : "Update CVs"}
        </Button>
      </div>
    </div>
  )
}