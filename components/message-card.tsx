"use client"

import { useState } from "react"
import { Check, Copy, RefreshCw } from "lucide-react"

type Props = {
  message?: string
  index?: number
  maxChars?: number
  onRegenerate?: () => void
}

export default function MessageCard({ message = "", index = 1, maxChars = 280, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // swallow copy errors silently
    }
  }

  const handleRegenerate = async () => {
    if (!onRegenerate) return
    
    setIsRegenerating(true)
    try {
      await onRegenerate()
    } finally {
      setIsRegenerating(false)
    }
  }

  const charCount = message.length
  const isOverLimit = charCount > maxChars

  return (
    <article className="flex h-full flex-col justify-between rounded-lg border bg-card p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Message {index + 1}</h3>
        <div className="flex items-center gap-2">
          {/* Contador de caracteres */}
          <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
            {charCount}/{maxChars}
          </span>
          
          {/* Botón Regenerate */}
          {onRegenerate && (
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground transition hover:bg-accent disabled:opacity-50"
              aria-label="Regenerate this message"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? "..." : "Regen"}
            </button>
          )}
          
          {/* Botón Copy */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground transition hover:bg-accent"
            aria-label="Copy message to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </header>
      
      <p className="whitespace-pre-line text-sm leading-relaxed flex-1">
        {message || "No content."}
      </p>
      
      {/* Indicador visual si excede el límite */}
      {isOverLimit && (
        <div className="mt-2 text-xs text-destructive">
          ⚠️ Message exceeds {maxChars} character limit
        </div>
      )}
    </article>
  )
}
