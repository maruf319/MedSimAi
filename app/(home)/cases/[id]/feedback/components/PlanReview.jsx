'use client'

import { useState } from 'react'
import { ChevronDown, CircleAlert, CircleCheck, CircleX } from 'lucide-react'
import { btn } from '@/app/components/ui'

const TONES = {
    good: 'bg-good-soft [&_h3]:text-good',
    warn: 'bg-warn-soft [&_h3]:text-warn',
    accent: 'bg-accent-soft [&_h3]:text-accent-ink',
}

function PointList({ icon: Icon, tone, title, points, empty }) {
    return (
        <div className={`flex flex-col gap-2 rounded-[18px] p-[18px] ${TONES[tone]}`}>
            <h3 className='flex items-center gap-2 font-sans text-[13.5px] font-bold'><Icon className='h-4 w-4' aria-hidden /> {title}</h3>
            {points.length === 0
                ? <p className='text-[13.5px] text-ink-2'>{empty}</p>
                : <ul className='flex list-disc flex-col gap-1.5 pl-[18px]'>
                    {points.map((point, idx) => <li key={idx} className='text-[13.5px] leading-snug'>{point}</li>)}
                </ul>}
        </div>
    )
}

export default function PlanReview({ plan, review }) {
    const [showPlan, setShowPlan] = useState(false)

    return (
        <section className='card p-5 sm:p-[26px]'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='flex flex-col gap-1.5'>
                    <h2 className='text-[22px] font-bold'>Your plan vs. what you did</h2>
                    {review?.summary && <p className='text-[13.5px] text-ink-2'>{review.summary}</p>}
                </div>
                <button type='button' onClick={() => setShowPlan((v) => !v)} aria-expanded={showPlan} className={btn('ghost', 'sm')}>
                    {showPlan ? 'Hide your plan' : 'Show your plan'}
                    <ChevronDown className={`transition-transform ${showPlan ? 'rotate-180' : ''}`} aria-hidden />
                </button>
            </div>

            {showPlan &&
                <p className='mt-4 whitespace-pre-wrap rounded-[18px] bg-surface-2 p-4 text-sm leading-6'>{plan}</p>}

            {review
                ? <div className='mt-[18px] grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]'>
                    <PointList icon={CircleCheck} tone='good' title='Planned and done' points={review.followed} empty='None of the planned points were carried out.' />
                    <PointList icon={CircleX} tone='warn' title='Planned but skipped' points={review.skipped} empty='You followed your whole plan.' />
                    <PointList icon={CircleAlert} tone='accent' title='Missing from your plan' points={review.missing} empty='Your plan covered the important points.' />
                </div>
                : <p className='mt-4 text-[13.5px] text-ink-2'>
                    This attempt&apos;s feedback was generated before plan reviews were added, so only your plan is shown.
                </p>}
        </section>
    )
}
