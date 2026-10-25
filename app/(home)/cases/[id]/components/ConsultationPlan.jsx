'use client'

import { useState } from 'react'
import { saveConsultationPlan } from '@/app/actions/casePrep'
import { btn, fieldArea } from '@/app/components/ui'
import { StepHead } from './ConfidenceRatings'

export default function ConsultationPlan({ caseId, initialPlan = '' }) {
    const [plan, setPlan] = useState(initialPlan)
    const [savedPlan, setSavedPlan] = useState(initialPlan)
    const [isSaving, setIsSaving] = useState(false)
    const [status, setStatus] = useState('')

    const hasChanges = plan !== savedPlan

    async function handleSave() {
        setIsSaving(true)
        setStatus('')
        try {
            const result = await saveConsultationPlan(caseId, plan)
            if (!result.success) throw new Error(result.message)
            setSavedPlan(plan)
            setStatus('Saved')
        } catch (err) {
            setStatus(err.message || "Couldn't save your plan. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 border-t border-line pt-4">
            <StepHead n={2} done={savedPlan.trim().length > 0} title='Consultation plan' hint='What will you ask, and in what order?' />
            <label className='sr-only' htmlFor={`plan-${caseId}`}>Consultation plan</label>
            <textarea
                id={`plan-${caseId}`}
                value={plan}
                onChange={(e) => { setPlan(e.target.value); setStatus('') }}
                maxLength={10000}
                rows={7}
                className={fieldArea}
                placeholder='Introduce myself · SOCRATES for the main symptom · Red flags · PMH, meds, allergies · Ideas, concerns, expectations'
            />
            <div className='flex items-center justify-between gap-3'>
                <span className={`text-[12.5px] ${status && status !== 'Saved' ? 'text-bad' : status ? 'text-good' : 'text-ink-3'}`}>
                    {status || (hasChanges ? 'Unsaved changes' : savedPlan ? 'Saved' : 'Not saved yet')}
                </span>
                <button onClick={handleSave} disabled={isSaving || !hasChanges} className={btn('primary', 'sm')}>
                    {isSaving ? 'Saving...' : 'Save plan'}
                </button>
            </div>
        </div>
    )
}
