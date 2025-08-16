"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Sun, Moon, Loader2, Download, ZoomIn, ZoomOut, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CvPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [cvUrls, setCvUrls] = useState<{ fr?: string; en?: string }>({})
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imageLoading, setImageLoading] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<'pdf' | 'image' | 'google'>('pdf')
  const [isMobile, setIsMobile] = useState(false)

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
      if (mobile) {
        setViewMode('google') // Default to Google Viewer on mobile
      }
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

  // Convert PDF to image using PDF.js with correct version
  const convertPdfToImageWithPdfJs = async (pdfUrl: string) => {
    setImageLoading(true)
    try {
      // Use compatible PDF.js version
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker with matching version
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      })
      
      const pdf = await loadingTask.promise
      setTotalPages(pdf.numPages)
      
      const page = await pdf.getPage(currentPage)
      const scale = 2.0 // Higher resolution
      const viewport = page.getViewport({ scale })
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      await page.render(renderContext).promise
      const imageDataUrl = canvas.toDataURL('image/png', 0.9)
      setImageUrl(imageDataUrl)
      
    } catch (error) {
      console.error('Error converting PDF to image:', error)
      // Fallback to Google Viewer
      setViewMode('google')
    } finally {
      setImageLoading(false)
    }
  }

  // Convert PDF when language or page changes
  useEffect(() => {
    if (viewMode === 'image' && cvUrls[language] && !imageLoading) {
      convertPdfToImageWithPdfJs(cvUrls[language])
    }
  }, [language, currentPage, viewMode, cvUrls])

  const handleDownloadPdf = async () => {
    const pdfUrl = cvUrls[language]
    if (!pdfUrl) return
    
    setIsDownloading(true)
    try {
      const link = document.createElement("a")
      link.href = pdfUrl
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

  const handleViewInNewTab = () => {
    const pdfUrl = cvUrls[language]
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank')
  }

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50))
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Get Google Docs Viewer URL
  const getGoogleViewerUrl = (pdfUrl: string) => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`
  }

  const themeClasses = {
    bg: isDarkMode ? "bg-[#0a0a0a]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    cardBg: isDarkMode ? "bg-[#111111]" : "bg-white",
    dropdownBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500 py-20">
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="text-sm">{language === "fr" ? "Chargement..." : "Loading..."}</p>
          </div>
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

    const pdfUrl = cvUrls[language]

    switch (viewMode) {
      case 'image':
        if (imageLoading) {
          return (
            <div className="flex items-center justify-center h-full text-gray-500 py-20">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-sm">
                  {language === "fr" ? "Conversion en image..." : "Converting to image..."}
                </p>
              </div>
            </div>
          )
        }

        if (imageUrl) {
          return (
            <div className="flex-1 overflow-auto p-4">
              <div className="flex justify-center">
                <img
                  src={imageUrl}
                  alt="CV"
                  className="max-w-full h-auto shadow-sm rounded border transition-transform duration-200"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center'
                  }}
                  onError={() => {
                    console.error('Image failed to load')
                    setViewMode('google') // Fallback to Google Viewer
                  }}
                />
              </div>
            </div>
          )
        }
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <p>{language === "fr" ? "Impossible de convertir le PDF" : "Unable to convert PDF"}</p>
            <Button
              onClick={() => setViewMode('google')}
              variant="outline"
            >
              {language === "fr" ? "Essayer Google Viewer" : "Try Google Viewer"}
            </Button>
          </div>
        )

      case 'google':
        return (
          <iframe
            src={getGoogleViewerUrl(pdfUrl)}
            className="w-full h-full border-0"
            title="CV PDF"
            allow="fullscreen"
            onError={() => setViewMode('pdf')}
          />
        )

      case 'pdf':
      default:
        return (
          <object
            data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH&zoom=100`}
            type="application/pdf"
            className="w-full h-full"
            aria-label="CV PDF"
          >
            {/* Fallback for browsers that can't display PDF */}
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
              <p className="text-gray-500 text-center">
                {language === "fr" 
                  ? "Impossible d'afficher le PDF dans ce navigateur" 
                  : "Unable to display PDF in this browser"
                }
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => setViewMode('google')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {language === "fr" ? "Google Viewer" : "Google Viewer"}
                </Button>
                <Button
                  onClick={() => setViewMode('image')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  🖼️ {language === "fr" ? "Convertir en image" : "Convert to image"}
                </Button>
                <Button
                  onClick={handleViewInNewTab}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {language === "fr" ? "Nouvel onglet" : "New tab"}
                </Button>
              </div>
            </div>
          </object>
        )
    }
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

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* View Mode Selector */}
          {!isMobile && (
            <Select 
              value={viewMode} 
              onValueChange={(value: 'pdf' | 'image' | 'google') => setViewMode(value)}
            >
              <SelectTrigger className={`min-w-[120px] w-auto ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${themeClasses.dropdownBg} ${themeClasses.dropdownBorder}`}>
                <SelectItem value="pdf">PDF Native</SelectItem>
                <SelectItem value="google">Google Viewer</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Zoom controls for image mode */}
          {viewMode === 'image' && (
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="p-1 h-8 w-8"
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs px-2 min-w-[50px] text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="p-1 h-8 w-8"
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Page navigation for multi-page PDFs in image mode */}
          {viewMode === 'image' && totalPages > 1 && (
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-1 h-8 w-8"
                disabled={currentPage <= 1}
              >
                ←
              </Button>
              <span className="text-xs px-2 min-w-[60px] text-center">
                {currentPage}/{totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-1 h-8 w-8"
                disabled={currentPage >= totalPages}
              >
                →
              </Button>
            </div>
          )}
        </div>

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
              <>
                <Download className="mr-2 h-4 w-4" />
                {language === "fr" ? "Télécharger" : "Download"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* PDF/Image container */}
      <div
        className={`cv-a4-page ${themeClasses.cardBg} shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col ${themeClasses.text} ${
          isMobile ? "h-auto min-h-[600px]" : "md:max-w-[794px]"
        }`}
        style={!isMobile ? { height: "1120px" } : {}}
      >
        {renderContent()}
      </div>
    </div>
  )
}