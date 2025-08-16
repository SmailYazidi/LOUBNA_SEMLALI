"use client"

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export function PDFViewer({ pdfUrl, language }: { pdfUrl: string; language: string }) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.0))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))

  return (
    <>
      <div className="overflow-auto max-h-[1120px]">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-[1120px]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[1120px] text-red-500">
              {language === "fr" ? "Erreur de chargement du PDF" : "Failed to load PDF"}
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              loading={
                <div className="flex items-center justify-center h-[1120px]">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              }
              className="border-b border-gray-200 dark:border-gray-700"
            />
          ))}
        </Document>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
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