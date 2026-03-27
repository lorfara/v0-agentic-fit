export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Forward the request to the n8n webhook
    const response = await fetch(
      "https://loreleifara.app.n8n.cloud/webhook-test/15167a45-4547-4f11-81e7-b8c718d2ad00",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectDescription: body.projectDescription }),
      }
    )
    
    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to analyze idea" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  })
}
