"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Sun, Moon, Loader2, Download, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CvPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [cvUrls, setCvUrls] = useState<{ fr?: string; en?: string }>({})
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDarkMode])

  // Fetch both CV URLs when component mounts
  useEffect(() => {
    const fetchCvUrls = async () => {
      try {
        const res = await fetch('/api/cv')
        if (!res.ok) throw new Error("Failed to fetch CV URLs")
        const data = await res.json()
        setCvUrls(data)
      } catch (err) {
        console.error("Failed to fetch CV URLs:", err)
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
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = `loubna_semlali_${language}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleViewInNewTab = () => {
    const pdfUrl = cvUrls[language]
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank')
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

  const renderPdfViewer = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )
    }

    if (!cvUrls[language]) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          {language === "fr" ? "CV non disponible" : "CV not available"}
        </div>
      )
    }

    if (isMobile) {
      // Mobile view - show buttons instead of iframe
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              {language === "fr" ? "Visualiser le CV" : "View CV"}
            </h3>
            <p className="text-gray-500 text-sm max-w-md">
              {language === "fr" 
                ? "Pour une meilleure expérience sur mobile, utilisez les boutons ci-dessous"
                : "For better mobile experience, use the buttons below"
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <Button
              onClick={handleViewInNewTab}
              variant="outline"
              className="flex items-center justify-center gap-2 flex-1"
            >
              <ExternalLink className="w-4 h-4" />
              {language === "fr" ? "Ouvrir" : "Open"}
            </Button>
            
            <Button
              onClick={handleDownloadPdf}
              className={`${
                isDarkMode
                  ? "bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } flex items-center justify-center gap-2 flex-1`}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === "fr" ? "Téléchargement..." : "Downloading..."}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {language === "fr" ? "Télécharger" : "Download"}
                </>
              )}
            </Button>
          </div>
        </div>
      )
    }

    // Desktop view - use object tag for better PDF rendering
    return (
      <object
        data={`${cvUrls[language]}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH`}
        type="application/pdf"
        className="w-full h-full"
        aria-label="CV PDF"
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
          <p className="text-gray-500">
            {language === "fr" 
              ? "Impossible d'afficher le PDF dans ce navigateur" 
              : "Unable to display PDF in this browser"
            }
          </p>
          <div className="flex gap-4">
            <Button
              onClick={handleViewInNewTab}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {language === "fr" ? "Ouvrir dans un nouvel onglet" : "Open in new tab"}
            </Button>
            <Button
              onClick={handleDownloadPdf}
              className={`${
                isDarkMode
                  ? "bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } flex items-center gap-2`}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === "fr" ? "Téléchargement..." : "Downloading..."}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {language === "fr" ? "Télécharger" : "Download"}
                </>
              )}
            </Button>
          </div>
        </div>
      </object>
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
          className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} flex items-center gap-2`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{language === "fr" ? "Retour" : "Back"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <div className="flex items-center gap-4">
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

          {/* Hide download button on mobile since it's included in the mobile view */}
          {!isMobile && (
            <Button
              onClick={handleDownloadPdf}
              className={`${
                isDarkMode
                  ? "bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } font-medium px-6 py-2 rounded-full`}
              disabled={isDownloading || !cvUrls[language]}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "fr" ? "Téléchargement..." : "Downloading..."}
                </>
              ) : (
                language === "fr" ? "Télécharger" : "Download"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* PDF container */}
      <div
        className={`cv-a4-page ${themeClasses.cardBg} shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col ${themeClasses.text} ${
          isMobile ? "h-auto min-h-[400px]" : "md:max-w-[794px]"
        }`}
        style={!isMobile ? { height: "1120px" } : {}}
      >
        {renderPdfViewer()}
      </div>
    </div>
  )
}