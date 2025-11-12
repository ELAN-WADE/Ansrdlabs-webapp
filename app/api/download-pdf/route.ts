import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pdfUrl = searchParams.get("url")

    if (!pdfUrl) {
      return NextResponse.json({ error: "PDF URL is required" }, { status: 400 })
    }

    const response = await fetch(pdfUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ANSRDLabs/1.0)",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch PDF" }, { status: response.status })
    }

    const blob = await response.blob()
    const filename = pdfUrl.split("/").pop() || "document.pdf"

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
