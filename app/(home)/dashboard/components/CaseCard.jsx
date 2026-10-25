import { ArrowRight } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Difficulty } from '@/app/components/ui'

/** Recommended case tile */
export default function CaseCard({ href, title, type, level }) {
    return (
        <Link href={href} className='card group flex flex-col gap-[22px] p-5 transition hover:shadow-[0_0_0_1px_var(--accent)] sm:p-[26px]'>
            <div className='flex flex-col gap-2'>
                {type && <span className='text-[13px] font-medium text-ink-2'>{type}</span>}
                <h3 className='text-[19px] font-bold leading-snug'>{title}</h3>
            </div>
            <div className='flex items-center justify-between gap-3'>
                {level ? <Difficulty level={level} /> : <span />}
                <span className='grid h-10 w-10 place-items-center rounded-full bg-surface-2 transition group-hover:bg-grad group-hover:text-on-hero'>
                    <ArrowRight className='h-[18px] w-[18px]' aria-hidden />
                </span>
            </div>
        </Link>
    )
}
