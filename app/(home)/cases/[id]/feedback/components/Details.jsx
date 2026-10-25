import React from 'react'
import { Lightbulb, ThumbsUp, TrendingUp } from 'lucide-react'

const TONES = {
    good: 'bg-good-soft [&_h3]:text-good',
    warn: 'bg-warn-soft [&_h3]:text-warn',
    accent: 'bg-accent-soft [&_h3]:text-accent-ink',
}

function PointPanel({ icon: Icon, title, points, tone, ordered = false, empty }) {
    const List = ordered ? 'ol' : 'ul'
    return (
        <div className={`flex flex-col gap-2 rounded-[18px] p-[18px] ${TONES[tone]}`}>
            <h3 className='flex items-center gap-2 font-sans text-[13.5px] font-bold'>
                <Icon className='h-4 w-4' aria-hidden /> {title}
            </h3>
            {points.length === 0
                ? <p className='text-[13.5px] text-ink-2'>{empty}</p>
                : <List className={`flex flex-col gap-1.5 pl-[18px] ${ordered ? 'list-decimal' : 'list-disc'}`}>
                    {points.map((item, idx) => <li key={idx} className='text-[13.5px] leading-snug'>{item}</li>)}
                </List>}
        </div>
    )
}

export default function Details({ strengths, improvements, recommendations }) {
    return (
        <div className='grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]'>
            <PointPanel icon={ThumbsUp} title='What went well' points={strengths} tone='good' empty='Nothing noted for this category.' />
            <PointPanel icon={TrendingUp} title='Areas to improve' points={improvements} tone='warn' empty='Nothing noted for this category.' />
            {recommendations.length > 0 &&
                <PointPanel icon={Lightbulb} title='Next time' points={recommendations} tone='accent' ordered />}
        </div>
    )
}
