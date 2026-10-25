'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { adminLogout, logout } from '../actions/auth'
import NavIcon from './NavIcon'
import { btn } from './ui'

const DEMO_NOTES = {
    student: "Demo · Live AI sessions are off, but you can browse cases and sample feedback.",
    admin: "Demo · Look around freely. Changes aren't saved.",
}

function initials(name = '') {
    return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'
}

/**
 * Profile card that opens the account menu. `compact` shows only the avatar
 * (icon rail and phone bar). Secondary menu items are listed in the menu on phones.
 */
export default function AccountMenu({ name, email, variant = 'student', isAdmin = false, demo = false, extraLinks = [], placement = 'side', compact = false }) {
    const pathname = usePathname()
    const [openedOn, setOpenedOn] = useState(null)
    const open = openedOn === pathname
    const close = () => setOpenedOn(null)

    useEffect(() => {
        if (!open) return
        const onKey = (e) => e.key === 'Escape' && setOpenedOn(null)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const role = variant === 'admin' || isAdmin ? 'Admin' : 'Student'
    const sheetPosition = placement === 'side'
        ? 'items-end justify-start p-4 lg:pl-[104px] xl:pl-[272px]'
        : 'items-start justify-end px-4 pt-[76px]'

    return (
        <>
            <button
                type='button'
                onClick={() => setOpenedOn(open ? null : pathname)}
                aria-label='Account menu'
                aria-expanded={open}
                className={`flex min-w-0 cursor-pointer items-center gap-2.5 text-left transition ${compact
                    ? 'h-11 w-11 justify-center rounded-full'
                    : 'h-[54px] flex-1 rounded-[18px] bg-surface-2 pl-2 pr-3 hover:bg-surface-3'}`}
            >
                <span className='grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-accent-soft font-display text-[13.5px] font-bold text-accent-ink'>
                    {initials(name)}
                </span>
                {!compact &&
                    <span className='flex min-w-0 flex-col gap-px'>
                        <b className='truncate text-[13.5px] font-bold'>{name ?? 'No user'}</b>
                        <small className='truncate text-xs text-ink-3'>{role}{demo ? ' · Demo' : ''}</small>
                    </span>}
            </button>

            {open &&
                <div className={`fixed inset-0 z-50 flex bg-scrim ${sheetPosition}`} onClick={close}>
                    <div role='dialog' aria-label='Account' className='card flex w-[min(320px,100%)] flex-col gap-3 p-4' onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center gap-2.5 rounded-full bg-surface-2 p-2'>
                            <span className='grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-accent-soft font-display text-[13.5px] font-bold text-accent-ink'>{initials(name)}</span>
                            <span className='flex min-w-0 flex-col'>
                                <b className='truncate text-[13.5px]'>{name ?? 'No user'}</b>
                                <span className='truncate text-xs text-ink-3'>{email ?? role}</span>
                            </span>
                        </div>
                        {demo &&
                            <p className='flex items-start gap-2 rounded-2xl bg-surface-2 px-3.5 py-2.5 text-[12.5px] leading-snug text-ink-2'>
                                <span className='mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-accent' />
                                {DEMO_NOTES[variant === 'admin' ? 'admin' : 'student']}
                            </p>}
                        {extraLinks.map((item) =>
                            <Link key={item.link} href={item.link} onClick={close} className={btn('ghost', 'md')}>
                                <NavIcon name={item.icon} className='h-[18px] w-[18px]' /> {item.title}
                            </Link>)}
                        <form action={variant === 'admin' ? adminLogout : logout}>
                            <button type='submit' className={btn('primary', 'md', 'w-full')}>
                                <LogOut aria-hidden /> Sign out
                            </button>
                        </form>
                    </div>
                </div>}
        </>
    )
}
