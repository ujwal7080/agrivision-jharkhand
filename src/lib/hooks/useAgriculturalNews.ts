import { useEffect, useState } from 'react'

export interface NewsArticle {
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

interface UseNewsOptions {
  query?: string
  category?: string
  region?: string
  limit?: number
  pollInterval?: number // Auto-refresh interval in ms
}

export function useAgriculturalNews(options: UseNewsOptions = {}) {
  const {
    query = 'agriculture farming government schemes',
    category = 'agriculture',
    region = 'jharkhand',
    limit = 10,
    pollInterval = 0
  } = options

  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        q: query,
        category,
        region,
        limit: limit.toString(),
        lang: 'en'
      })

      const response = await fetch(`/api/news/agriculture?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to fetch news')
      }

      const data = await response.json()
      setArticles(data.articles || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Error fetching news:', message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()

    // Auto-refresh if pollInterval is set
    if (pollInterval > 0) {
      const interval = setInterval(fetchNews, pollInterval)
      return () => clearInterval(interval)
    }
  }, [query, category, region, limit, pollInterval])

  return { articles, loading, error, refetch: fetchNews }
}
