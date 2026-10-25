'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Header from './Header'
import ChatBox from './ChatBox'
import Note from './Note'
import { patientInitials, patientName, patientSummary } from '../../components/patient'

export default function SessionWorkspace({ slug, title, attemptId, startedAt, initialMessages, initialNotes, plan = '', patient = null, caseDocument = null }) {
    const [notesOpen, setNotesOpen] = useState(false)
    const [panelTab, setPanelTab] = useState('notes')

    return (
        <div className="flex h-full min-h-0 w-full flex-col gap-3 px-3 pb-[96px] pt-3 sm:px-4 lg:p-6">
            <Header slug={slug} title={title} attemptId={attemptId} startedAt={startedAt} caseDocument={caseDocument} onToggleNotes={() => setNotesOpen((v) => !v)} />

            <div className="mx-auto flex min-h-0 w-full max-w-[1240px] flex-1 gap-4">
                <section aria-label="Consultation" className="card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4">
                        <span className='relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft font-display text-[15px] font-bold text-accent-ink' aria-hidden>
                            {patientInitials(patient)}
                            <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-good ring-2 ring-surface' />
                        </span>
                        <div className='flex min-w-0 flex-col'>
                            <h2 className="truncate text-[17px] font-bold">{patientName(patient)}</h2>
                            <span className="truncate text-xs text-ink-3">
                                {patientSummary(patient) ? `${patientSummary(patient)} · ` : ''}Your patient
                            </span>
                        </div>
                    </div>

                    <ChatBox attemptId={attemptId} initialMessages={initialMessages} patient={patient} />
                </section>

                {notesOpen && <div className="fixed inset-0 z-40 bg-scrim lg:hidden" onClick={() => setNotesOpen(false)} />}

                <aside
                    aria-label="Consultation notes"
                    className={`${notesOpen ? 'flex' : 'hidden'} card fixed inset-x-0 bottom-0 z-50 h-[75dvh] flex-col overflow-hidden !rounded-b-none lg:static lg:z-auto lg:flex lg:h-auto lg:w-80 lg:shrink-0 lg:!rounded-b-[26px]`}
                >
                    <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3">
                        <div role="tablist" aria-label="Notes and plan" className="grid flex-1 grid-cols-2 gap-0.5 rounded-full bg-surface-2 p-1 shadow-[inset_0_0_0_1px_var(--line)]">
                            {[['notes', 'Notes'], ['plan', 'Your plan']].map(([value, label]) =>
                                <button
                                    key={value}
                                    type="button"
                                    role="tab"
                                    aria-selected={panelTab === value}
                                    onClick={() => setPanelTab(value)}
                                    className={`h-9 cursor-pointer rounded-full text-[13.5px] font-medium ${panelTab === value ? 'bg-surface text-ink shadow-[0_0_0_1px_var(--line)]' : 'text-ink-2'}`}
                                >
                                    {label}
                                </button>)}
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotesOpen(false)}
                            aria-label="Close notes"
                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-ink-2 hover:bg-surface-2 lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className={`min-h-0 flex-1 overflow-y-auto ${panelTab === 'notes' ? '' : 'hidden'}`}>
                        <Note attemptId={attemptId} initialNotes={initialNotes} />
                    </div>
                    {panelTab === 'plan' &&
                        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                            {plan
                                ? <p className="whitespace-pre-wrap text-sm leading-6">{plan}</p>
                                : <p className="text-sm text-ink-2">
                                    You didn&apos;t write a consultation plan for this case. Add one on the case page before your next attempt.
                                </p>}
                        </div>}
                </aside>
            </div>
        </div>
    )
}
