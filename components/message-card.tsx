"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

type Props = {
  message?: string
  index?: number
}

export default function MessageCard({ message = "", index = 1 }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // swallow copy errors silently
    }
  }

  return (
    <article className="flex h-full flex-col justify-between rounded-lg border bg-card p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Message {index}</h3>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground transition hover:bg-accent"
          aria-label="Copy message to clipboard"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <p className="whitespace-pre-line text-sm leading-relaxed">{message || "No content."}</p>
    </article>
  )
}
