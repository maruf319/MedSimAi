'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getMenu, isActive } from './navigation'
import NavIcon from './NavIcon'
import Logo from './Logo'
import AccountMenu from './AccountMenu'
import ThemeToggle from './ThemeToggle'

/** Floating panel on the left (desktop). Slims to an icon rail between 1024 and 1280px. */
export default function Sidebar(props) {
    const { variant = 'student', isAdmin = false } = props
    const pathname = usePathname()
    const menu = getMenu(variant, isAdmin)

    return (
        <aside className='hidden shrink-0 py-3.5 pl-3.5 lg:block'>
            <div className='frost flex h-full w-[76px] flex-col gap-[22px] rounded-[28px] px-2.5 pb-3 pt-5 xl:w-[244px] xl:px-3 xl:pt-[22px]'>
                <div className='flex justify-center xl:justify-start xl:px-2.5'>
                    <Logo href={variant === 'admin' ? '/admin-dashboard' : '/dashboard'} tag={variant === 'admin' ? 'Admin' : null} compactAtLg />
                </div>

                <nav className='flex flex-col gap-1' aria-label='Main'>
                    {menu.map((item) => {
                        const active = isActive(pathname, item)
                        return (
                            <Link
                                key={item.link}
                                href={item.link}
                                title={item.title}
                                aria-current={active ? 'page' : undefined}
                                className={`flex h-[46px] items-center justify-center gap-3 rounded-full px-0 text-[14.5px] font-medium transition xl:justify-start xl:px-3.5 ${active
                                    ? 'bg-grad text-on-hero'
                                    : 'text-ink-2 hover:bg-surface-2 hover:text-ink'}`}
                            >
                                <NavIcon name={item.icon} active={active} />
                                <span className='hidden xl:inline'>{item.title}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className='mt-auto flex flex-col items-center gap-2 xl:flex-row'>
                    <span className='hidden w-full xl:flex xl:min-w-0 xl:flex-1'>
                        <AccountMenu {...props} placement='side' />
                    </span>
                    <span className='xl:hidden'>
                        <AccountMenu {...props} placement='side' compact />
                    </span>
                    <ThemeToggle className='h-[54px] w-[54px]' />
                </div>
            </div>
        </aside>
    )
}
