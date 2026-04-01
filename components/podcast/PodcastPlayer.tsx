'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, Play, Pause, Square, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface Article {
  url: string
  title: string
  content: string
}

interface Props {
  topic: string
  articles: Article[]
}

type State = 'idle' | 'generating' | 'ready' | 'playing' | 'paused'

export function PodcastPlayer({ topic, articles }: Props) {
  const [state, setState] = useState<State>('idle')
  const [script, setScript] = useState('')
  const [showScript, setShowScript] = useState(false)
  const [sources, setSources] = useState<Article[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const generate = useCallback(async () => {
    setState('generating')
    setScript('')
    setSources([])

    // Cancel any ongoing speech
    window.speechSynthesis?.cancel()

    const res = await fetch('/api/podcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, articles }),
    })

    if (!res.ok) { setState('idle'); return }

    const data = await res.json()
    setScript(data.script)
    setSources(data.sources ?? [])
    setState('ready')
  }, [topic, articles])

  function play() {
    if (!script || !window.speechSynthesis) return

    if (state === 'paused' && utteranceRef.current) {
      window.speechSynthesis.resume()
      setState('playing')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(script)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.lang = 'en-GB'

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Samantha'))
    ) ?? voices.find(v => v.lang.startsWith('en'))
    if (preferred) utterance.voice = preferred

    utterance.onend = () => setState('ready')
    utterance.onerror = () => setState('ready')

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setState('playing')
  }

  function pause() {
    window.speechSynthesis?.pause()
    setState('paused')
  }

  function stop() {
    window.speechSynthesis?.cancel()
    utteranceRef.current = null
    setState('ready')
  }

  return (
    <Card className="bg-gradient-to-r from-blue-950/60 to-slate-900 border-blue-800/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Mic className="w-4 h-4 text-blue-400" />
          Guru, M.D. Podcast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-400 text-sm">
          Generate a spoken audio summary of today&apos;s medical news — narrated by AI.
        </p>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {state === 'idle' || state === 'ready' ? (
            <Button
              onClick={state === 'idle' ? generate : play}
              className="bg-blue-600 hover:bg-blue-500"
            >
              {state === 'idle' ? (
                <><Mic className="w-4 h-4 mr-2" /> Generate episode</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Play episode</>
              )}
            </Button>
          ) : state === 'generating' ? (
            <Button disabled className="bg-blue-600/50">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating script…
            </Button>
          ) : state === 'playing' ? (
            <>
              <Button onClick={pause} variant="outline" className="border-slate-700 text-slate-300">
                <Pause className="w-4 h-4 mr-2" /> Pause
              </Button>
              <Button onClick={stop} variant="outline" className="border-slate-700 text-slate-300">
                <Square className="w-4 h-4 mr-2" /> Stop
              </Button>
            </>
          ) : state === 'paused' ? (
            <>
              <Button onClick={play} className="bg-blue-600 hover:bg-blue-500">
                <Play className="w-4 h-4 mr-2" /> Resume
              </Button>
              <Button onClick={stop} variant="outline" className="border-slate-700 text-slate-300">
                <Square className="w-4 h-4 mr-2" /> Stop
              </Button>
            </>
          ) : null}

          {script && (
            <Button
              variant="outline"
              onClick={() => setShowScript(s => !s)}
              className="border-slate-700 text-slate-400 hover:text-slate-200 ml-auto"
            >
              {showScript ? <><ChevronUp className="w-4 h-4 mr-1" /> Hide script</> : <><ChevronDown className="w-4 h-4 mr-1" /> Read script</>}
            </Button>
          )}
        </div>

        {/* Script */}
        {showScript && script && (
          <div className="bg-slate-800/60 rounded-xl p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap border border-slate-700">
            {script}
          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="space-y-1">
            <p className="text-slate-500 text-xs">Sources used in this episode:</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((s, i) => {
                const host = (() => { try { return new URL(s.url).hostname.replace('www.', '') } catch { return s.url } })()
                return (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
                    {host}
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
