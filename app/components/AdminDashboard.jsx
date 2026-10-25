import React from 'react'
import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'
import PageHeader, { PageContainer } from './PageHeader'
import ScoreCurve from './ScoreCurve'
import { Chip, LinkButton, Meter } from './ui'

const MAX_CHART_CASES = 8

export default function Dashboard({ overview }) {
    const scored = overview.cases.filter((c) => c.averageScore !== null).slice(0, MAX_CHART_CASES)
    const unscored = overview.cases.filter((c) => c.averageScore === null).length
    const atRisk = overview.studentsAtRisk

    return (
        <PageContainer>
            <PageHeader
                title='Overview'
                description={`${overview.cases.length} ${overview.cases.length === 1 ? 'case' : 'cases'} · live progress from your students`}
                actions={<LinkButton href='/admin-dashboard/create-new-case'><Plus aria-hidden /> New case</LinkButton>}
            />

            <div className='grid gap-4 lg:grid-cols-12'>
                <section className='hero flex flex-col gap-[26px] p-6 sm:p-8 lg:col-span-8'>
                    <div className='flex flex-wrap items-start justify-between gap-4'>
                        <div className='flex flex-col gap-2.5'>
                            <span className='text-[13px] font-medium text-on-hero-2'>Average score</span>
                            <span className='num text-[64px] sm:text-[92px]'>
                                {overview.averageScore === null ? '–' : <>{overview.averageScore}<small className='ml-1 text-[0.36em] font-semibold opacity-60'>%</small></>}
                            </span>
                        </div>
                        <Chip tone='glass' dot>{atRisk === 0 ? 'No students at risk' : `${atRisk} ${atRisk === 1 ? 'student' : 'students'} at risk`}</Chip>
                    </div>
                    {scored.length > 0
                        ? <div className='flex flex-col gap-1.5'>
                            <span className='text-[13px] font-medium text-on-hero-2'>Average score by case</span>
                            <ScoreCurve id='admin-cases' labels={scored.map((c) => c.title)} values={scored.map((c) => c.averageScore)} />
                        </div>
                        : <p className='text-on-hero-2'>Scores appear here once students complete cases.</p>}
                    {unscored > 0 && scored.length > 0 &&
                        <span className='text-[12.5px] text-on-hero-3'>{unscored} {unscored === 1 ? 'case has' : 'cases have'} no scores yet</span>}
                </section>

                <div className='grid gap-4 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1'>
                    <section className='card flex flex-col justify-between gap-[18px] p-[22px]'>
                        <span className='text-[13px] font-medium text-ink-2'>Enrolled students</span>
                        <span className='num text-[48px]'>{overview.totalStudents}</span>
                    </section>
                    <section className='card flex flex-col justify-between gap-[18px] p-[22px]'>
                        <span className='text-[13px] font-medium text-ink-2'>Completed a case</span>
                        <span className='num text-[48px]'>{overview.studentsCompleted}<small className='ml-1 text-[0.36em] font-semibold opacity-60'>/{overview.totalStudents}</small></span>
                    </section>
                    <section className='card tint flex flex-col justify-between gap-[18px] p-[22px]'>
                        <span className='text-[13px] font-medium text-ink-2'>At risk · average under {overview.atRiskThreshold}%</span>
                        <span className='num text-[48px]'>{atRisk}</span>
                    </section>
                </div>
            </div>

            <section className='card p-5 sm:p-[26px]'>
                <div className='mb-[18px] flex items-center justify-between gap-4'>
                    <h2 className='text-[22px] font-bold'>Progress by case</h2>
                    <LinkButton href='/admin-dashboard/cases' variant='ghost' size='sm'>Manage cases</LinkButton>
                </div>
                {overview.cases.length === 0
                    ? <p className='text-ink-2'>No cases yet. Create one to get started.</p>
                    : <ul>
                        {overview.cases.map((c) =>
                            <li key={c._id} className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-t border-line py-4 first:border-t-0 first:pt-1 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_60px_auto]'>
                                <span className='flex min-w-0 flex-col gap-0.5'>
                                    <span className='truncate font-semibold'>{c.title}</span>
                                    <span className='truncate text-[12.5px] text-ink-3'>{[c.specialty, c.difficulty, c.duration].filter(Boolean).join(' · ')}</span>
                                </span>
                                <span className='hidden flex-col gap-2 text-[12.5px] text-ink-2 sm:flex'>
                                    <Meter value={c.attempts ? (c.completions / c.attempts) * 100 : 0} n={20} size='sm' />
                                    <span>{c.completions} of {c.attempts} {c.attempts === 1 ? 'attempt' : 'attempts'} completed</span>
                                </span>
                                <span className='hidden flex-col gap-0.5 sm:flex'>
                                    <span className='text-xs text-ink-3'>Avg</span>
                                    <b className='tabular-nums'>{c.averageScore === null ? '–' : `${c.averageScore}%`}</b>
                                </span>
                                <span className='flex items-center gap-2'>
                                    <Chip tone={c.isPublished ? 'good' : 'neutral'} dot>{c.isPublished ? 'Published' : 'Draft'}</Chip>
                                    <Link href={`/admin-dashboard/cases/${c._id}/edit`} aria-label={`Edit ${c.title}`} className='grid h-[34px] w-[34px] place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line)] hover:bg-surface-2'>
                                        <Pencil className='h-4 w-4' aria-hidden />
                                    </Link>
                                </span>
                            </li>)}
                    </ul>}
            </section>
        </PageContainer>
    )
}
