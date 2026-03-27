export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(
      "https://loreleifara.app.n8n.cloud/webhook-test/15167a45-4547-4f11-81e7-b8c718d2ad00",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
    
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json(
      { error: "Failed to analyze idea" },
      { status: 500 }
    )
  }
}
