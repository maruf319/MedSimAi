'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { saveConfidence } from '@/app/actions/casePrep'
import { CONFIDENCE_SKILLS } from '@/utils/confidenceSkills'

export function StepHead({ n, done, title, hint }) {
    return (
        <div className='flex items-center gap-3'>
            <span className={`grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full font-display text-[13px] font-bold ${done ? 'bg-grad text-on-hero' : 'bg-surface shadow-[inset_0_0_0_1px_var(--line)]'}`}>
                {done ? <Check className='h-3.5 w-3.5' aria-hidden /> : n}
            </span>
            <span className='flex min-w-0 flex-col gap-0.5'>
                <b>{title}</b>
                {hint && <span className='text-[12.5px] text-ink-3'>{hint}</span>}
            </span>
        </div>
    )
}

export default function ConfidenceRatings({ caseId, initialRatings = {} }) {
    const [ratings, setRatings] = useState(initialRatings)
    const [savingSkill, setSavingSkill] = useState(null)
    const [error, setError] = useState('')

    async function rate(skill, rating) {
        const previous = ratings[skill]
        setRatings((prev) => ({ ...prev, [skill]: rating }))
        setSavingSkill(skill)
        setError('')

        try {
            const result = await saveConfidence(caseId, skill, rating)
            if (!result.success) throw new Error(result.message)
        } catch (err) {
            setRatings((prev) => ({ ...prev, [skill]: previous }))
            setError(err.message || "Couldn't save your rating. Please try again.")
        } finally {
            setSavingSkill(null)
        }
    }

    const rated = CONFIDENCE_SKILLS.filter((s) => typeof ratings[s] === 'number').length

    return (
        <div className='flex flex-col gap-2'>
            <StepHead n={1} done={rated === CONFIDENCE_SKILLS.length} title='How confident are you?' hint='1 = not confident, 5 = very confident' />
            <div>
                {CONFIDENCE_SKILLS.map((skill) =>
                    <div key={skill} className='flex items-center justify-between gap-3 border-t border-line py-2.5 first:border-t-0'>
                        <span className='text-sm font-medium'>{skill}</span>
                        <span className='inline-flex shrink-0 gap-1' role='radiogroup' aria-label={skill}>
                            {[1, 2, 3, 4, 5].map((number) => {
                                const selected = ratings[skill] === number
                                return (
                                    <button
                                        key={number}
                                        type='button'
                                        role='radio'
                                        aria-checked={selected}
                                        disabled={savingSkill === skill}
                                        onClick={() => rate(skill, number)}
                                        className={`h-[34px] w-[34px] cursor-pointer rounded-full text-[13px] font-semibold tabular-nums transition disabled:cursor-wait ${selected
                                            ? 'bg-grad text-on-hero'
                                            : 'bg-surface text-ink-2 shadow-[inset_0_0_0_1px_var(--line)] hover:text-ink'}`}
                                    >
                                        {number}
                                    </button>
                                )
                            })}
                        </span>
                    </div>
                )}
            </div>
            {error && <p className='text-[13.5px] text-bad'>{error}</p>}
        </div>
    )
}
