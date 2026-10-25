'use client'

import { Moon, Sun } from 'lucide-react'

function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('msai-theme', next) } catch { /* storage unavailable */ }
}

/** Sun in dark mode, moon in light mode. Both icons render; CSS shows the right one, so there is no hydration mismatch. */
export default function ThemeToggle({ className = '' }) {
    return (
        <button
            type='button'
            onClick={toggleTheme}
            aria-label='Switch between light and dark mode'
            title='Switch theme'
            className={`grid shrink-0 cursor-pointer place-items-center rounded-[18px] bg-surface-2 text-ink transition hover:bg-surface-3 ${className}`}
        >
            <Sun className='hidden h-[18px] w-[18px] dark:block' aria-hidden />
            <Moon className='h-[18px] w-[18px] dark:hidden' aria-hidden />
        </button>
    )
}
