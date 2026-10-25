import Link from 'next/link'

const BUTTON_BASE = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
const BUTTON_SIZES = {
    md: 'h-[46px] px-[22px] text-[14.5px] [&_svg]:h-[18px] [&_svg]:w-[18px]',
    sm: 'h-9 px-[15px] text-[13px] [&_svg]:h-4 [&_svg]:w-4',
}
const BUTTON_VARIANTS = {
    primary: 'bg-grad text-on-hero hover:brightness-110',
    ghost: 'bg-surface text-ink shadow-[0_0_0_1px_var(--line)] hover:bg-surface-2',
    white: 'bg-on-hero text-hero-btn-ink hover:brightness-95',
    glass: 'bg-hero-glass text-on-hero shadow-[inset_0_0_0_1px_var(--on-hero-line)] hover:bg-white/20',
    danger: 'bg-bad text-surface hover:brightness-110',
    soft: 'bg-accent-soft text-accent-ink hover:brightness-105',
}

/** Class string for a button-styled element (button, Link or a form submit) */
export function btn(variant = 'primary', size = 'md', extra = '') {
    return `${BUTTON_BASE} ${BUTTON_SIZES[size]} ${BUTTON_VARIANTS[variant]} ${extra}`
}

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
    return <button type={type} className={btn(variant, size, className)} {...props} />
}

export function LinkButton({ variant = 'primary', size = 'md', className = '', ...props }) {
    return <Link className={btn(variant, size, className)} {...props} />
}

const CHIP_TONES = {
    neutral: 'bg-surface-2 text-ink-2',
    good: 'bg-good-soft text-good',
    warn: 'bg-warn-soft text-warn',
    bad: 'bg-bad-soft text-bad',
    accent: 'bg-accent-soft text-accent-ink',
    glass: 'bg-hero-glass text-on-hero',
}

export function Chip({ tone = 'neutral', dot = false, className = '', children }) {
    return (
        <span className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12.5px] font-medium [&_svg]:h-3.5 [&_svg]:w-3.5 ${CHIP_TONES[tone]} ${className}`}>
            {dot && <span className='h-[7px] w-[7px] shrink-0 rounded-full bg-current' />}
            {children}
        </span>
    )
}

/** Tick meter: n thin bars, filled share = value (0–100). Colour runs teal → mint. */
export function Meter({ value, n = 24, size = 'md', onHero = false, className = '' }) {
    const v = Math.max(0, Math.min(100, Number(value) || 0))
    const filled = Math.round((v / 100) * n)
    const height = size === 'sm' ? 'h-3.5 gap-[2px]' : 'h-[22px] gap-[3px]'
    return (
        <span role='img' aria-label={`${v} out of 100`} className={`flex min-w-0 ${height} ${className}`}>
            {Array.from({ length: n }, (_, k) => {
                const on = k < filled
                const t = Math.round((k / Math.max(1, n - 1)) * 100)
                return (
                    <i
                        key={k}
                        className={`min-w-[2px] flex-1 ${size === 'sm' ? 'rounded-[2px]' : 'rounded-[3px]'} ${on ? (onHero ? 'bg-on-hero' : '') : (onHero ? 'bg-on-hero-line' : 'bg-surface-3')}`}
                        style={on && !onHero ? { background: `color-mix(in oklab, var(--accent-2) ${t}%, var(--accent))` } : undefined}
                    />
                )
            })}
        </span>
    )
}

const LEVELS = { Beginner: 1, Intermediate: 2, Advanced: 3 }

export function Difficulty({ level, onHero = false, className = '' }) {
    const n = LEVELS[level] ?? 0
    return (
        <span className={`inline-flex items-center gap-2 text-[13px] font-medium ${onHero ? 'text-on-hero-2' : 'text-ink-2'} ${className}`}>
            <span className='inline-flex gap-[3px]' aria-hidden>
                {[1, 2, 3].map((k) =>
                    <b key={k} className={`h-3.5 w-[5px] rounded-[2px] ${k <= n ? (onHero ? 'bg-on-hero' : 'bg-accent') : (onHero ? 'bg-on-hero-line' : 'bg-surface-3')}`} />)}
            </span>
            {level}
        </span>
    )
}

/** Plain (level 3) or tinted (level 2) card */
export function Card({ as: Tag = 'section', tint = false, className = '', children, ...props }) {
    return <Tag className={`card ${tint ? 'tint' : ''} min-w-0 p-5 sm:p-[26px] ${className}`} {...props}>{children}</Tag>
}

export function CardHead({ title, sub, action, className = '' }) {
    return (
        <div className={`mb-[18px] flex items-center justify-between gap-4 ${className}`}>
            <div className='flex min-w-0 flex-col gap-1'>
                <h2 className='text-[22px] font-bold leading-tight'>{title}</h2>
                {sub && <p className='text-[13.5px] text-ink-2'>{sub}</p>}
            </div>
            {action}
        </div>
    )
}

export function Empty({ icon: Icon, title, children, className = '' }) {
    return (
        <div className={`flex flex-col items-center gap-2.5 px-4 py-10 text-center text-ink-2 ${className}`}>
            {Icon &&
                <span className='grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent-ink'>
                    <Icon className='h-6 w-6' aria-hidden />
                </span>}
            {title && <b className='font-display text-lg text-ink'>{title}</b>}
            {children}
        </div>
    )
}

export const inputClass = 'w-full rounded-[14px] border border-line bg-surface-2 px-3.5 text-[14.5px] text-ink outline-none transition focus:bg-surface disabled:opacity-60'
export const fieldInput = `${inputClass} h-12`
export const fieldArea = `${inputClass} min-h-[104px] py-3 leading-relaxed`
