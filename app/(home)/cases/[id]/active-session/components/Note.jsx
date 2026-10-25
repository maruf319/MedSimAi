'use client'

import React, { useState } from 'react'
import { saveNotes } from '@/app/actions/casePrep'
import { btn, inputClass } from '@/app/components/ui'

export default function Note({ attemptId, initialNotes = '' }) {
    const [notes, setNotes] = useState(initialNotes)
    const [savedNotes, setSavedNotes] = useState(initialNotes)
    const [isSaving, setIsSaving] = useState(false)
    const [status, setStatus] = useState('')

    const hasChanges = notes !== savedNotes

    async function handleSave() {
        setIsSaving(true)
        setStatus('')
        try {
            const result = await saveNotes(attemptId, notes)
            if (!result.success) throw new Error(result.message)
            setSavedNotes(notes)
            setStatus('Saved')
        } catch (err) {
            setStatus(err.message || "Couldn't save your notes. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    function handleDiscard() {
        setNotes(savedNotes)
        setStatus('')
    }

    return (
        <div className='flex h-full flex-col gap-3 px-4 pb-4'>
            <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setStatus('') }}
                maxLength={10000}
                className={`${inputClass} min-h-50 flex-1 py-3 font-mono text-[13px] leading-[1.7]`}
                aria-label='Notes'
                placeholder='Take a note...'
            />
            <div className='flex items-center justify-between gap-2'>
                <span className={`text-[12.5px] ${status === 'Saved' ? 'text-good' : status ? 'text-bad' : 'text-ink-3'}`}>
                    {status || (hasChanges ? 'Unsaved changes' : '')}
                </span>
                <div className='flex gap-2'>
                    <button
                        onClick={handleDiscard}
                        disabled={!hasChanges || isSaving}
                        className={btn('ghost', 'sm')}
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={btn('primary', 'sm')}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}
