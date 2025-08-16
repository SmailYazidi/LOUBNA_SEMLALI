"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Sun, Moon, Loader2, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
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

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

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

  // Convert PDF to image when language changes
  useEffect(() => {
    if (cvUrls[language]) {
      convertPdfToImage(cvUrls[language])
    }
  }, [language, cvUrls])

  // Method 1: Using PDF.js (requires PDF.js library)
  const convertPdfToImageWithPdfJs = async (pdfUrl: string) => {
    setImageLoading(true)
    try {
      // You'll need to install pdf.js: npm install pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise
      setTotalPages(pdf.numPages)
      
      const page = await pdf.getPage(currentPage)
      const viewport = page.getViewport({ scale: 1.5 })
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      await page.render(renderContext).promise
      setImageUrl(canvas.toDataURL())
    } catch (error) {
      console.error('Error converting PDF to image:', error)
      // Fallback to other methods
      convertPdfToImageWithAPI(pdfUrl)
    } finally {
      setImageLoading(false)
    }
  }

  // Method 2: Using a PDF to Image API service
  const convertPdfToImageWithAPI = async (pdfUrl: string) => {
    setImageLoading(true)
    try {
      // Example with a free API service (you can use others like pdf.co, cloudmersive, etc.)
      const apiUrl = `https://api.pdf24.org/v1/convert`
      
      const formData = new FormData()
      formData.append('inputFormat', 'pdf')
      formData.append('outputFormat', 'png')
      formData.append('url', pdfUrl)
      formData.append('page', currentPage.toString())
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const blob = await response.blob()
        setImageUrl(URL.createObjectURL(blob))
      } else {
        throw new Error('API conversion failed')
      }
    } catch (error) {
      console.error('Error with API conversion:', error)
      // Fallback to iframe method
      convertPdfToImageWithIframe(pdfUrl)
    } finally {
      setImageLoading(false)
    }
  }

  // Method 3: Using iframe and canvas (screenshot approach)
  const convertPdfToImageWithIframe = async (pdfUrl: string) => {
    setImageLoading(true)
    try {
      // Create hidden iframe
      const iframe = document.createElement('iframe')
      iframe.src = pdfUrl
      iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.width = '794px'
      iframe.style.height = '1123px'
      document.body.appendChild(iframe)
      
      // Wait for iframe to load
      await new Promise((resolve) => {
        iframe.onload = resolve
        setTimeout(resolve, 3000) // Fallback timeout
      })
      
      // This method has limitations due to CORS and security restrictions
      // It's mainly for demonstration
      setImageUrl(pdfUrl) // Fallback to showing PDF URL
      document.body.removeChild(iframe)
    } catch (error) {
      console.error('Error with iframe conversion:', error)
      setImageUrl(pdfUrl) // Fallback
    } finally {
      setImageLoading(false)
    }
  }

  // Method 4: Server-side conversion (recommended approach)
  const convertPdfToImage = async (pdfUrl: string) => {
    setImageLoading(true)
    try {
      // Call your backend API that converts PDF to image
      const response = await fetch('/api/pdf-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfUrl,
          language,
          page: currentPage,
          quality: 'high'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.imageUrl)
        setTotalPages(data.totalPages || 1)
      } else {
        throw new Error('Server conversion failed')
      }
    } catch (error) {
      console.error('Error with server conversion:', error)
      // Fallback: Try client-side PDF.js conversion
      convertPdfToImageWithPdfJs(pdfUrl)
    } finally {
      setImageLoading(false)
    }
  }

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

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50))
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const themeClasses = {
    bg: isDarkMode ? "bg-[#0a0a0a]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    cardBg: isDarkMode ? "bg-[#111111]" : "bg-white",
    dropdownBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
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

          {/* Zoom controls */}
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

          {/* Page navigation for multi-page PDFs */}
          {totalPages > 1 && (
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

      {/* Image container */}
      <div
        className={`cv-a4-page ${themeClasses.cardBg} shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col ${themeClasses.text} md:max-w-[794px]`}
        style={{ minHeight: "600px" }}
      >
        {loading || imageLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 py-20">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <p className="text-sm">
                {imageLoading 
                  ? (language === "fr" ? "Conversion en cours..." : "Converting to image...")
                  : (language === "fr" ? "Chargement..." : "Loading...")
                }
              </p>
            </div>
          </div>
        ) : imageUrl ? (
          <div className="flex-1 overflow-auto p-4">
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="CV"
                className="max-w-full h-auto shadow-sm rounded border"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease'
                }}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  console.error('Image failed to load')
                  setImageLoading(false)
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 p-8">
            <p>{language === "fr" ? "Impossible de charger le CV" : "Unable to load CV"}</p>
            <Button
              onClick={() => cvUrls[language] && convertPdfToImage(cvUrls[language])}
              variant="outline"
            >
              {language === "fr" ? "Réessayer" : "Retry"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}