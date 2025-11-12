"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Download, ExternalLink, Loader2, Maximize2, BookOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  url: string
  title: string
  onError?: () => void
}

export function PDFViewer({ url, title, onError }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [url])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
  const mozillaViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`

  // Try Google Docs viewer first, then Mozilla PDF.js as fallback
  const pdfViewerUrl = googleDocsViewerUrl

  const handleDownload = () => {
    // Create a temporary link and trigger download
    const link = document.createElement("a")
    link.href = url
    link.download = `${title}.pdf`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface-elevated p-12 text-center">
        <AlertCircle className="h-12 w-12 text-foreground-muted" />
        <div>
          <p className="font-medium text-foreground">Unable to preview PDF</p>
          <p className="mt-1 text-sm text-foreground-muted">
            The PDF preview is not available, but you can still download or open it.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={url}
            download
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:scale-105 transition-transform"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-surface transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""}`}>
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Button */}
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-3 py-1.5 h-auto"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>

          {/* Open in New Tab */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border bg-background hover:bg-surface px-3 py-1.5 font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>

          {/* Fullscreen Toggle */}
          <Button variant="outline" size="sm" onClick={handleFullscreen} className="h-8 w-8 p-0 bg-transparent">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-elevated/50 backdrop-blur-sm rounded-xl z-10">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
            <p className="mt-2 text-sm text-foreground-muted">Loading PDF...</p>
          </div>
        </div>
      )}

      <div
        className={`${isFullscreen ? "h-[calc(100vh-8rem)]" : "aspect-[8.5/11]"} w-full overflow-hidden rounded-xl border-2 border-border bg-white shadow-2xl`}
      >
        <iframe
          src={pdfViewerUrl}
          title={title}
          className="h-full w-full"
          style={{ border: "none" }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="fullscreen"
        />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface-elevated/50 p-3">
        <p className="text-xs text-foreground-muted max-w-md">
          Use the viewer controls to navigate pages and adjust zoom. Click fullscreen for an immersive reading
          experience.
        </p>
      </div>

      {/* PDF Preview Card */}
      <div className="rounded-xl border-2 border-border bg-gradient-to-br from-surface-elevated to-surface p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* PDF Icon */}
          <div className="rounded-full bg-accent/10 p-6">
            <FileText className="h-16 w-16 text-accent" />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-foreground-muted">PDF Document • Ready to download</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 h-auto"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </Button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-background hover:bg-surface px-6 py-3 font-medium transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              Open in New Tab
            </a>
          </div>

          {/* Info Text */}
          <p className="text-xs text-foreground-muted max-w-md">
            Click "Download PDF" to save the file to your device, or "Open in New Tab" to view it in your browser's PDF
            viewer.
          </p>
        </div>
      </div>
    </div>
  )
}
