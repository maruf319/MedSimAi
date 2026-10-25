'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteAnnouncement, saveAnnouncement } from '@/app/actions/adminContent'
import { btn, fieldArea, fieldInput } from '@/app/components/ui'
import { AnnouncementRow } from '@/app/(home)/announcements/components/Announcements'

const emptyForm = { title: '', description: '', type: 'Update', isPublished: true }

export default function AnnouncementManager({ announcements }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [isBusy, setIsBusy] = useState(false)
    const [error, setError] = useState('')

    function startEdit(a) {
        setEditingId(a._id)
        setForm({ title: a.title, description: a.description, type: a.type, isPublished: a.isPublished })
        setError('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function reset() {
        setEditingId(null)
        setForm(emptyForm)
    }

    async function run(action, after) {
        setIsBusy(true)
        setError('')
        try {
            const result = await action()
            if (!result.success) throw new Error(result.message)
            after?.()
            router.refresh()
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setIsBusy(false)
        }
    }

    const set = (field) => (e) => setForm((prev) => ({
        ...prev,
        [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

    return (
        <div className='flex flex-col gap-4'>
            <form
                onSubmit={(e) => { e.preventDefault(); run(() => saveAnnouncement(editingId, form), reset) }}
                className='card tint flex flex-col gap-4 p-5 sm:p-[26px]'
            >
                <h2 className='text-[22px] font-bold'>{editingId ? 'Edit announcement' : 'New announcement'}</h2>
                <div className='grid gap-4 md:grid-cols-3'>
                    <label className='flex flex-col gap-[7px] text-[13px] font-semibold md:col-span-2'>
                        Title
                        <input value={form.title} onChange={set('title')} placeholder='What’s the news?' required className={`${fieldInput} font-normal`} />
                    </label>
                    <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>
                        Label
                        <input value={form.type} onChange={set('type')} placeholder='e.g. New Cases' className={`${fieldInput} font-normal`} />
                    </label>
                </div>
                <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>
                    Message
                    <textarea value={form.description} onChange={set('description')} rows={3} required className={`${fieldArea} font-normal`} />
                </label>
                <div className='flex flex-wrap items-center gap-4'>
                    <label className='flex cursor-pointer items-center gap-2.5 text-sm'>
                        <input type='checkbox' checked={form.isPublished} onChange={set('isPublished')} className='h-4 w-4 accent-[var(--accent)]' />
                        Visible to students
                    </label>
                    {error && <p className='text-[13.5px] text-bad'>{error}</p>}
                    <div className='ml-auto flex gap-2'>
                        {editingId && <button type='button' onClick={reset} className={btn('ghost', 'sm')}>Cancel</button>}
                        <button type='submit' disabled={isBusy} className={btn('primary', 'sm')}>
                            {isBusy ? 'Saving...' : editingId ? 'Save changes' : 'Publish announcement'}
                        </button>
                    </div>
                </div>
            </form>

            {announcements.length === 0
                ? <div className='card p-6 text-ink-2'>No announcements yet.</div>
                : <div className='flex flex-col gap-2.5'>
                    {announcements.map((a) =>
                        <AnnouncementRow key={a._id} announcement={a}>
                            <div className='flex items-center gap-1.5'>
                                <button type='button' onClick={() => startEdit(a)} className={btn('ghost', 'sm')}><Pencil aria-hidden /> Edit</button>
                                <button
                                    type='button'
                                    onClick={() => confirm(`Delete "${a.title}"?`) && run(() => deleteAnnouncement(a._id), () => editingId === a._id && reset())}
                                    disabled={isBusy}
                                    aria-label={`Delete ${a.title}`}
                                    className='grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line)] hover:text-bad disabled:opacity-50'
                                >
                                    <Trash2 className='h-4 w-4' aria-hidden />
                                </button>
                            </div>
                        </AnnouncementRow>
                    )}
                </div>}
        </div>
    )
}
