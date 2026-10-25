'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CaseFilter({ cases, selected }) {
    const router = useRouter()

    return (
        <label className='relative'>
            <span className='sr-only'>Case</span>
            <select
                value={selected ?? ''}
                onChange={(e) => router.push(e.target.value ? `/attempts?case=${encodeURIComponent(e.target.value)}` : '/attempts')}
                className={`h-10 max-w-full cursor-pointer appearance-none rounded-full pl-4 pr-9 text-[13.5px] font-medium outline-none ${selected ? 'bg-accent-soft text-accent-ink' : 'bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line)]'}`}
            >
                <option value=''>All cases</option>
                {cases.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            </select>
            <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3' aria-hidden />
        </label>
    )
}
