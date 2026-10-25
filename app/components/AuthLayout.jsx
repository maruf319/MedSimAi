import React from 'react'
import AuthHero from './AuthHero'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

/** Shared layout for sign in, sign up and admin sign in */
export default function AuthLayout({ heroTitle, tag, title, description, children }) {
    return (
        <div className='grid min-h-full w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
            <section className='relative flex items-center justify-center px-4 py-12 sm:px-6'>
                <ThemeToggle className='absolute right-4 top-4 h-11 w-11 !rounded-full' />
                <div className='flex w-full max-w-[420px] flex-col gap-[26px]'>
                    <Logo tag={tag} />
                    <div className='flex flex-col gap-2.5'>
                        <h1 className='text-[32px] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[38px]'>{title}</h1>
                        {description && <p className='text-ink-2'>{description}</p>}
                    </div>
                    {children}
                </div>
            </section>
            <AuthHero title={heroTitle} />
        </div>
    )
}

export function Divider({ children }) {
    return (
        <div className='flex items-center gap-3 text-[12.5px] font-medium text-ink-3'>
            <span className='h-px flex-1 bg-line' />{children}<span className='h-px flex-1 bg-line' />
        </div>
    )
}

export function FormError({ children }) {
    if (!children) return null
    return <p role='alert' className='rounded-[14px] bg-bad-soft px-3.5 py-3 text-[13.5px] text-bad'>{children}</p>
}
