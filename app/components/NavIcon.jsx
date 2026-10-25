// Outline icons for the menu, with a solid version for the selected item.
const OUTLINE = {
    home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
    cases: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M8 4v5" /></>,
    chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
    bell: <><path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" /><circle cx="12" cy="17.2" r=".6" fill="currentColor" /></>,
    grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.7.8 2.8 2.6 3 5.2" /></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12" /><circle cx="12" cy="12" r="3" /></>,
}

const FILLED = {
    home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
    cases: <><rect x="3" y="4" width="18" height="4.2" rx="2" /><rect x="3" y="9.8" width="18" height="10.2" rx="2.5" /></>,
    chart: <><rect x="3" y="10" width="4.5" height="11" rx="1.4" /><rect x="9.75" y="3" width="4.5" height="18" rx="1.4" /><rect x="16.5" y="13" width="4.5" height="8" rx="1.4" /></>,
    bell: <><path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z" /><path d="M9.8 19h4.4a2.2 2.2 0 0 1-4.4 0z" /></>,
    help: <path fillRule="evenodd" d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 13.6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 6.3a3.4 3.4 0 0 0-3.4 3.3.9.9 0 0 0 1.8 0 1.6 1.6 0 1 1 2.3 1.4c-1 .5-1.6 1.4-1.6 2.5v.4a.9.9 0 0 0 1.8 0v-.4c0-.4.2-.7.6-.9A3.4 3.4 0 0 0 12 6.3z" />,
    grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></>,
    users: <><circle cx="9" cy="8" r="3.8" /><path d="M2.5 20.5c.5-3.7 3.2-6 6.5-6s6 2.3 6.5 6z" /><path d="M15.6 4.4a3.6 3.6 0 1 1 0 7.2 5.3 5.3 0 0 0 0-7.2zM17.4 14.6c2.5.5 3.9 2.7 4.1 5.9h-4.4c-.2-2.4-1-4.4-2.4-5.7.9-.3 1.8-.3 2.7-.2z" /></>,
    shield: <path fillRule="evenodd" d="M12 2.6 3.6 5.8V12c0 5.2 3.6 8.4 8.4 9.4 4.8-1 8.4-4.2 8.4-9.4V5.8zm3.6 6.8a.9.9 0 0 1 0 1.3l-4 4a.9.9 0 0 1-1.3 0l-2-2a.9.9 0 1 1 1.3-1.3l1.4 1.3 3.3-3.3a.9.9 0 0 1 1.3 0z" />,
    eye: <path fillRule="evenodd" d="M12 5C5.5 5 2 12 2 12s3.5 7 10 7 10-7 10-7-3.5-7-10-7zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />,
}

export default function NavIcon({ name, active = false, className = 'h-[19px] w-[19px]' }) {
    return active
        ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`shrink-0 ${className}`}>{FILLED[name]}</svg>
        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`shrink-0 ${className}`}>{OUTLINE[name]}</svg>
}
