"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminCvPage() {
  const router = useRouter()
  const [cvFiles, setCvFiles] = useState<{ fr?: File; en?: File }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [cvUrls, setCvUrls] = useState<{ fr?: string; en?: string }>({})

  // Fetch existing CV URLs
  useEffect(() => {
    const fetchCvUrls = async () => {
      const res = await fetch("/api/cv")
      if (res.ok) {
        const data = await res.json()
        setCvUrls(data)
      }
    }
    fetchCvUrls()
  }, [])

  const handleFileChange = (lang: "fr" | "en", file: File | null) => {
    setCvFiles((prev) => ({ ...prev, [lang]: file || undefined }))
  }

  const handleUpload = async () => {
    setIsUploading(true)
    const formData = new FormData()
    if (cvFiles.fr) formData.append("fr", cvFiles.fr)
    if (cvFiles.en) formData.append("en", cvFiles.en)

    const res = await fetch("/api/cv", {
      method: "PUT",
      body: formData,
    })

    if (res.ok) {
      const data = await res.json()
      setCvUrls(data)
      alert("CV updated successfully")
    } else {
      alert("Failed to update CV")
    }
    setIsUploading(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update CV</h1>

      <div className="mb-4">
        <label className="block mb-1">French CV</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange("fr", e.target.files?.[0] || null)}
        />
        {cvUrls.fr && (
          <p className="text-sm mt-1">
            Current: <a href={cvUrls.fr} target="_blank">{cvUrls.fr}</a>
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1">English CV</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange("en", e.target.files?.[0] || null)}
        />
        {cvUrls.en && (
          <p className="text-sm mt-1">
            Current: <a href={cvUrls.en} target="_blank">{cvUrls.en}</a>
          </p>
        )}
      </div>

      <Button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Update CVs"}
      </Button>
    </div>
  )
}
