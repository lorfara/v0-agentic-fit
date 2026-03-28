const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || ""

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const text = await response.text()

    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      // n8n webhook-test returns plain text when not active
      data = { error: text || "Webhook returned an empty response" }
    }

    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response(
      JSON.stringify({ error: "Could not reach the analysis service. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
