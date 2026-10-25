'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, Pencil, SearchIcon, Trash2 } from 'lucide-react'
import { deleteCase, setCasePublished } from '@/app/actions/adminCases'
import { btn, Difficulty } from '@/app/components/ui'

const iconBtn = 'grid h-[34px] w-[34px] shrink-0 cursor-pointer place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line)] hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4'

function PublishSwitch({ on, disabled, onToggle }) {
    return (
        <button type='button' role='switch' aria-checked={on} aria-label='Visible to students' disabled={disabled} onClick={onToggle}
            className='flex cursor-pointer items-center gap-2.5 disabled:cursor-wait disabled:opacity-60'>
            <span className={`relative h-[26px] w-11 shrink-0 rounded-full transition ${on ? 'bg-grad' : 'bg-surface-3'}`}>
                <span className={`absolute left-[3px] top-[3px] h-5 w-5 rounded-full transition-transform ${on ? 'translate-x-[18px] bg-on-hero' : 'bg-surface'}`} />
            </span>
            <span className='text-[13px] font-medium'>{on ? 'Published' : 'Draft'}</span>
        </button>
    )
}

export default function CaseTable({ cases }) {
    const router = useRouter()
    const [busyId, setBusyId] = useState(null)
    const [error, setError] = useState('')
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('All')

    async function run(id, action) {
        setBusyId(id)
        setError('')
        try {
            const result = await action()
            if (!result.success) throw new Error(result.message)
            router.refresh()
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setBusyId(null)
        }
    }

    function handleDelete(c) {
        if (!confirm(`Delete "${c.title}"? This can't be undone.`)) return
        run(c._id, () => deleteCase(c._id))
    }

    if (cases.length === 0) {
        return <div className='card p-6 text-ink-2'>No cases yet. Create one to get started.</div>
    }

    const published = cases.filter((c) => c.isPublished).length
    const q = query.trim().toLowerCase()
    const shown = cases.filter((c) =>
        (status === 'All' || (status === 'Published') === Boolean(c.isPublished)) &&
        (!q || `${c.title} ${c.specialty ?? ''}`.toLowerCase().includes(q)))

    const average = (c) => c.averageScore === null ? '–' : `${c.averageScore}%`
    const actions = (c) => (
        <div className='flex items-center justify-end gap-1.5'>
            <Link href={`/admin-dashboard/cases/${c._id}/edit`} className={btn('ghost', 'sm')}><Pencil aria-hidden /> Edit</Link>
            <Link href={`/cases/${c.slug}`} className={iconBtn} aria-label={`Preview ${c.title} as a student`} title='Preview as student'><Eye aria-hidden /></Link>
            <button type='button' onClick={() => handleDelete(c)} disabled={busyId === c._id} className={`${iconBtn} hover:text-bad`} aria-label={`Delete ${c.title}`} title='Delete'>
                <Trash2 aria-hidden />
            </button>
        </div>
    )

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap items-center gap-3'>
                <label className='relative min-w-[220px] flex-1'>
                    <SearchIcon className='pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3' aria-hidden />
                    <span className='sr-only'>Search cases</span>
                    <input type='search' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search cases'
                        className='h-12 w-full rounded-full border border-line bg-surface pl-[42px] pr-4 text-[14.5px] outline-none' />
                </label>
                <div className='inline-flex gap-0.5 rounded-full bg-surface-2 p-1 shadow-[inset_0_0_0_1px_var(--line)]' role='group' aria-label='Status'>
                    {[['All', cases.length], ['Published', published], ['Draft', cases.length - published]].map(([k, n]) =>
                        <button key={k} type='button' aria-pressed={status === k} onClick={() => setStatus(k)}
                            className={`h-9 cursor-pointer rounded-full px-4 text-[13.5px] font-medium ${status === k ? 'bg-grad text-on-hero' : 'text-ink-2'}`}>
                            {k} {n}
                        </button>)}
                </div>
            </div>

            {error && <p className='rounded-[14px] bg-bad-soft px-3.5 py-3 text-[13.5px] text-bad'>{error}</p>}

            <ul className='flex flex-col gap-2.5 md:hidden'>
                {shown.map((c) =>
                    <li key={c._id} className='card flex flex-col gap-3 p-5'>
                        <div className='min-w-0'>
                            <div className='font-semibold'>{c.title}</div>
                            <div className='text-[12.5px] text-ink-3'>{[c.specialty, c.difficulty, c.duration].filter(Boolean).join(' · ')}</div>
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                            <PublishSwitch on={c.isPublished} disabled={busyId === c._id} onToggle={() => run(c._id, () => setCasePublished(c._id, !c.isPublished))} />
                            <span className='text-[13px] text-ink-2'>{c.attempts} {c.attempts === 1 ? 'attempt' : 'attempts'} · Avg {average(c)}</span>
                        </div>
                        {actions(c)}
                    </li>)}
            </ul>

            <div className='card hidden overflow-x-auto px-2 py-1.5 md:block'>
                <table className='w-full min-w-[760px] text-left text-sm'>
                    <thead>
                        <tr className='text-[12.5px] text-ink-3'>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Case</th>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Difficulty</th>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Visible to students</th>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Attempts</th>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Avg score</th>
                            <th className='border-b border-line px-4 py-3.5 text-right font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((c) =>
                            <tr key={c._id} className='[&:last-child>td]:border-b-0'>
                                <td className='border-b border-line px-4 py-4'>
                                    <div className='font-semibold'>{c.title}</div>
                                    <div className='text-[12.5px] text-ink-3'>{[c.specialty, c.duration].filter(Boolean).join(' · ') || '–'}</div>
                                </td>
                                <td className='border-b border-line px-4 py-4'>{c.difficulty ? <Difficulty level={c.difficulty} /> : '–'}</td>
                                <td className='border-b border-line px-4 py-4'>
                                    <PublishSwitch on={c.isPublished} disabled={busyId === c._id} onToggle={() => run(c._id, () => setCasePublished(c._id, !c.isPublished))} />
                                </td>
                                <td className='border-b border-line px-4 py-4 tabular-nums'>{c.attempts}</td>
                                <td className='border-b border-line px-4 py-4 font-bold tabular-nums'>{average(c)}</td>
                                <td className='border-b border-line px-4 py-4'>{actions(c)}</td>
                            </tr>
                        )}
                        {shown.length === 0 &&
                            <tr><td colSpan={6} className='px-4 py-10 text-center text-ink-2'>No cases match.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
