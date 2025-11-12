/**
 * WordPress Data Verification Utility
 * Verifies that WordPress is properly returning PDF, audio, and other media data
 */

import { fetchPosts } from "./wordpress"

export interface VerificationReport {
  timestamp: string
  status: "success" | "warning" | "error"
  checks: {
    researchPdfData: {
      status: "success" | "warning" | "error"
      message: string
    }
    podcastAudioData: {
      status: "success" | "warning" | "error"
      message: string
    }
    dataMapping: {
      status: "success" | "warning" | "error"
      message: string
      issues?: string[]
    }
    acfFields: {
      status: "success" | "warning" | "error"
      message: string
      availableFields?: string[]
    }
  }
}

/**
 * Verify research PDF data is being returned from WordPress
 */
export async function verifyResearchPdfData(): Promise<VerificationReport["checks"]["researchPdfData"]> {
  try {
    const research = await fetchPosts({ type: "research", per_page: 1, _embed: true })

    if (!research || research.length === 0) {
      return {
        status: "warning",
        message: "No research posts found in WordPress",
      }
    }

    const post = research[0]
    const hasPdfUrl = !!post.acf?.pdf_url
    const hasPdfUpload = !!post.acf?.pdfUpload
    const hasMediaUrl = !!post.acf?.pdfUpload?.mediaItemUrl

    if (hasPdfUrl || hasPdfUpload || hasMediaUrl) {
      return {
        status: "success",
        message: "Research PDF data is properly configured in WordPress",
      }
    }

    return {
      status: "warning",
      message: "Research posts found but no PDF data detected. Check ACF field configuration.",
    }
  } catch (error) {
    return {
      status: "error",
      message: `Error verifying research PDF data: ${error}`,
    }
  }
}

/**
 * Verify podcast audio data is being returned from WordPress
 */
export async function verifyPodcastAudioData(): Promise<VerificationReport["checks"]["podcastAudioData"]> {
  try {
    const episodes = await fetchPosts({ type: "episodes", per_page: 1, _embed: true })

    if (!episodes || episodes.length === 0) {
      return {
        status: "warning",
        message: "No podcast episodes found in WordPress",
      }
    }

    const post = episodes[0]
    const hasAudioUrl = !!post.acf?.audio_url
    const hasDuration = !!post.acf?.duration
    const hasTranscript = !!post.acf?.transcript

    if (hasAudioUrl) {
      return {
        status: "success",
        message: "Podcast audio data is properly configured in WordPress",
      }
    }

    return {
      status: "warning",
      message: "Podcast episodes found but no audio data detected. Check ACF field configuration.",
    }
  } catch (error) {
    return {
      status: "error",
      message: `Error verifying podcast audio data: ${error}`,
    }
  }
}

/**
 * Verify data mapping from WordPress to frontend
 */
export async function verifyDataMapping(): Promise<VerificationReport["checks"]["dataMapping"]> {
  try {
    const research = await fetchPosts({ type: "research", per_page: 1, _embed: true })
    const episodes = await fetchPosts({ type: "episodes", per_page: 1, _embed: true })

    const issues: string[] = []

    // Check research data
    if (research && research.length > 0) {
      const post = research[0]
      if (!post.title?.rendered) issues.push("Research title not properly mapped")
      if (!post.slug) issues.push("Research slug not properly mapped")
      if (!post.acf?.authors) issues.push("Research authors ACF field missing")
    }

    // Check podcast data
    if (episodes && episodes.length > 0) {
      const post = episodes[0]
      if (!post.title?.rendered) issues.push("Podcast title not properly mapped")
      if (!post.slug) issues.push("Podcast slug not properly mapped")
      if (!post.acf?.audio_url) issues.push("Podcast audio_url ACF field missing")
    }

    if (issues.length === 0) {
      return {
        status: "success",
        message: "All data mapping verified successfully",
      }
    }

    return {
      status: "warning",
      message: `Data mapping issues detected: ${issues.length} issue(s)`,
      issues,
    }
  } catch (error) {
    return {
      status: "error",
      message: `Error verifying data mapping: ${error}`,
    }
  }
}

/**
 * Verify ACF fields are available
 */
export async function verifyAcfFields(): Promise<VerificationReport["checks"]["acfFields"]> {
  try {
    const posts = await fetchPosts({ per_page: 1, _embed: true })

    if (!posts || posts.length === 0) {
      return {
        status: "warning",
        message: "No posts found to verify ACF fields",
      }
    }

    const post = posts[0]
    const availableFields = post.acf ? Object.keys(post.acf) : []

    if (availableFields.length === 0) {
      return {
        status: "warning",
        message: "No ACF fields detected. Ensure ACF plugin is installed and configured.",
      }
    }

    return {
      status: "success",
      message: `ACF fields are available (${availableFields.length} fields detected)`,
      availableFields,
    }
  } catch (error) {
    return {
      status: "error",
      message: `Error verifying ACF fields: ${error}`,
    }
  }
}

/**
 * Run complete verification report
 */
export async function runVerificationReport(): Promise<VerificationReport> {
  const [researchPdf, podcastAudio, dataMapping, acfFields] = await Promise.all([
    verifyResearchPdfData(),
    verifyPodcastAudioData(),
    verifyDataMapping(),
    verifyAcfFields(),
  ])

  const report: VerificationReport = {
    timestamp: new Date().toISOString(),
    status: "success",
    checks: {
      researchPdfData: researchPdf,
      podcastAudioData: podcastAudio,
      dataMapping: dataMapping,
      acfFields: acfFields,
    },
  }

  const statuses = [researchPdf.status, podcastAudio.status, dataMapping.status, acfFields.status]
  if (statuses.includes("error")) {
    report.status = "error"
  } else if (statuses.includes("warning")) {
    report.status = "warning"
  }

  return report
}
