import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function PageContainer({ children, className = '' }) {
    return (
        <div className={`mx-auto flex w-full max-w-[1240px] flex-col gap-[22px] px-4 pb-28 pt-6 sm:px-6 lg:px-7 lg:pb-16 lg:pt-7 ${className}`}>
            {children}
        </div>
    )
}

/** Page title row. `eyebrow` and `icon` are accepted for compatibility but no longer shown. */
export default function PageHeader({ title, description, actions, back }) {
    return (
        <div className='mb-1.5 flex flex-wrap items-end justify-between gap-5'>
            <div className='flex min-w-0 flex-col gap-2'>
                {back && <BackLink href={back.href}>{back.label}</BackLink>}
                <h1 className='text-[32px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[40px] lg:text-[46px]'>{title}</h1>
                {description && <p className='text-[15.5px] text-ink-2'>{description}</p>}
            </div>
            {actions && <div className='flex flex-wrap items-center gap-2.5'>{actions}</div>}
        </div>
    )
}

export function BackLink({ href, children }) {
    return (
        <Link href={href} className='inline-flex w-fit items-center gap-1.5 text-[13.5px] font-medium text-ink-2 hover:text-ink'>
            <ArrowLeft className='h-4 w-4' aria-hidden /> {children}
        </Link>
    )
}

/** Level-1 hero card */
export function HeroBanner({ children, className = '' }) {
    return <section className={`hero p-6 sm:p-8 ${className}`}>{children}</section>
}

/** Frosted stats row for use inside a hero */
export function GlassStats({ stats }) {
    return (
        <div className={`glass grid rounded-[26px] py-5 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
            {stats.map((stat, i) =>
                <div key={stat.label} className={`flex flex-col items-center gap-2 px-2 text-center ${i > 0 ? 'border-l border-on-hero-line' : ''}`}>
                    <span className='num text-[30px] sm:text-[48px]'>{stat.value}</span>
                    <span className='text-xs text-on-hero-2 sm:text-[13px]'>{stat.label}</span>
                </div>)}
        </div>
    )
}
