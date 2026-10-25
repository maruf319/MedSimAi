import React from 'react'
import Image from 'next/image'
import { Meter } from './ui'

// Illustrative sample shown on the sign-in pages
const SAMPLE = [
    ['Consultation', 88],
    ['Clinical reasoning', 84],
    ['Communication', 86],
]

const FADE = 'linear-gradient(to bottom, #000 48%, rgb(0 0 0 / 0.55) 72%, transparent 97%)'

export default function AuthHero({ title = 'Practise the consultation before it’s real.' }) {
    return (
        <aside aria-hidden className='hero m-3 flex min-h-[340px] flex-col justify-between gap-10 p-7 sm:p-12 lg:m-3.5 lg:min-h-0 lg:p-14'>
            <Image
                src='/auth/doctor.webp'
                alt=''
                width={522}
                height={900}
                priority
                className='pointer-events-none absolute bottom-0 right-[3%] h-[70%] w-auto max-w-none select-none'
                style={{ WebkitMaskImage: FADE, maskImage: FADE }}
            />
            <div className='relative z-[1] flex max-w-[56%] flex-col gap-[18px] lg:max-w-[520px]'>
                <h2 className='display text-[34px] text-on-hero sm:text-[46px] xl:text-[58px]'>{title}</h2>
                <p className='max-w-[40ch] text-[15px] text-on-hero-2 sm:text-[17px]'>Talk to AI patients, then see exactly what to improve.</p>
            </div>
            <div className='glass relative z-[1] hidden max-w-[300px] flex-col gap-[18px] rounded-[26px] p-[22px] lg:flex'>
                <div className='flex items-center justify-between gap-3 text-[13px] text-on-hero-2'>
                    <span>Session feedback · Acute Chest Pain</span>
                    <span className='shrink-0 whitespace-nowrap rounded-full bg-hero-glass px-3 py-1 text-xs text-on-hero'>Very good</span>
                </div>
                <div className='flex items-end gap-4'>
                    <span className='num text-[64px] sm:text-[80px]'>86</span>
                    <span className='pb-2 text-[13px] text-on-hero-2'>out of 100</span>
                </div>
                <div className='flex flex-col gap-3'>
                    {SAMPLE.map(([label, score]) =>
                        <div key={label} className='grid grid-cols-[104px_minmax(0,1fr)_26px] items-center gap-3 text-[13.5px]'>
                            <span>{label}</span>
                            <Meter value={score} n={20} size='sm' onHero />
                            <b className='text-right tabular-nums'>{score}</b>
                        </div>)}
                </div>
            </div>
        </aside>
    )
}
