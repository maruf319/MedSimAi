'use client'
import { useState } from 'react';
import { ArrowRight, GraduationCap, NotebookPen, ScrollText, Sparkles } from 'lucide-react';
import CategoryCard from './CategoryCard';
import PlanReview from './PlanReview';
import ConfidenceCheck from './ConfidenceCheck';
import SelfReflection from './SelfReflection';
import PageHeader, { PageContainer } from '@/app/components/PageHeader';
import { Empty, LinkButton, Meter } from '@/app/components/ui';
import { scoreBand } from './ui';

const selfReflectionQuestions = [
    "What do you think you did well during this consultation?",
    "What would you do differently if you repeated this consultation?",
    "Which part of the consultation did you find most challenging?",
    "What is the main thing you learned from this case?",
];

const TABS = [
    { name: 'AI Feedback', short: 'AI feedback', icon: Sparkles },
    { name: 'Session Recording', short: 'Recording', icon: ScrollText },
    { name: 'Self Reflection', short: 'Reflection', icon: NotebookPen },
    { name: 'Tutor feedback', short: 'Tutor', icon: GraduationCap },
];

const CATEGORIES = [
    { id: 'consultation', key: 'consultation', title: 'Consultation', subtitle: 'History taking, structure and coverage' },
    { id: 'clinical-reasoning', key: 'medicalKnowledge', title: 'Clinical Reasoning', subtitle: 'Differentials, red flags and next steps' },
    { id: 'communication', key: 'communication', title: 'Communication', subtitle: 'Rapport, empathy and clear language' },
];

function Message({ role, name, children }) {
    const you = role === 'student'
    return (
        <div className={`flex ${you ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[20px] px-4 py-3 text-[14.5px] leading-6 sm:max-w-[75%] ${you ? 'rounded-br-md bg-grad text-on-hero' : 'rounded-bl-md bg-surface-2'}`}>
                <div className='pb-0.5 text-[11.5px] font-semibold opacity-70'>{you ? 'You' : name}</div>
                {children}
            </div>
        </div>
    )
}

export default function Feedback({ feedback, messages = [], notes = "", caseTitle, caseSlug, patientName = null, plan = "", planReview = null, confidenceRows = [] }) {
    const patientLabel = patientName?.trim().split(/\s+/)[0] || 'Patient';
    const [activeTab, setActiveTab] = useState('AI Feedback');
    const [openSections, setOpenSections] = useState({});
    const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    const { overallScore, summary } = feedback;

    return (
        <PageContainer>
            <PageHeader
                back={caseSlug ? { href: `/cases/${caseSlug}`, label: 'Back to case' } : null}
                title='Session feedback'
                description={caseTitle}
                actions={<>
                    <LinkButton href='/attempts' variant='ghost'>All attempts</LinkButton>
                    {caseSlug && <LinkButton href={`/cases/${caseSlug}`}>Try again <ArrowRight aria-hidden /></LinkButton>}
                </>}
            />

            <div role='tablist' className='inline-flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-full bg-surface-2 p-1 shadow-[inset_0_0_0_1px_var(--line)]'>
                {TABS.map(({ name, short, icon: Icon }) =>
                    <button
                        key={name}
                        role='tab'
                        aria-selected={activeTab === name}
                        className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-[13.5px] font-medium ${activeTab === name ? 'bg-surface text-ink shadow-[0_0_0_1px_var(--line)]' : 'text-ink-2'}`}
                        onClick={() => setActiveTab(name)}
                    >
                        <Icon className='h-4 w-4 shrink-0' aria-hidden />
                        <span className='sm:hidden'>{short}</span>
                        <span className='hidden sm:inline'>{name}</span>
                    </button>
                )}
            </div>

            {activeTab === 'AI Feedback' && <>
                <section aria-label='Overall score' className='hero grid items-center gap-4 p-6 sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10'>
                    <div className='flex items-end gap-1.5'>
                        <span className='num text-[96px] sm:text-[130px]'>{overallScore}</span>
                        <span className='pb-3.5 font-display text-2xl font-semibold text-on-hero-2'>/100</span>
                    </div>
                    <div className='flex min-w-0 flex-col gap-3.5'>
                        <h2 className='text-[30px] font-bold tracking-[-0.03em] text-on-hero'>{scoreBand(overallScore).label}</h2>
                        {summary && <p className='max-w-[58ch] text-base text-on-hero-2'>{summary}</p>}
                        <Meter value={overallScore} n={40} onHero />
                    </div>
                </section>

                <div className='flex flex-col gap-2.5'>
                    {CATEGORIES.map(({ id, key, title, subtitle }) =>
                        <CategoryCard key={id} id={id} title={title} subtitle={subtitle} category={feedback[key]}
                            open={!!openSections[id]} onToggle={() => toggleSection(id)} />)}
                </div>
                {plan && <PlanReview plan={plan} review={planReview} />}
                {confidenceRows.length > 0 && <ConfidenceCheck rows={confidenceRows} />}
            </>}

            {activeTab === 'Session Recording' &&
                <div className='grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
                    <section className='card p-5 sm:p-[26px]'>
                        <h2 className='mb-[18px] text-[22px] font-bold'>Transcript</h2>
                        {messages.length === 0
                            ? <p className='text-ink-2'>No messages were exchanged in this session.</p>
                            : <div className='flex flex-col gap-3.5'>
                                {messages.map((msg, idx) => <Message key={idx} role={msg.role} name={patientLabel}>{msg.content}</Message>)}
                            </div>}
                    </section>
                    <section className='card tint p-5 sm:p-[26px]'>
                        <h3 className='mb-3 text-[17px] font-bold'>Your notes</h3>
                        {notes
                            ? <pre className='m-0 whitespace-pre-wrap font-mono text-[13px] leading-[1.8] text-ink-2'>{notes}</pre>
                            : <p className='text-[13.5px] text-ink-3'>No notes were written in this session.</p>}
                    </section>
                </div>}

            {activeTab === 'Self Reflection' &&
                <section className='card p-5 sm:p-[26px]'>
                    <h2 className='mb-[18px] text-[22px] font-bold'>Self reflection</h2>
                    {selfReflectionQuestions.map((question, idx) => <SelfReflection key={idx} question={question} />)}
                </section>}

            {activeTab === 'Tutor feedback' &&
                <div className='card'>
                    <Empty icon={GraduationCap} title='Not reviewed yet'>
                        <p>Your tutor hasn&apos;t reviewed this session yet.</p>
                    </Empty>
                </div>}
        </PageContainer>
    )
}
