import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.text()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n returned status ${response.status}`, details: data },
        { status: response.status }
      )
    }
    
    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON response from n8n', raw: data },
        { status: 500 }
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
