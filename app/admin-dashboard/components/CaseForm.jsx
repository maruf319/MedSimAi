'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCase, updateCase } from '@/app/actions/adminCases'
import { Eye, EyeOff } from 'lucide-react'
import { caseToForm, DIFFICULTIES, GENDERS } from '@/utils/caseFields'
import { btn, fieldArea, fieldInput } from '@/app/components/ui'
import { BackLink } from '@/app/components/PageHeader'


const SECTIONS = [
    ['basic', 'Basic information'],
    ['patient', 'Patient'],
    ['history', 'History'],
    ['behaviour', 'AI behaviour'],
    ['examination', 'Examination'],
    ['diagnosis', 'Diagnosis and marking'],
]

function Section({ id, title, description, visible = false, children }) {
    return (
        <section id={`sec-${id}`} className='card flex scroll-mt-6 flex-col gap-[18px] p-5 sm:p-[26px]'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-[22px] font-bold'>{title}</h2>
                    {description && <p className='text-[13.5px] text-ink-2'>{description}</p>}
                </div>
                {visible
                    ? <span className='inline-flex items-center gap-1.5 rounded-full bg-good-soft px-[11px] py-[5px] text-xs font-semibold text-good'><Eye className='h-3.5 w-3.5' aria-hidden /> Students see this</span>
                    : <span className='inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-[11px] py-[5px] text-xs font-semibold text-ink-2'><EyeOff className='h-3.5 w-3.5' aria-hidden /> Hidden from students</span>}
            </div>
            {children}
        </section>
    )
}

export default function CaseForm({ initialCase }) {
    const router = useRouter()
    const isEdit = Boolean(initialCase?._id)

    const [values, setValues] = useState(() => caseToForm(initialCase))
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState(null)

    const set = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setValues((prev) => ({ ...prev, [field]: value }))
    }

    const text = (field, label, props = {}) => (
        <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>
            {label}
            <input value={values[field]} onChange={set(field)} className={`${fieldInput} font-normal`} {...props} />
        </label>
    )
    const area = (field, label, props = {}) => (
        <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>
            {label}
            <textarea value={values[field]} onChange={set(field)} rows={4} className={`${fieldArea} font-normal`} {...props} />
        </label>
    )
    const list = (field, label, placeholder) => area(field, <>{label} <span className='font-normal text-ink-3'>(one per line)</span></>, { placeholder, rows: 5 })
    const select = (field, label, options) => (
        <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>
            {label}
            <select value={values[field]} onChange={set(field)} className={`${fieldInput} font-normal`}>
                {options.map((option) => <option key={option} value={option}>{option || 'Not specified'}</option>)}
            </select>
        </label>
    )
    const checkbox = (field, label) => (
        <label className='flex cursor-pointer items-center gap-3 rounded-[14px] bg-surface-2 px-4 py-3.5 text-sm font-medium'>
            <input type='checkbox' checked={values[field]} onChange={set(field)} className='h-4 w-4 accent-[var(--accent)]' />
            {label}
        </label>
    )

    async function handleSubmit(e) {
        e.preventDefault()
        setIsSaving(true)
        setMessage(null)
        try {
            const result = isEdit
                ? await updateCase(initialCase._id, values)
                : await createCase(values)
            if (!result.success) throw new Error(result.message)

            if (isEdit) {
                setMessage({ ok: true, text: 'Changes saved.' })
                router.refresh()
            } else {
                router.push('/admin-dashboard/cases')
            }
        } catch (err) {
            setMessage({ ok: false, text: err.message || "Couldn't save the case." })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='flex flex-col gap-[22px]'>
            <div className='mb-1.5 flex flex-col gap-2'>
                <BackLink href='/admin-dashboard/cases'>Back to cases</BackLink>
                <h1 className='text-[32px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[40px] lg:text-[46px]'>
                    {isEdit ? initialCase.title : 'Create a new case'}
                </h1>
                <p className='text-[15.5px] text-ink-2'>
                    {isEdit
                        ? <>Link: <Link href={`/cases/${initialCase.slug}`} className='font-medium text-accent-ink underline underline-offset-[3px]'>/cases/{initialCase.slug}</Link> · stays the same when you rename the case</>
                        : 'Create a clinical case for students to practise.'}
                </p>
            </div>

            <div className='grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]'>
                <nav aria-label='Form sections' className='flex gap-1.5 overflow-x-auto pb-1 lg:sticky lg:top-6 lg:flex-col lg:gap-0.5 lg:overflow-visible'>
                    {SECTIONS.map(([id, label], i) =>
                        <a key={id} href={`#sec-${id}`} className='flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-surface px-3.5 py-2.5 text-sm text-ink-2 hover:text-ink lg:bg-transparent lg:hover:bg-surface'>
                            <span className='grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-accent-soft text-[11.5px] font-bold text-accent-ink'>{i + 1}</span>
                            {label}
                        </a>)}
                </nav>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <Section id='basic' visible title='Basic information' description='What students see in the case list. Fields marked * are required.'>
                        {text('title', 'Case title *', { required: true, placeholder: 'e.g. Shortness of Breath' })}
                        {area('description', 'Case description *', { required: true, placeholder: 'A 45-year-old man presents with...' })}
                        <div className='grid gap-4 md:grid-cols-2'>
                            {text('specialty', 'Specialty', { placeholder: 'e.g. Respiratory' })}
                            {select('difficulty', 'Difficulty *', DIFFICULTIES)}
                            {text('durationMinutes', 'Duration in minutes *', { type: 'number', min: 1, required: true })}
                            {text('image', 'Image path (a file in /public)', { placeholder: '/cases/lungs.png' })}
                            {text('pdfUrl', 'Case document path (a PDF in /public)', { placeholder: '/cases/cardio-report.pdf' })}
                        </div>
                        {list('features', 'Tags', 'History Taking\nRespiratory')}
                        {checkbox('isPublished', 'Published (visible to students)')}
                    </Section>

                    <Section id='patient' title='Patient' description='Who the AI plays. Students never see this section directly.'>
                        <div className='grid gap-4 md:grid-cols-2'>
                            {text('aiScenario.patient.name', 'Name')}
                            {text('aiScenario.patient.age', 'Age', { type: 'number', min: 0, max: 120 })}
                            {select('aiScenario.patient.gender', 'Gender', ['', ...GENDERS])}
                            {text('aiScenario.patient.occupation', 'Occupation')}
                        </div>
                        {area('aiScenario.patient.personality', 'Personality', { placeholder: 'Anxious but cooperative...' })}
                    </Section>

                    <Section id='history' title='History' description='What the patient knows and can tell the student when asked.'>
                        {area('aiScenario.clinicalData.historyOfPresentIllness', 'History of presenting illness', { rows: 6 })}
                        <div className='grid gap-4 md:grid-cols-2'>
                            {list('aiScenario.clinicalData.symptoms.present', 'Symptoms present')}
                            {list('aiScenario.clinicalData.symptoms.absent', 'Symptoms absent (the patient denies these)')}
                            {list('aiScenario.clinicalData.pastMedicalHistory', 'Past medical history')}
                            {list('aiScenario.clinicalData.medications', 'Medications')}
                            {list('aiScenario.clinicalData.allergies', 'Allergies')}
                            {list('aiScenario.clinicalData.familyHistory', 'Family history')}
                        </div>
                        <div className='grid gap-4 md:grid-cols-3'>
                            {text('aiScenario.clinicalData.socialHistory.smoking', 'Smoking')}
                            {text('aiScenario.clinicalData.socialHistory.alcohol', 'Alcohol')}
                            {text('aiScenario.clinicalData.socialHistory.occupation', 'Work and lifestyle')}
                        </div>
                    </Section>

                    <Section id='behaviour' title='AI behaviour' description='How the AI patient talks and what it gives away.'>
                        {area('aiScenario.behavior.communicationStyle', 'Communication style')}
                        {area('aiScenario.behavior.emotionalState', 'Emotional state')}
                        <div className='flex flex-col gap-2'>
                            {checkbox('aiScenario.behavior.revealInformationOnlyWhenAsked', 'Only reveal information when asked')}
                            {checkbox('aiScenario.behavior.revealDiagnosis', 'Patient already knows their diagnosis')}
                            {checkbox('aiScenario.behavior.useMedicalTerminology', 'Patient may use medical terminology')}
                        </div>
                    </Section>

                    <Section id='examination' title='Examination' description='Findings the student receives when they examine the patient.'>
                        {area('aiScenario.examination.generalAppearance', 'General appearance')}
                        <div className='grid gap-4 md:grid-cols-3'>
                            {text('aiScenario.examination.vitals.temperature', 'Temperature (°C)', { type: 'number', step: '0.1' })}
                            {text('aiScenario.examination.vitals.heartRate', 'Heart rate (bpm)', { type: 'number' })}
                            {text('aiScenario.examination.vitals.respiratoryRate', 'Respiratory rate (/min)', { type: 'number' })}
                            {text('aiScenario.examination.vitals.bloodPressure', 'Blood pressure', { placeholder: '120/80' })}
                            {text('aiScenario.examination.vitals.oxygenSaturation', 'Oxygen saturation (%)', { type: 'number' })}
                        </div>
                        {list('aiScenario.examination.findings', 'Examination findings')}
                    </Section>

                    <Section id='diagnosis' title='Diagnosis and marking' description='Used to evaluate the student. Never shown to students before feedback.'>
                        {text('aiScenario.diagnosis.primary', 'Primary diagnosis *', { required: true })}
                        {list('aiScenario.diagnosis.differentials', 'Differential diagnoses')}
                        <div className='grid gap-4 md:grid-cols-2'>
                            {list('aiScenario.evaluation.expectedQuestions', 'Questions the student should ask')}
                            {list('aiScenario.evaluation.criticalFindings', 'Critical findings')}
                        </div>
                    </Section>

                    <div className='hero sticky bottom-24 z-10 flex flex-wrap items-center justify-between gap-3 !rounded-full py-2.5 pl-[22px] pr-2.5 text-[13.5px] lg:bottom-4'>
                        <span className={message ? (message.ok ? 'text-on-hero' : 'rounded-full bg-bad-soft px-3 py-1 text-bad') : 'text-on-hero-2'}>
                            {message?.text ?? (isEdit ? 'Editing this case' : 'New case, not saved yet')}
                        </span>
                        <span className='flex items-center gap-2'>
                            <Link href='/admin-dashboard/cases' className={btn('glass', 'sm')}>{isEdit ? 'Back to cases' : 'Cancel'}</Link>
                            <button type='submit' disabled={isSaving} className={btn('white', 'sm')}>
                                {isSaving ? 'Saving...' : isEdit ? 'Save changes' : 'Create case'}
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}
