import React from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import Section from './Section'
import { btn, LinkButton } from '@/app/components/ui'

function timeAgo(value) {
    const seconds = Math.round((new Date(value) - Date.now()) / 1000)
    const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]]
    const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    for (const [unit, size] of units) {
        if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit)
    }
    return 'just now'
}

export default function ContinueSessions({ sessions, total }) {
    return (
        <Section
            title='Continue where you left off'
            action={total > sessions.length && <LinkButton href='/attempts' variant='ghost' size='sm'>View all</LinkButton>}
        >
            <ul className='flex flex-col'>
                {sessions.map((s) =>
                    <li key={s.attemptId} className='flex items-center gap-4 border-t border-line py-4 first:border-t-0 first:pt-1 last:pb-0'>
                        <span className='flex min-w-0 flex-1 flex-col'>
                            <span className='truncate text-[15px] font-semibold'>{s.title}</span>
                            <span className='text-[13px] text-ink-3'>Attempt {s.attemptNumber} · started {timeAgo(s.startedAt)}</span>
                        </span>
                        <Link href={`/cases/${s.slug}/active-session?attempt=${s.attemptId}`} className={btn('primary', 'sm')}>
                            <Play aria-hidden /> Resume
                        </Link>
                    </li>)}
            </ul>
        </Section>
    )
}
