'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ChatBox({ attemptId, initialMessages = [] }) {

    const [message, setMessage] = useState('')

    const [messages, setMessages] = useState(initialMessages)

    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState('')

    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isSending])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim() || isSending) return;

        const userMessage = message.trim()

        setMessages((prev) => [
            ...prev,
            {
                role: 'student',
                content: userMessage,
            },
        ])

        setMessage('')
        setError('')
        setIsSending(true)

        try {
            const response = await fetch("/api/ai/consultation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    attemptId,
                    message: userMessage,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to get AI response")
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: 'patient',
                    content: data.message,
                },
            ])

        } catch (error) {
            console.error("AI consultation error:", error)

            setMessages((prev) => prev.slice(0, -1))
            setMessage(userMessage)
            setError("The patient couldn't respond. Please try sending your message again.")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">

            <div className="flex-1 overflow-y-auto p-3 sm:p-6">

                <div className="mx-auto flex max-w-3xl flex-col gap-5">

                    {messages.map((message, index) => (

                        <div
                            key={index}
                            className={`flex ${message.role === 'student' ? 'justify-end' : 'justify-start'}`}
                        >

                            <div
                                className={`max-w-[85%] rounded-[20px] px-4 py-3 text-[14.5px] leading-6 sm:max-w-[75%] ${message.role === 'student'
                                    ? 'rounded-br-md bg-grad text-on-hero'
                                    : 'rounded-bl-md bg-surface-2'
                                    }`}
                            >
                                {message.content}
                            </div>

                        </div>

                    ))}

                    {isSending && (
                        <div className="flex justify-start">
                            <div className="rounded-[20px] rounded-bl-md bg-surface-2 px-4 py-3 text-sm italic text-ink-3">
                                Patient is typing...
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />

                </div>

            </div>

            <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">

                {error && (
                    <p className="mx-auto mb-2 max-w-3xl text-[13.5px] text-bad">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-3xl items-center gap-2 rounded-full bg-[linear-gradient(180deg,var(--surface-2),var(--accent-soft))] py-1.5 pl-[22px] pr-1.5 shadow-[inset_0_0_0_1px_var(--line)]"
                >

                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask the patient anything..."
                        aria-label="Message to the patient"
                        className="h-[46px] flex-1 bg-transparent text-[14.5px] outline-none"
                    />

                    <button
                        type="submit"
                        disabled={!message.trim() || isSending}
                        aria-label="Send"
                        className="grid h-[46px] w-[46px] shrink-0 cursor-pointer place-items-center rounded-full bg-grad text-on-hero transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowUp size={19} />
                    </button>

                </form>

                <p className="mt-2 text-center text-xs text-ink-3">
                    Ask questions naturally as you would during a real consultation.
                </p>

            </div>

        </div>
    )
}
