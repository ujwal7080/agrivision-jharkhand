import { NextRequest, NextResponse } from 'next/server'

interface NewsArticle {
  title: string
  description: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
    url: string
  }
}

interface GNewsResponse {
  articles: NewsArticle[]
  totalArticles: number
}

interface ErrorResponse {
  error: string
  details?: string
}

const GNEWS_BASE_URL = 'https://gnews.io/api/v4/search'

export async function GET(request: NextRequest): Promise<NextResponse<GNewsResponse | ErrorResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Extract query parameters
    const query = searchParams.get('q') || 'agriculture india farming'
    const limit = searchParams.get('limit') || '10'
    const lang = searchParams.get('lang') || 'en'
    
    // Validate API key
    const apiKey = process.env.GNEWS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key', details: 'GNEWS_API_KEY not configured' },
        { status: 500 }
      )
    }
    
    // Use simpler, broader search query that returns results
    // Adding multiple agriculture-related keywords improves relevance
    const searchQuery = 'agriculture india OR farming india OR kisan india OR crop india'
    
    // Construct API request
    const params = new URLSearchParams({
      q: searchQuery,
      country: 'in', // India
      lang: lang,
      max: Math.min(parseInt(limit), 100).toString(), // Max 100
      apikey: apiKey
    })
    
    const url = `${GNEWS_BASE_URL}?${params.toString()}`
    
    // Cache response for 1 hour (3600 seconds)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // ISR caching
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { 
          error: `GNews API Error: ${response.status}`,
          details: errorData.message || 'Unknown error'
        },
        { status: response.status }
      )
    }
    
    const data: GNewsResponse = await response.json()
    
    // Return articles
    const filtered = {
      articles: data.articles || [],
      totalArticles: data.totalArticles || 0
    }
    
    return NextResponse.json(filtered, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
    
  } catch (error) {
    console.error('News API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}