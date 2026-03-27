const WEBHOOK_URL = "https://loreleifara.app.n8n.cloud/webhook-test/15167a45-4547-4f11-81e7-b8c718d2ad00"

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

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to analyze idea" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
