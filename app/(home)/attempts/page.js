import React from 'react'
import { redirect } from 'next/navigation'
import AttemptList from '../components/AttemptList'
import CaseFilter from './components/CaseFilter'
import PageHeader, { PageContainer } from '@/app/components/PageHeader'
import { getCurrentUser } from '@/lib/currentUser'
import { getStudentAttempts } from '@/lib/stats'

export const metadata = {
  title: 'My attempts · MedSimAI',
}

export default async function page({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const { case: caseSlug } = await searchParams;
  const allAttempts = await getStudentAttempts(user._id);

  const attemptedCases = [...new Map(allAttempts.map((a) => [a.slug, { slug: a.slug, title: a.title }])).values()]
    .sort((a, b) => a.title.localeCompare(b.title));
  const selected = attemptedCases.some((c) => c.slug === caseSlug) ? caseSlug : null;
  const attempts = selected ? allAttempts.filter((a) => a.slug === selected) : allAttempts;

  const completed = attempts.filter((a) => a.status === 'completed').length;
  const scored = attempts.filter((a) => a.score !== null);
  const best = scored.reduce((top, a) => (top === null || a.score > top.score ? a : top), null);
  const average = scored.length ? Math.round(scored.reduce((sum, a) => sum + a.score, 0) / scored.length) : null;

  return (
    <PageContainer>
      <PageHeader
        title='My attempts'
        description={`${attempts.length} ${attempts.length === 1 ? 'attempt' : 'attempts'} · ${completed} completed`}
        actions={attemptedCases.length > 0 && <CaseFilter cases={attemptedCases} selected={selected} />}
      />

      {best &&
        <div className='grid gap-4 md:grid-cols-12'>
          <section className='hero flex flex-col gap-3 p-6 sm:p-8 md:col-span-6'>
            <span className='text-[13px] font-medium text-on-hero-2'>Best score</span>
            <span className='num text-[64px] sm:text-[88px]'>{best.score}<small className='ml-1 text-[0.36em] font-semibold opacity-60'>%</small></span>
            <span className='text-on-hero-2'>{best.title} · Attempt {best.attemptNumber}</span>
          </section>
          <section className='card flex flex-col justify-between gap-[18px] p-6 md:col-span-3'>
            <span className='text-[13px] font-medium text-ink-2'>Average</span>
            <span className='num text-[48px]'>{average}<small className='ml-1 text-[0.36em] font-semibold opacity-60'>%</small></span>
          </section>
          <section className='card flex flex-col justify-between gap-[18px] p-6 md:col-span-3'>
            <span className='text-[13px] font-medium text-ink-2'>Attempts</span>
            <span className='num text-[48px]'>{attempts.length}</span>
          </section>
        </div>}

      <AttemptList
        attempts={attempts}
        emptyText="You haven't attempted any cases yet. Pick one from the case library to get started."
      />
    </PageContainer>
  )
}
