export function isPDFUrl(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf") || url.includes("pdf")
}

export function getPDFViewerUrl(pdfUrl: string): string {
  // Use PDF.js viewer or Google Docs viewer as fallback
  if (!pdfUrl) return ""

  // Try Google Docs viewer first (works for most PDFs)
  return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`
}

export function getDirectPDFUrl(pdfUrl: string): string {
  // Return the direct PDF URL for iframe embedding
  return pdfUrl
}
