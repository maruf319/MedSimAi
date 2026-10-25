'use client'
import { ArrowLeft, NotebookPen, StopCircle } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { btn } from '@/app/components/ui'

function formatElapsed(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export default function Header({ slug, title, attemptId, startedAt, onToggleNotes }) {
    const [now, setNow] = useState(() => Date.now());
    const [isStopping, setIsStopping] = useState(false);
    const [error, setError] = useState('');
    const isCompletedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval)
    }, [])

    const elapsed = Math.max(0, Math.floor((now - new Date(startedAt ?? now).getTime()) / 1000));

    async function handleSession() {
        if (isStopping) return;

        setIsStopping(true);
        setError('');

        try {
            if (!isCompletedRef.current) {
                const completeResponse = await fetch(`/api/attempts/${attemptId}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: 'completed' })
                });
                const completeData = await completeResponse.json();

                if (!completeResponse.ok || !completeData.success) {
                    throw new Error(
                        completeData.message || "Failed to complete attempt"
                    );
                }
                isCompletedRef.current = true;
            }

            try {
                const feedbackResponse = await fetch(`/api/attempts/${attemptId}/feedback`, { method: "POST" });
                if (!feedbackResponse.ok) console.error("Feedback generation failed:", await feedbackResponse.text());
            } catch (feedbackError) {
                console.error("Feedback generation failed:", feedbackError);
            }

            router.push(`/cases/${slug}/feedback/${attemptId}`);
        } catch (error) {
            console.error(error);
            setError("Couldn't end the session. Please try again.");
            setIsStopping(false);
        }
    }
    return (
        <div className='mx-auto flex w-full max-w-[1240px] flex-col gap-2'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <Link href={`/cases/${slug}`} className='flex min-w-0 items-center gap-3'>
                    <span className='grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line)]'><ArrowLeft className='h-[18px] w-[18px]' /></span>
                    <span className='flex min-w-0 flex-col'>
                        <b className='truncate font-display text-[19px] font-bold tracking-[-0.02em]'>{title}</b>
                        <span className='text-xs text-ink-3'>Live session</span>
                    </span>
                </Link>

                <div className='flex items-center gap-2'>
                    <div className='flex h-10 items-center gap-2.5 rounded-full bg-surface px-4 font-mono text-sm tabular-nums shadow-[inset_0_0_0_1px_var(--line)]' aria-label='Session time'>
                        <span className='h-2 w-2 animate-pulse rounded-full bg-bad' aria-hidden />
                        {/* Server and browser clocks differ by a moment; the next tick corrects it */}
                        <span suppressHydrationWarning>{formatElapsed(elapsed)}</span>
                    </div>
                    <button
                        type='button'
                        onClick={onToggleNotes}
                        className={btn('ghost', 'sm', 'lg:hidden')}
                    >
                        <NotebookPen aria-hidden /> Notes
                    </button>
                    <button
                        className={btn('primary', 'md')}
                        onClick={handleSession}
                        disabled={isStopping}
                    >
                        <StopCircle aria-hidden />
                        {isStopping ? 'Ending and scoring...' : 'Stop session'}
                    </button>
                </div>
            </div>
            {error && <p className='text-right text-[13.5px] text-bad'>{error}</p>}
        </div>
    )
}
