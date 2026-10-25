import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { btn, Chip, Meter } from '@/app/components/ui'

function formatDate(value) {
    if (!value) return ''
    return new Date(value).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}

const STATUS = {
    completed: { tone: 'good', label: 'Completed' },
    started: { tone: 'warn', label: 'In progress' },
    abandoned: { tone: 'neutral', label: 'Abandoned' },
}

function AttemptAction({ attempt }) {
    if (attempt.status === 'completed') {
        return (
            <Link href={`/cases/${attempt.slug}/feedback/${attempt.attemptId}`} className={btn('ghost', 'sm')}>
                View feedback <ArrowRight aria-hidden />
            </Link>
        )
    }
    if (attempt.status === 'started') {
        return (
            <Link href={`/cases/${attempt.slug}/active-session?attempt=${attempt.attemptId}`} className={btn('primary', 'sm')}>
                <Play aria-hidden /> Resume
            </Link>
        )
    }
    return null
}

export default function AttemptList({ attempts, showCase = true, emptyText = "You haven't attempted any cases yet." }) {
    if (attempts.length === 0) {
        return <div className='card p-8 text-center text-ink-2'>{emptyText}</div>
    }

    return (
        <ul className='flex flex-col gap-2.5'>
            {attempts.map((attempt) => {
                const status = STATUS[attempt.status] ?? STATUS.abandoned
                return (
                    <li key={attempt.attemptId} className='card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 px-5 py-[18px] sm:px-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_72px_auto]'>
                        <div className='flex min-w-0 flex-col gap-1'>
                            <span className='truncate font-display text-[17px] font-bold tracking-[-0.02em]'>
                                {showCase ? attempt.title : `Attempt ${attempt.attemptNumber}`}
                            </span>
                            <span className='text-[13px] text-ink-3'>
                                {showCase && <>Attempt {attempt.attemptNumber} · </>}
                                {formatDate(attempt.completedAt ?? attempt.startedAt)}
                                {' · '}{attempt.questionsAsked} {attempt.questionsAsked === 1 ? 'question' : 'questions'}
                            </span>
                        </div>

                        <div className='hidden items-center gap-3 md:flex'>
                            {attempt.score !== null
                                ? <Meter value={attempt.score} size='sm' n={28} className='flex-1' />
                                : <Chip tone={status.tone} dot>{status.label}</Chip>}
                        </div>

                        <span className='hidden text-right md:block'>
                            {attempt.score !== null &&
                                <span className='num text-[26px] tracking-[-0.03em]'>{attempt.score}<small className='ml-0.5 text-[0.36em] font-semibold opacity-60'>%</small></span>}
                        </span>

                        <div className='flex items-center justify-end gap-3'>
                            <span className='md:hidden'>
                                {attempt.score !== null
                                    ? <span className='num text-[22px] tracking-[-0.03em]'>{attempt.score}%</span>
                                    : <Chip tone={status.tone} dot>{status.label}</Chip>}
                            </span>
                            <AttemptAction attempt={attempt} />
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}
