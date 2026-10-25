import Link from 'next/link'

export function LogoMark({ className = 'h-6 w-6' }) {
    return (
        <svg viewBox="0 0 480 480" aria-hidden className={`shrink-0 ${className}`}>
            <path fill="currentColor" d="M160 160V10a10 10 0 0 1 10-10h140a10 10 0 0 1 10 10v150zM320 160h150a10 10 0 0 1 10 10v140a10 10 0 0 1-10 10H320zM160 160H10a10 10 0 0 0-10 10v140a10 10 0 0 0 10 10A150 150 0 0 0 160 170zM320 320v150a10 10 0 0 1-10 10H170a10 10 0 0 1-10-10A150 150 0 0 1 310 320z" />
        </svg>
    )
}

/** Mark + wordmark. `tag` adds a small label such as "Admin"; `compact` hides the text (icon rail). */
export default function Logo({ href, tag, compactAtLg = false }) {
    const content = (
        <span className='flex items-center gap-2.5 font-display text-lg font-bold tracking-[-0.03em] text-ink'>
            <LogoMark />
            <span className={compactAtLg ? 'lg:hidden xl:inline' : ''}>MedSimAI</span>
            {tag &&
                <small className={`rounded-full bg-accent-soft px-2.5 py-[3px] font-sans text-[11px] font-semibold tracking-normal text-accent-ink ${compactAtLg ? 'lg:hidden xl:inline' : ''}`}>{tag}</small>}
        </span>
    )
    return href ? <Link href={href} aria-label='MedSimAI home' className='inline-flex'>{content}</Link> : content
}
