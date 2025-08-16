"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Sun, Moon, Loader2, Download, ZoomIn, ZoomOut } from "lucide-react"
import { useRouter } from "next/navigation"

// Dynamically import the PDF viewer with SSR disabled
const PDFViewer = dynamic(
  () => import('@/components/pdf-viewer').then((mod) => mod.PDFViewer),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-[1120px]">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  }
)

export default function CvPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [cvUrls, setCvUrls] = useState<{ fr?: string; en?: string }>({})
  const [loading, setLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDarkMode])

  useEffect(() => {
    const fetchCvUrls = async () => {
      try {
        const res = await fetch('/api/cv')
        if (!res.ok) throw new Error("Failed to fetch CV URLs")
        const data = await res.json()
        setCvUrls(data)
      } catch (err) {
        console.error("Failed to fetch CV URLs:", err)
        setPdfError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCvUrls()
  }, [])

  const handleDownloadPdf = async () => {
    const pdfUrl = cvUrls[language]
    if (!pdfUrl) return
    
    setIsDownloading(true)
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `loubna_semlali_${language}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  const themeClasses = {
    bg: isDarkMode ? "bg-[#0a0a0a]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    cardBg: isDarkMode ? "bg-[#111111]" : "bg-white",
    dropdownBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
    accentGold: "rgb(var(--portfolio-gold))",
    accentGoldHover: "rgb(var(--portfolio-gold-hover))",
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.0))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))

  return (
    <div className={`flex flex-col items-center p-4 min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>
      {/* Top controls */}
      <div className="flex flex-row flex-wrap items-center justify-between w-full max-w-4xl gap-4 mb-6 no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} flex items-center gap-2`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{language === "fr" ? "Retour" : "Back"}</span>
        </Button>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Select value={language} onValueChange={(value: "fr" | "en") => setLanguage(value)}>
            <SelectTrigger
              className={`min-w-[135px] w-auto ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"}`}
            >
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className={`${themeClasses.dropdownBg} ${themeClasses.dropdownBorder}`}>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleDownloadPdf}
            className={`${
              isDarkMode
                ? "bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            } font-medium px-6 py-2 rounded-full flex items-center gap-2`}
            disabled={isDownloading || !cvUrls[language]}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{language === "fr" ? "Télécharger" : "Download"}</span>
          </Button>
        </div>
      </div>

      {/* PDF container */}
      <div
        className={`${themeClasses.cardBg} shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col ${themeClasses.text} md:max-w-[794px]`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-[1120px] text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : pdfError || !cvUrls[language] ? (
          <div className="flex items-center justify-center h-[1120px] text-gray-500">
            {language === "fr" ? "CV non disponible" : "CV not available"}
          </div>
        ) : (
          <PDFViewer pdfUrl={cvUrls[language]} language={language} />
        )}
      </div>
    </div>
  )
}