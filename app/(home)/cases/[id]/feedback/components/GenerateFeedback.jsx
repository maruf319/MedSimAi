'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/app/components/ui'

export default function GenerateFeedback({ attemptId }) {
    const router = useRouter()
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState('')

    async function generate() {
        setIsGenerating(true)
        setError('')
        try {
            const response = await fetch(`/api/attempts/${attemptId}/feedback`, { method: 'POST' })
            const data = await response.json()
            if (!response.ok || !data.success) throw new Error(data.message)
            router.refresh()
        } catch (err) {
            setError(err.message || "Feedback couldn't be generated. Please try again.")
            setIsGenerating(false)
        }
    }

    return (
        <section className='hero flex flex-col items-start gap-4 p-6 sm:p-9'>
            <span className='orb' style={{ '--orb': '64px' }} aria-hidden />
            <div className='flex flex-col gap-2'>
                <h2 className='text-[26px] font-bold text-on-hero'>Your feedback isn&apos;t ready yet</h2>
                <p className='max-w-[52ch] text-on-hero-2'>
                    The AI evaluator reviews your whole consultation. This usually takes 10 to 30 seconds.
                </p>
            </div>
            <Button variant='white' onClick={generate} disabled={isGenerating}>
                <Sparkles aria-hidden />
                {isGenerating ? 'Generating feedback...' : 'Generate feedback'}
            </Button>
            {error && <p className='rounded-[14px] bg-bad-soft px-3.5 py-2.5 text-[13.5px] text-bad'>{error}</p>}
        </section>
    )
}
