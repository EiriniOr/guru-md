import { tavily } from '@tavily/core'
import type { TavilySource } from '@/types'

const client = tavily({ apiKey: process.env.TAVILY_API_KEY! })

export async function searchMedical(query: string, maxResults = 6): Promise<TavilySource[]> {
  try {
    const response = await client.search(query, {
      searchDepth: 'advanced',
      maxResults,
      includeAnswer: false,
    })

    return response.results.map((r) => ({
      url: r.url,
      title: r.title,
      content: r.content.slice(0, 500), // keep context window lean
      score: r.score,
    }))
  } catch (err) {
    console.error('Tavily search error:', err)
    return []
  }
}
