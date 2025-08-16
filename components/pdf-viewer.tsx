"use client"
import { Document, Page, pdfjs } from 'react-pdf'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

// Configure PDF.js worker with fallback options
const configurePDFWorker = () => {
  // Try using a different CDN or local worker
  const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc
  } catch (error) {
    console.warn('Failed to set worker source, trying alternative:', error)
    // Fallback: disable worker (will use main thread - slower but more reliable)
    pdfjs.disableWorker = true
  }
}

export function PDFViewer({ pdfUrl, language }: { pdfUrl: string; language: string }) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    configurePDFWorker()
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF Load Error:', error)
    setIsLoading(false)
    setError(language === "fr" ? "Erreur de chargement du PDF" : "Failed to load PDF")
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.0))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))

  if (error) {
    return (
      <div className="flex items-center justify-center h-[1120px] text-red-500">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="overflow-auto max-h-[1120px]">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-[1120px]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">
                {language === "fr" ? "Chargement du PDF..." : "Loading PDF..."}
              </span>
            </div>
          }
          options={{
            // Additional options to improve reliability
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
          }}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              loading={
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              }
              className="border-b border-gray-200 dark:border-gray-700"
              renderTextLayer={false} // Disable text layer for better performance
              renderAnnotationLayer={false} // Disable annotation layer for better performance
            />
          ))}
        </Document>
      </div>
      
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-2 mt-4 mb-2">
        <button
          onClick={zoomOut}
          disabled={scale <= 0.5}
          className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          aria-label={language === "fr" ? "Dézoomer" : "Zoom out"}
        >
          -
        </button>
        <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
        <button
          onClick={zoomIn}
          disabled={scale >= 2.0}
          className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          aria-label={language === "fr" ? "Zoomer" : "Zoom in"}
        >
          +
        </button>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {language === "fr" ? "Précédent" : "Previous"}
          </button>
          <span className="text-sm">
            {language === "fr" ? "Page" : "Page"} {pageNumber} {language === "fr" ? "sur" : "of"} {numPages}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {language === "fr" ? "Suivant" : "Next"}
          </button>
        </div>
      )}
    </>
  )
}