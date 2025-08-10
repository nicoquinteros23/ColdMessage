"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import MessageCard from "./message-card"

type FormData = {
  senderUrl: string
  problem: string
  solution: string
  recipientUrl: string
}

type PersonalizationSettings = {
  tone: "neutral" | "warm" | "direct" | "formal" | "casual"
  maxChars: number
  goal: "conversation" | "meeting" | "feedback" | "resource"
  category: "auto" | "question" | "mention" | "congrats"
  language: "auto" | "es" | "en"
  temperature: number
}

type ApiResponse = {
  messages?: string[]
  message?: string
}

type Errors = Partial<Record<keyof FormData, string>> & { submit?: string }

const LINKEDIN_REGEX = /^https:\/\/www\.linkedin\.com\/.+/

function validate(values: FormData): Errors {
  const errors: Errors = {}

  if (!values.senderUrl) errors.senderUrl = "Sender profile URL is required."
  else if (!LINKEDIN_REGEX.test(values.senderUrl)) errors.senderUrl = "Must start with https://www.linkedin.com/"

  if (!values.problem) errors.problem = "This field is required."

  if (!values.solution) errors.solution = "Solution is required."

  if (!values.recipientUrl) errors.recipientUrl = "Recipient profile URL is required."
  else if (!LINKEDIN_REGEX.test(values.recipientUrl)) errors.recipientUrl = "Must start with https://www.linkedin.com/"

  return errors
}

export default function App() {
  const [values, setValues] = useState<FormData>({
    senderUrl: "",
    problem: "",
    solution: "",
    recipientUrl: "",
  })
  
  const [personalization, setPersonalization] = useState<PersonalizationSettings>({
    tone: "neutral",
    maxChars: 280,
    goal: "conversation",
    category: "auto",
    language: "auto",
    temperature: 0.7,
  })
  
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handlePersonalizationChange = (field: keyof PersonalizationSettings, value: string | number) => {
    setPersonalization((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setMessages([])

    const valErrors = validate(values)
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUrl: values.senderUrl,
          recipientUrl: values.recipientUrl,
          problem: values.problem,
          solution: values.solution,
          ...personalization,
        }),
      })

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }

      const data: ApiResponse = await res.json()
      if (data.messages) {
        setMessages(data.messages.slice(0, 3))
      } else if (data.message) {
        setMessages([data.message])
      }
    } catch (err) {
      setErrors({ submit: "Unable to generate messages. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async (index: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUrl: values.senderUrl,
          recipientUrl: values.recipientUrl,
          problem: values.problem,
          solution: values.solution,
          ...personalization,
          rewriteIndex: index,
        }),
      })

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }

      const data: ApiResponse = await res.json()
      if (data.message) {
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[index] = data.message!
          return newMessages
        })
      }
    } catch (err) {
      setErrors({ submit: "Unable to regenerate message. Please try again." })
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">LinkedIn Cold Message Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Enter details below to generate concise, tailored outreach messages.
          </p>
        </header>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Controles de Personalización */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Personalization Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Tono */}
                <div>
                  <label htmlFor="tone" className="mb-2 block text-xs font-medium">
                    Tone
                  </label>
                  <select
                    id="tone"
                    value={personalization.tone}
                    onChange={(e) => handlePersonalizationChange("tone", e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none transition focus:ring-2 focus:ring-primary"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="warm">Warm</option>
                    <option value="direct">Direct</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                {/* Longitud */}
                <div>
                  <label htmlFor="maxChars" className="mb-2 block text-xs font-medium">
                    Max Characters
                  </label>
                  <select
                    id="maxChars"
                    value={personalization.maxChars}
                    onChange={(e) => handlePersonalizationChange("maxChars", Number(e.target.value))}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none transition focus:ring-2 focus:ring-primary"
                  >
                    <option value={180}>180</option>
                    <option value={280}>280</option>
                  </select>
                </div>

                {/* Objetivo */}
                <div>
                  <label htmlFor="goal" className="mb-2 block text-xs font-medium">
                    Goal
                  </label>
                  <select
                    id="goal"
                    value={personalization.goal}
                    onChange={(e) => handlePersonalizationChange("goal", e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none transition focus:ring-2 focus:ring-primary"
                  >
                    <option value="conversation">Conversation</option>
                    <option value="meeting">Meeting</option>
                    <option value="feedback">Feedback</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label htmlFor="category" className="mb-2 block text-xs font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    value={personalization.category}
                    onChange={(e) => handlePersonalizationChange("category", e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none transition focus:ring-2 focus:ring-primary"
                  >
                    <option value="auto">Auto</option>
                    <option value="question">Question</option>
                    <option value="mention">Mention</option>
                    <option value="congrats">Congratulations</option>
                  </select>
                </div>

                {/* Idioma */}
                <div>
                  <label htmlFor="language" className="mb-2 block text-xs font-medium">
                    Language
                  </label>
                  <select
                    id="language"
                    value={personalization.language}
                    onChange={(e) => handlePersonalizationChange("language", e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none transition focus:ring-2 focus:ring-primary"
                  >
                    <option value="auto">Auto</option>
                    <option value="es">Spanish</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Temperatura */}
                <div>
                  <label htmlFor="temperature" className="mb-2 block text-xs font-medium">
                    Temperature: {personalization.temperature}
                  </label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={personalization.temperature}
                    onChange={(e) => handlePersonalizationChange("temperature", Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campos principales */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-1">
                <label htmlFor="senderUrl" className="mb-2 block text-sm font-medium">
                  Sender LinkedIn Profile URL
                </label>
                <input
                  id="senderUrl"
                  name="senderUrl"
                  type="url"
                  value={values.senderUrl}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary ${
                    errors.senderUrl ? "border-destructive" : "border-input"
                  }`}
                  aria-invalid={!!errors.senderUrl}
                  aria-describedby={errors.senderUrl ? "senderUrl-error" : undefined}
                  required
                />
                {errors.senderUrl && (
                  <p id="senderUrl-error" className="mt-1 text-sm text-destructive">
                    {errors.senderUrl}
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="recipientUrl" className="mb-2 block text-sm font-medium">
                  Recipient LinkedIn Profile URL
                </label>
                <input
                  id="recipientUrl"
                  name="recipientUrl"
                  type="url"
                  value={values.recipientUrl}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/recipient-profile"
                  className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary ${
                    errors.recipientUrl ? "border-destructive" : "border-input"
                  }`}
                  aria-invalid={!!errors.recipientUrl}
                  aria-describedby={errors.recipientUrl ? "recipientUrl-error" : undefined}
                  required
                />
                {errors.recipientUrl && (
                  <p id="recipientUrl-error" className="mt-1 text-sm text-destructive">
                    {errors.recipientUrl}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="problem" className="mb-2 block text-sm font-medium">
                Problem You Solve
              </label>
              <textarea
                id="problem"
                name="problem"
                value={values.problem}
                onChange={handleChange}
                placeholder="e.g., SDRs spend too much time on manual prospecting..."
                rows={3}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary ${
                  errors.problem ? "border-destructive" : "border-input"
                }`}
                aria-invalid={!!errors.problem}
                aria-describedby={errors.problem ? "problem-error" : undefined}
                required
              />
              {errors.problem && (
                <p id="problem-error" className="mt-1 text-sm text-destructive">
                  {errors.problem}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="solution" className="mb-2 block text-sm font-medium">
                Solution You Offer
              </label>
              <textarea
                id="solution"
                name="solution"
                value={values.solution}
                onChange={handleChange}
                placeholder="e.g., An AI assistant that drafts tailored emails from CRM data..."
                rows={3}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary ${
                  errors.solution ? "border-destructive" : "border-input"
                }`}
                aria-invalid={!!errors.solution}
                aria-describedby={errors.solution ? "solution-error" : undefined}
                required
              />
              {errors.solution && (
                <p id="solution-error" className="mt-1 text-sm text-destructive">
                  {errors.solution}
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors.submit}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Messages"
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                All fields are required. URLs must begin with {"https://www.linkedin.com/"}.
              </p>
            </div>
          </form>
        </section>

        <section className="mt-8">
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg border bg-card p-6 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating personalized messages...
            </div>
          ) : null}

          {!isLoading && messages.length > 0 && (
            <>
              <h2 className="mb-4 text-lg font-semibold">Generated Messages</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {messages.map((msg, idx) => (
                  <MessageCard 
                    key={idx} 
                    index={idx} 
                    message={msg} 
                    maxChars={personalization.maxChars}
                    onRegenerate={() => handleRegenerate(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
