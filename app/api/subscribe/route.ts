import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      return NextResponse.json({ error: "Newsletter service not configured. Please contact support." }, { status: 500 })
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [Number.parseInt(BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    })

    if (response.status === 201) {
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing! Check your inbox for confirmation.",
      })
    }

    if (response.status === 204) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed! Thank you.",
      })
    }

    const errorData = await response.json()

    if (errorData.code === "duplicate_parameter") {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed! Thank you.",
      })
    }

    return NextResponse.json({ error: "Unable to subscribe. Please try again later." }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: "Unable to subscribe. Please try again later." }, { status: 500 })
  }
}
