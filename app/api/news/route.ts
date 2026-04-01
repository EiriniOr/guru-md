import { tavily } from '@tavily/core'
import { NextResponse } from 'next/server'

const client = tavily({ apiKey: process.env.TAVILY_API_KEY! })

const QUERIES = [
  'medical news EU health 2025',
  'Swedish healthcare Socialstyrelsen Folkhälsomyndigheten 2025',
  'ESC cardiology guidelines update 2025',
  'EMA drug approval Europe 2025',
  'clinical trial results Europe medicine 2025',
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic')

  const query = topic
    ? `${topic} medical news latest 2025`
    : QUERIES[Math.floor(Math.random() * QUERIES.length)]

  try {
    const response = await client.search(query, {
      searchDepth: 'basic',
      maxResults: 8,
      includeAnswer: false,
    })

    const articles = response.results.map(r => ({
      url: r.url,
      title: r.title,
      content: r.content,
      score: r.score,
    }))

    return NextResponse.json({ articles, query })
  } catch (err) {
    console.error('News fetch error:', err)
    return NextResponse.json({ articles: [], query })
  }
}
