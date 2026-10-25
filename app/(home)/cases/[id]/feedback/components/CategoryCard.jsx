'use client'

import { ChevronDown } from 'lucide-react'
import Details from './Details'
import { scoreBand } from './ui'
import { Chip, Meter } from '@/app/components/ui'

export default function CategoryCard({ id, title, subtitle, category, open, onToggle }) {
    const band = scoreBand(category.score)

    return (
        <section id={id} aria-labelledby={`${id}-title`} className='card scroll-mt-6 overflow-hidden'>
            <h2 id={`${id}-title`}>
                <button
                    type='button'
                    onClick={onToggle}
                    aria-expanded={open}
                    aria-controls={`${id}-body`}
                    className='grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_44px_20px] items-center gap-[18px] px-5 py-[22px] text-left sm:grid-cols-[minmax(0,1fr)_auto_minmax(80px,160px)_48px_20px] sm:px-6'
                >
                    <span className='flex min-w-0 flex-col gap-[3px]'>
                        <span className='font-display text-lg font-bold tracking-[-0.02em]'>{title}</span>
                        <span className='text-[13px] font-normal text-ink-3'>{subtitle}</span>
                    </span>
                    <span className='hidden sm:inline'><Chip tone={band.tone}>{band.label}</Chip></span>
                    <Meter value={category.score} n={20} size='sm' className='hidden sm:flex' />
                    <span className='num text-right text-[26px] tracking-[-0.03em]'>{category.score}</span>
                    <ChevronDown className={`h-5 w-5 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                </button>
            </h2>

            {open &&
                <div id={`${id}-body`} className='flex flex-col gap-5 px-5 pb-6 sm:px-6'>
                    {category.description && <p className='text-ink-2'>{category.description}</p>}

                    {category.performance.length > 0 &&
                        <ul>
                            {category.performance.map((item, idx) => {
                                const pct = item.maxScore ? (item.score / item.maxScore) * 100 : 0
                                return (
                                    <li key={idx} className='grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4 border-t border-line py-3 first:border-t-0 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)_minmax(80px,140px)_40px]'>
                                        <b className='text-sm'>{item.section}</b>
                                        <p className='col-span-2 row-start-2 text-[13.5px] text-ink-2 sm:col-span-1 sm:row-start-auto'>{item.details}</p>
                                        <Meter value={pct} n={10} size='sm' className='hidden sm:flex' />
                                        <span className='text-right text-sm font-bold tabular-nums'>
                                            {item.score}<span className='font-normal text-ink-3'>/{item.maxScore}</span>
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>}

                    {category.strengths.length + category.improvements.length + category.recommendations.length > 0 &&
                        <Details
                            strengths={category.strengths}
                            improvements={category.improvements}
                            recommendations={category.recommendations}
                        />}
                </div>}
        </section>
    )
}
