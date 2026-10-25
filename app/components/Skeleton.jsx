import React from 'react'

export function Bone({ className = '' }) {
    const background = /(^|\s)bg-/.test(className) ? '' : 'bg-surface-3'
    return <div aria-hidden className={`animate-pulse rounded-lg ${background} motion-reduce:animate-none ${className}`} />
}

export function SkeletonPage({ children, label = 'Loading', className = '' }) {
    return (
        <div role='status' aria-live='polite' className={`mx-auto flex w-full max-w-[1240px] flex-col gap-[22px] px-4 pb-28 pt-6 sm:px-6 lg:px-7 lg:pb-16 lg:pt-7 ${className}`}>
            <span className='sr-only'>{label}…</span>
            {children}
        </div>
    )
}

export function SkeletonHeader({ withIcon = true, withAction = false }) {
    return (
        <div className='flex flex-wrap items-end justify-between gap-4'>
            <div className='flex items-start gap-4'>
                {withIcon && <Bone className='h-12 w-12 rounded-xl' />}
                <div className='flex flex-col gap-2'>
                    <Bone className='h-3 w-24' />
                    <Bone className='h-8 w-56 sm:w-72' />
                    <Bone className='h-4 w-40' />
                </div>
            </div>
            {withAction && <Bone className='h-11 w-36 rounded-full' />}
        </div>
    )
}

export function SkeletonCard({ children, className = '' }) {
    return <div className={`card p-5 sm:p-[26px] ${className}`}>{children}</div>
}

export function SkeletonRow({ withPill = true }) {
    return (
        <div className='card flex items-center gap-4 p-4'>
            <Bone className='h-11 w-11 shrink-0 rounded-xl' />
            <div className='flex flex-1 flex-col gap-2'>
                <Bone className='h-4 w-2/3 max-w-xs' />
                <Bone className='h-3 w-1/3 max-w-[10rem]' />
            </div>
            {withPill && <Bone className='h-8 w-20 shrink-0 rounded-full' />}
        </div>
    )
}

export function SkeletonSection({ rows = 3 }) {
    return (
        <SkeletonCard className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <Bone className='h-3 w-20' />
                <Bone className='h-6 w-48' />
            </div>
            {Array.from({ length: rows }, (_, i) => <SkeletonRow key={i} withPill={false} />)}
        </SkeletonCard>
    )
}

export function SkeletonText({ lines = 3 }) {
    return (
        <div className='flex flex-col gap-2'>
            {Array.from({ length: lines }, (_, i) =>
                <Bone key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />)}
        </div>
    )
}
