import React from 'react'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppShell({ children, ...navProps }) {
    return (
        <div className='flex h-dvh w-full flex-col overflow-hidden bg-bg lg:flex-row'>
            <MobileNav {...navProps} />
            <Sidebar {...navProps} />
            <div className='min-w-0 flex-1 overflow-y-auto'>
                {children}
            </div>
        </div>
    )
}
