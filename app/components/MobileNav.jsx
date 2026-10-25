'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getMenu, isActive } from './navigation'
import NavIcon from './NavIcon'
import Logo from './Logo'
import AccountMenu from './AccountMenu'
import ThemeToggle from './ThemeToggle'

/** Phone and small tablet: floating top bar plus a floating tab bar at the bottom. */
export default function MobileNav(props) {
    const { variant = 'student', isAdmin = false } = props
    const pathname = usePathname()
    const menu = getMenu(variant, isAdmin)
    const tabs = menu.filter((m) => !m.secondary)
    const extraLinks = menu.filter((m) => m.secondary)

    return (
        <div className='lg:hidden'>
            <div className='px-3 pt-3'>
                <header className='frost flex items-center justify-between gap-3 rounded-full py-[7px] pl-4 pr-[7px]'>
                    <Logo href={variant === 'admin' ? '/admin-dashboard' : '/dashboard'} tag={variant === 'admin' ? 'Admin' : null} />
                    <span className='flex items-center gap-1.5'>
                        <AccountMenu {...props} extraLinks={extraLinks} placement='top' compact />
                        <ThemeToggle className='h-11 w-11 !rounded-full' />
                    </span>
                </header>
            </div>

            <nav
                aria-label='Main'
                className='frost fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-40 grid auto-cols-fr grid-flow-col rounded-full p-1.5'
            >
                {tabs.map((item) => {
                    const active = isActive(pathname, item)
                    return (
                        <Link
                            key={item.link}
                            href={item.link}
                            aria-current={active ? 'page' : undefined}
                            className={`flex h-[54px] flex-col items-center justify-center gap-[3px] rounded-full text-[10.5px] font-medium ${active ? 'bg-grad text-on-hero' : 'text-ink-3'}`}
                        >
                            <NavIcon name={item.icon} active={active} className='h-[21px] w-[21px]' />
                            <span>{item.short ?? item.title}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
