'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { deleteFaq, moveFaq, saveFaq } from '@/app/actions/adminContent'
import { btn, fieldArea, fieldInput } from '@/app/components/ui'

const emptyForm = { question: '', answer: '' }
const moveBtn = 'grid h-[22px] w-7 cursor-pointer place-items-center rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink disabled:cursor-default disabled:opacity-30'

export default function FaqManager({ faqs }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [isBusy, setIsBusy] = useState(false)
    const [error, setError] = useState('')

    function startEdit(faq) {
        setEditingId(faq._id)
        setForm({ question: faq.question, answer: faq.answer })
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

    return (
        <div className='flex flex-col gap-4'>
            <form
                onSubmit={(e) => { e.preventDefault(); run(() => saveFaq(editingId, form), reset) }}
                className='card tint flex flex-col gap-4 p-5 sm:p-[26px]'
            >
                <h2 className='text-[22px] font-bold'>{editingId ? 'Edit question' : 'New question'}</h2>
                <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>
                    Question
                    <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder='Write it the way a student would ask' required className={`${fieldInput} font-normal`} />
                </label>
                <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>
                    Answer
                    <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={3} required className={`${fieldArea} font-normal`} />
                </label>
                <div className='flex flex-wrap items-center gap-4'>
                    {error && <p className='text-[13.5px] text-bad'>{error}</p>}
                    <div className='ml-auto flex gap-2'>
                        {editingId && <button type='button' onClick={reset} className={btn('ghost', 'sm')}>Cancel</button>}
                        <button type='submit' disabled={isBusy} className={btn('primary', 'sm')}>
                            {isBusy ? 'Saving...' : editingId ? 'Save changes' : 'Add question'}
                        </button>
                    </div>
                </div>
            </form>

            {faqs.length === 0
                ? <div className='card p-6 text-ink-2'>No questions yet.</div>
                : <div className='flex flex-col gap-2.5'>
                    {faqs.map((faq, index) =>
                        <div key={faq._id} className='card grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 px-5 py-[18px] sm:grid-cols-[auto_40px_minmax(0,1fr)_auto] sm:px-6'>
                            <div className='flex flex-col gap-0.5'>
                                <button type='button' onClick={() => run(() => moveFaq(faq._id, -1))} disabled={isBusy || index === 0} aria-label='Move up' className={moveBtn}>
                                    <ChevronUp className='h-3.5 w-3.5' />
                                </button>
                                <button type='button' onClick={() => run(() => moveFaq(faq._id, 1))} disabled={isBusy || index === faqs.length - 1} aria-label='Move down' className={moveBtn}>
                                    <ChevronDown className='h-3.5 w-3.5' />
                                </button>
                            </div>
                            <span className='num hidden pt-0.5 text-[26px] tracking-[-0.03em] text-ink-3 sm:block'>{String(index + 1).padStart(2, '0')}</span>
                            <div className='flex min-w-0 flex-col gap-1.5'>
                                <h3 className='text-[17px] font-bold'>{faq.question}</h3>
                                <p className='text-sm text-ink-2'>{faq.answer}</p>
                            </div>
                            <div className='col-span-2 flex items-center gap-1.5 sm:col-span-1'>
                                <button type='button' onClick={() => startEdit(faq)} className={btn('ghost', 'sm')}><Pencil aria-hidden /> Edit</button>
                                <button
                                    type='button'
                                    onClick={() => confirm('Delete this question?') && run(() => deleteFaq(faq._id), () => editingId === faq._id && reset())}
                                    disabled={isBusy}
                                    aria-label='Delete question'
                                    className='grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line)] hover:text-bad disabled:opacity-50'
                                >
                                    <Trash2 className='h-4 w-4' aria-hidden />
                                </button>
                            </div>
                        </div>
                    )}
                </div>}
        </div>
    )
}
