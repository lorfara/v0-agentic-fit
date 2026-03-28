import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch('https://loreleifara.app.n8n.cloud/webhook/31cf455f-5074-4b84-ad91-a8571323154d', {
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
