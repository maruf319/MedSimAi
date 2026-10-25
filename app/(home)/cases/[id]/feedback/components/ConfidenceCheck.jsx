import React from 'react'
import { Chip, Meter } from '@/app/components/ui'

const VERDICTS = {
    calibrated: { label: 'Well calibrated', tone: 'good' },
    overconfident: { label: 'Overconfident', tone: 'warn' },
    underconfident: { label: 'Underconfident', tone: 'accent' },
}

export default function ConfidenceCheck({ rows }) {
    const overconfident = rows.filter((r) => r.verdict === 'overconfident').map((r) => r.skill.toLowerCase())

    return (
        <section className='card p-5 sm:p-[26px]'>
            <div className='mb-[18px] flex flex-col gap-1.5'>
                <h2 className='text-[22px] font-bold'>Confidence check</h2>
                <p className='text-[13.5px] text-ink-2'>
                    {overconfident.length > 0
                        ? `You rated yourself higher than you scored in ${overconfident.join(' and ')}. These are worth extra practice.`
                        : 'How confident you felt before the case, compared with how you scored.'}
                </p>
            </div>

            <ul>
                {rows.map((row) => {
                    const verdict = VERDICTS[row.verdict]
                    return (
                        <li key={row.skill} className='grid grid-cols-2 items-center gap-[18px] border-t border-line py-3.5 first:border-t-0 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,.8fr)_minmax(0,1fr)_auto]'>
                            <b className='col-span-2 text-sm sm:col-span-1'>{row.skill}</b>
                            <span className='flex flex-col gap-1.5'>
                                <span className='text-xs text-ink-3'>Confidence {row.rating}/5</span>
                                <span className='inline-flex gap-1' aria-hidden>
                                    {[1, 2, 3, 4, 5].map((n) => <i key={n} className={`h-2 w-[18px] rounded-[3px] ${n <= row.rating ? 'bg-accent' : 'bg-surface-3'}`} />)}
                                </span>
                            </span>
                            <span className='flex flex-col gap-1.5'>
                                <span className='text-xs text-ink-3'>Score {row.score}%</span>
                                <Meter value={row.score} n={20} size='sm' />
                            </span>
                            <span className='col-span-2 sm:col-span-1'><Chip tone={verdict.tone}>{verdict.label}</Chip></span>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
