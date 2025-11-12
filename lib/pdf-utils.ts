export async function downloadPDF(pdfUrl: string, filename: string) {
  try {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = filename || "document.pdf"
    link.target = "_blank"
    link.rel = "noopener noreferrer"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return { success: true, message: "Download started" }
  } catch (error) {
    window.open(pdfUrl, "_blank", "noopener,noreferrer")

    return { success: true, message: "PDF opened in new tab" }
  }
}

export async function sharePDF(title: string, url: string) {
  const shareData = {
    title: title,
    text: `Check out this research: ${title}`,
    url: url,
  }

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData)
      return { success: true }
    } else {
      await navigator.clipboard.writeText(url)
      return { success: true, message: "Link copied to clipboard!" }
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return { success: false, cancelled: true }
    }

    try {
      await navigator.clipboard.writeText(url)
      return { success: true, message: "Link copied to clipboard!" }
    } catch (clipboardError) {
      return { success: false, message: "Unable to share. Please copy the URL manually." }
    }
  }
}

export function generateShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  }
}
