'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { patientFirstName, patientInitials, patientName, patientSummary } from '../../components/patient'

function PatientAvatar({ patient, size = 'h-8 w-8 text-[11.5px]' }) {
    return (
        <span className={`grid shrink-0 place-items-center rounded-full bg-accent-soft font-display font-bold text-accent-ink ${size}`} aria-hidden>
            {patientInitials(patient)}
        </span>
    )
}

export default function ChatBox({ attemptId, initialMessages = [], patient = null }) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(initialMessages)
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState('')
    const bottomRef = useRef(null)
    const inputRef = useRef(null)

    const firstName = patientFirstName(patient)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isSending])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim() || isSending) return;

        const userMessage = message.trim()

        setMessages((prev) => [...prev, { role: 'student', content: userMessage }])
        setMessage('')
        setError('')
        setIsSending(true)

        try {
            const response = await fetch("/api/ai/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attemptId, message: userMessage }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to get AI response")
            }

            setMessages((prev) => [...prev, { role: 'patient', content: data.message }])
        } catch (error) {
            console.error("AI consultation error:", error)

            setMessages((prev) => prev.slice(0, -1))
            setMessage(userMessage)
            setError(`${firstName} couldn't respond. Please try sending your message again.`)
        } finally {
            setIsSending(false)
            inputRef.current?.focus()
        }
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                <div className="mx-auto flex max-w-3xl flex-col gap-4">
                    {messages.length === 0 &&
                        <div className='mx-auto flex max-w-sm flex-col items-center gap-3 py-10 text-center'>
                            <PatientAvatar patient={patient} size='h-16 w-16 text-xl' />
                            <div className='flex flex-col gap-1'>
                                <b className='font-display text-lg'>You&apos;re with {patientName(patient)}</b>
                                {patientSummary(patient) && <span className='text-[13px] text-ink-3'>{patientSummary(patient)}</span>}
                            </div>
                            <p className='text-sm text-ink-2'>
                                {firstName === 'The patient' ? 'The patient is' : `${firstName} is`} waiting to be seen. Introduce yourself and start the consultation as you would in clinic.
                            </p>
                        </div>}

                    {messages.map((m, index) => {
                        const you = m.role === 'student'
                        const first = index === 0 || messages[index - 1].role !== m.role
                        return (
                            <div key={index} className={`flex items-end gap-2.5 ${you ? 'justify-end' : 'justify-start'}`}>
                                {!you && (first ? <PatientAvatar patient={patient} /> : <span className='w-8 shrink-0' />)}
                                <div className={`flex max-w-[85%] flex-col gap-1 sm:max-w-[75%] ${you ? 'items-end' : 'items-start'}`}>
                                    {first && <span className='px-1 text-[11.5px] font-semibold text-ink-3'>{you ? 'You' : firstName}</span>}
                                    <div className={`rounded-[20px] px-4 py-3 text-[14.5px] leading-6 ${you ? 'rounded-br-md bg-grad text-on-hero' : 'rounded-bl-md bg-surface-2'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {isSending && (
                        <div className="flex items-end gap-2.5" aria-live="polite">
                            <PatientAvatar patient={patient} />
                            <div className="flex items-center gap-2 rounded-[20px] rounded-bl-md bg-surface-2 px-4 py-3 text-sm text-ink-3">
                                <span className='flex gap-1' aria-hidden>
                                    {[0, 1, 2].map((d) => <i key={d} className='h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3' style={{ animationDelay: `${d * 150}ms` }} />)}
                                </span>
                                {firstName} is typing
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">
                {error && <p className="mx-auto mb-2 max-w-3xl text-[13.5px] text-bad">{error}</p>}

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-3xl items-center gap-2 rounded-full bg-[linear-gradient(180deg,var(--surface-2),var(--accent-soft))] py-1.5 pl-[22px] pr-1.5 shadow-[inset_0_0_0_1px_var(--line)]"
                >
                    <input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={firstName === 'The patient' ? 'Talk to the patient...' : `Talk to ${firstName}...`}
                        aria-label={`Message to ${patientName(patient)}`}
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
                    Speak to {firstName === 'The patient' ? 'the patient' : firstName} as you would in a real consultation.
                </p>
            </div>
        </div>
    )
}
