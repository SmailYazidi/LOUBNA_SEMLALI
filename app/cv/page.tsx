"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Sun, Moon, Loader2, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import Loading from '@/components/Loading'

export default function CvPage() {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [cvUrls, setCvUrls] = useState<{ fr?: string; en?: string }>({})
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Initialize with safe defaults
const [isDarkMode, setIsDarkMode] = useState(true)
const [language, setLanguage] = useState<"fr" | "en" | "ar">("fr") // include "ar"

// Hydrate client-side state after mount
useEffect(() => {
  setMounted(true)
  
  const savedDarkMode = sessionStorage.getItem('darkMode')
  const savedLanguage = sessionStorage.getItem('language')
  
  setIsDarkMode(savedDarkMode ? JSON.parse(savedDarkMode) : true)

  if (savedLanguage === "ar" || savedLanguage === "fr" || savedLanguage === "en") {
    setLanguage(savedLanguage)
  } else {
    setLanguage("fr") // fallback default
  }
}, [])


  // Persist preferences
  useEffect(() => {
    if (!mounted) return
    sessionStorage.setItem('DarkMode', JSON.stringify(isDarkMode))
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode, mounted])

  useEffect(() => {
    if (!mounted) return
    sessionStorage.setItem('Language', language)
  }, [language, mounted])

  // Fetch CV URLs
  useEffect(() => {
    const fetchCvUrls = async () => {
      try {
        const res = await fetch('/api/cv')
        if (!res.ok) throw new Error("Failed to fetch CV URLs")
        setCvUrls(await res.json())
      } catch (err) {
        console.error("Failed to fetch CV URLs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCvUrls()
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    sessionStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const handleDownloadPdf = async () => {
    if (!cvUrls[language]) return
    
    setIsDownloading(true)
    try {
      const link = document.createElement("a")
      link.href = cvUrls[language]!
      link.download = `loubna_semlali_${language}.pdf`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  const getGoogleViewerUrl = (pdfUrl: string) => 
    `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`

  const themeClasses = {
    bg: isDarkMode ? "bg-[#0a0a0a]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    cardBg: isDarkMode ? "bg-[#111111]" : "bg-white",
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeClasses.bg}`}>
        <Loading />
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center p-4 min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>
      {/* Top controls */}
      <div className="flex flex-row flex-wrap items-center justify-between w-full max-w-4xl gap-4 mb-6 no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="p-2 hover:bg-gray-800/10 dark:hover:bg-gray-800 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">
            {mounted && language === "fr" ? "Retour" : "Back"}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-800/10 dark:hover:bg-gray-800"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <div className="flex items-center gap-4">
          <Select 
            value={language} 
            onValueChange={setLanguage}
            disabled={!mounted}
          >
            <SelectTrigger className="min-w-[135px] bg-gray-100 dark:bg-gray-800">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleDownloadPdf}
            className="bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black font-medium px-6 py-2 rounded-full"
            disabled={isDownloading || !cvUrls[language]}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "fr" ? "Téléchargement..." : "Downloading..."}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {language === "fr" ? "Télécharger" : "Download"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className={`${themeClasses.cardBg} shadow-lg rounded-lg w-full max-w-4xl h-[70vh] md:h-[1120px] md:max-w-[794px]`}>
        {cvUrls[language] ? (
          <iframe
            src={getGoogleViewerUrl(cvUrls[language]!)}
            className="w-full h-full border-0"
            title="CV PDF"
            allow="fullscreen"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {language === "fr" ? "CV non disponible" : "CV not available"}
          </div>
        )}
      </div>
    </div>
  )
}