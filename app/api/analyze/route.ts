export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Return mock analysis data for preview
    const mockData = {
      analysis: "Analysis complete",
      findings: "Project has strong market potential",
      timestamp: new Date().toISOString()
    }
    
    return Response.json(mockData)
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json(
      { error: "Failed to analyze idea" },
      { status: 500 }
    )
  }
}
