export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Return mock analysis data for preview
    const mockData = {
      analysis: "Analysis complete",
      findings: "Project has strong market potential",
      projectDescription: body.projectDescription,
      timestamp: new Date().toISOString()
    }
    
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to analyze idea" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
