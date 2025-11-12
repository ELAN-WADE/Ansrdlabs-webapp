"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { runVerificationReport, type VerificationReport } from "@/lib/wordpress-verify"

export function ContentSyncDashboard() {
  const [report, setReport] = useState<VerificationReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true)
        const verificationReport = await runVerificationReport()
        setReport(verificationReport)
      } catch (error) {
        console.error("[v0] Error loading verification report:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <p className="text-foreground-muted">Unable to load verification report</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    if (status === "success") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === "warning") return <AlertCircle className="h-5 w-5 text-yellow-500" />
    return <AlertCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (status: string) => {
    if (status === "success") return "border-green-500/20 bg-green-500/5"
    if (status === "warning") return "border-yellow-500/20 bg-yellow-500/5"
    return "border-red-500/20 bg-red-500/5"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Content Sync Status</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Last updated: {new Date(report.timestamp).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Research PDF Data */}
        <div className={`rounded-lg border p-4 ${getStatusColor(report.checks.researchPdfData.status)}`}>
          <div className="flex items-start gap-3">
            {getStatusIcon(report.checks.researchPdfData.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Research PDF Data</h3>
              <p className="mt-1 text-sm text-foreground-muted">{report.checks.researchPdfData.message}</p>
            </div>
          </div>
        </div>

        {/* Podcast Audio Data */}
        <div className={`rounded-lg border p-4 ${getStatusColor(report.checks.podcastAudioData.status)}`}>
          <div className="flex items-start gap-3">
            {getStatusIcon(report.checks.podcastAudioData.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Podcast Audio Data</h3>
              <p className="mt-1 text-sm text-foreground-muted">{report.checks.podcastAudioData.message}</p>
            </div>
          </div>
        </div>

        {/* Data Mapping */}
        <div className={`rounded-lg border p-4 ${getStatusColor(report.checks.dataMapping.status)}`}>
          <div className="flex items-start gap-3">
            {getStatusIcon(report.checks.dataMapping.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Data Mapping</h3>
              <p className="mt-1 text-sm text-foreground-muted">{report.checks.dataMapping.message}</p>
              {report.checks.dataMapping.issues && report.checks.dataMapping.issues.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-foreground-subtle">
                  {report.checks.dataMapping.issues.map((issue, i) => (
                    <li key={i}>• {issue}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ACF Fields */}
        <div className={`rounded-lg border p-4 ${getStatusColor(report.checks.acfFields.status)}`}>
          <div className="flex items-start gap-3">
            {getStatusIcon(report.checks.acfFields.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">ACF Fields</h3>
              <p className="mt-1 text-sm text-foreground-muted">{report.checks.acfFields.message}</p>
              {report.checks.acfFields.availableFields && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {report.checks.acfFields.availableFields.slice(0, 5).map((field) => (
                    <span key={field} className="rounded bg-background px-2 py-1 text-xs text-foreground-subtle">
                      {field}
                    </span>
                  ))}
                  {report.checks.acfFields.availableFields.length > 5 && (
                    <span className="rounded bg-background px-2 py-1 text-xs text-foreground-subtle">
                      +{report.checks.acfFields.availableFields.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-foreground-muted">
          Overall Status:{" "}
          <span
            className={`font-semibold ${
              report.status === "success"
                ? "text-green-500"
                : report.status === "warning"
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {report.status.toUpperCase()}
          </span>
        </p>
      </div>
    </div>
  )
}
