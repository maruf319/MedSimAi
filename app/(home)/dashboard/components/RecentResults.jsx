import React from 'react'
import Link from 'next/link'
import Section from './Section'
import { LinkButton, Meter } from '@/app/components/ui'
import { scoreBand } from '@/app/(home)/cases/[id]/feedback/components/ui'

export default function RecentResults({ results }) {
    return (
        <Section title='Recent results' action={<LinkButton href='/attempts' variant='ghost' size='sm'>View all</LinkButton>}>
            {results.length === 0
                ? <p className='text-ink-2'>Complete a case to see your results here.</p>
                : <ul className='flex flex-col'>
                    {results.map((r) =>
                        <li key={r.attemptId}>
                            <Link
                                href={`/cases/${r.slug}/feedback/${r.attemptId}`}
                                className='group grid grid-cols-[minmax(0,1fr)_60px] items-center gap-5 border-t border-line py-4 sm:grid-cols-[minmax(0,1fr)_minmax(80px,180px)_72px]'
                            >
                                <span className='flex min-w-0 flex-col'>
                                    <span className='truncate text-[15px] font-semibold group-hover:text-accent-ink'>{r.title}</span>
                                    <span className='truncate text-[13px] text-ink-3'>{[r.specialty, scoreBand(r.score).label].filter(Boolean).join(' · ')}</span>
                                </span>
                                <Meter value={r.score} size='sm' className='hidden sm:flex' />
                                <span className='num text-right text-[26px] tracking-[-0.03em]'>{r.score}<small className='ml-0.5 text-[0.36em] font-semibold opacity-60'>%</small></span>
                            </Link>
                        </li>)}
                </ul>}
        </Section>
    )
}
