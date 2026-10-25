import { ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Difficulty } from '@/app/components/ui'

export default function CaseCard({ title, slug, image, tags, specialty, difficulty, duration, patient, description, completedBy, bestScore, priority = false }) {
    const patientType = patient?.age == null ? null : patient.age >= 18 ? 'Adult' : 'Pediatric'

    return (
        <Link href={`/cases/${slug}`} className='card group flex flex-col gap-3 p-[22px] transition hover:shadow-[0_0_0_1px_var(--accent)]'>
            <div className='flex items-center gap-3'>
                <span className='relative h-11 w-11 shrink-0 overflow-hidden rounded-[14px] bg-surface-2'>
                    <Image fill alt='' src={image || '/cases/person.png'} priority={priority} sizes='44px' className='object-cover object-[center_25%]' />
                </span>
                <span className='flex min-w-0 flex-1 flex-col'>
                    {specialty && <span className='truncate text-[13px] font-medium text-ink-2'>{specialty}</span>}
                    <span className='flex items-center gap-1 text-xs text-ink-3'>
                        {duration && <><Clock className='h-3 w-3' aria-hidden /> {duration}</>}
                        {patientType && <>{duration ? ' · ' : ''}{patientType}</>}
                    </span>
                </span>
            </div>
            <h2 className='text-[21px] font-bold leading-snug tracking-[-0.03em]'>{title}</h2>
            <p className='line-clamp-2 text-sm text-ink-2'>{description}</p>
            {tags.length > 0 &&
                <p className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-3'>
                    {tags.map((t) => <span key={t}>#{t}</span>)}
                </p>}
            <div className='mt-auto flex items-end justify-between gap-3 border-t border-line pt-4'>
                <span className='flex flex-col gap-2'>
                    <Difficulty level={difficulty} />
                    <span className='text-[12.5px] text-ink-3'>{completedBy} {completedBy === 1 ? 'learner' : 'learners'} completed</span>
                </span>
                <span className='flex items-end gap-3'>
                    <span className='flex flex-col items-end gap-1.5'>
                        <span className='num text-[26px] tracking-[-0.03em]'>
                            {bestScore === null ? <span className='text-ink-3'>—</span> : <>{bestScore}<small className='ml-0.5 text-[0.36em] font-semibold opacity-60'>%</small></>}
                        </span>
                        <span className='text-[12.5px] text-ink-3'>Your best</span>
                    </span>
                    <span className='grid h-10 w-10 place-items-center rounded-full bg-surface-2 transition group-hover:bg-grad group-hover:text-on-hero'>
                        <ArrowRight className='h-[18px] w-[18px]' aria-hidden />
                    </span>
                </span>
            </div>
        </Link>
    )
}
