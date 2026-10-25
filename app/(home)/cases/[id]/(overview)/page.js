
import React from 'react'
import CaseDocument from '../components/CaseDocument'
import ConfidenceRatings from '../components/ConfidenceRatings'
import ConsultationPlan from '../components/ConsultationPlan'
import { Clock, Lock, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { startSession } from '@/app/actions/session';
import { getPublicCaseBySlug } from '@/lib/cases';
import { getCurrentUser, isAdmin } from '@/lib/currentUser';
import CasePrep from '@/models/CasePrep';
import { getStudentAttempts } from '@/lib/stats';
import AttemptList from '../../../components/AttemptList';
import { BackLink, PageContainer } from '@/app/components/PageHeader';
import { btn, Chip, LinkButton } from '@/app/components/ui';
import { notFound, redirect } from 'next/navigation';

export default async function Page({ params }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const patient = await getPublicCaseBySlug(id, { includeDrafts: isAdmin(user) });
  if (!patient) notFound();
  const caseId = patient._id;

  const [prep, attempts] = await Promise.all([
    CasePrep.findOne({ user: user._id, case: caseId }).lean(),
    getStudentAttempts(user._id, { caseId }),
  ]);
  const inProgress = attempts.find((a) => a.status === 'started') ?? null;
  const initialRatings = prep?.confidence ? Object.fromEntries(Object.entries(prep.confidence)) : {};

  const age = patient.aiScenario?.patient?.age;

  return (
    <PageContainer>
      <BackLink href='/cases'>All cases</BackLink>

      {!patient.isPublished &&
        <p className='rounded-[14px] bg-warn-soft px-4 py-3 text-[13.5px] text-warn'>
          Draft: only admins can see this case. Publish it from the admin dashboard to make it available to students.
        </p>}

      <section className='hero flex flex-col gap-5 p-6 sm:p-9'>
        <div className='flex flex-wrap items-center gap-2'>
          {patient.image &&
            <span className='relative mr-1 h-10 w-10 overflow-hidden rounded-[12px] bg-hero-glass'>
              <Image fill alt='' src={patient.image} sizes='40px' className='object-cover object-[center_25%]' />
            </span>}
          {patient.specialty && <Chip tone='glass'>{patient.specialty}</Chip>}
          {patient.difficulty && <Chip tone='glass'>{patient.difficulty}</Chip>}
          {patient.duration && <Chip tone='glass'><Clock aria-hidden />{patient.duration}</Chip>}
          {age != null && <Chip tone='glass'>{age >= 18 ? 'Adult' : 'Pediatric'}</Chip>}
        </div>
        <h1 className='display text-[36px] text-on-hero sm:text-[48px] xl:text-[60px]'>{patient.title}</h1>
        <p className='max-w-[56ch] text-base leading-relaxed text-on-hero-2 sm:text-[17px]'>{patient.description}</p>

        <div className='mt-1 flex flex-wrap items-center gap-4'>
          {user.isDemo
            ? <>
              <span aria-disabled='true' className={btn('glass', 'md')}><Lock aria-hidden /> Start session</span>
              <p className='text-[13.5px] text-on-hero-2'>
                Live AI sessions are turned off in the demo.{' '}
                <Link href='/attempts' className='font-semibold text-on-hero underline underline-offset-[3px]'>See sample feedback</Link>
              </p>
            </>
            : inProgress
              ? <>
                <LinkButton href={`/cases/${patient.slug}/active-session?attempt=${inProgress.attemptId}`} variant='white'>
                  <Play aria-hidden /> Resume session
                </LinkButton>
                <form action={startSession}>
                  <input type="hidden" name="caseId" value={caseId} />
                  <button type="submit" className={btn('glass', 'md')}>Start new attempt</button>
                </form>
              </>
              : <form action={startSession}>
                <input type="hidden" name="caseId" value={caseId} />
                <button type="submit" className={btn('white', 'md')}><Play aria-hidden /> Start session</button>
              </form>}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="h-[70vh] min-h-96 lg:col-span-3">
          {patient.pdfUrl
            ? <CaseDocument file={patient.pdfUrl} />
            : <div className='card flex h-full items-center justify-center p-6 text-ink-2'>No case document for this case.</div>}
        </div>

        <section className="card tint flex flex-col gap-[18px] p-5 sm:p-[26px] lg:col-span-2">
          <h2 className='text-[22px] font-bold'>Before you start</h2>
          <ConfidenceRatings caseId={caseId} initialRatings={initialRatings} />
          <ConsultationPlan caseId={caseId} initialPlan={prep?.plan ?? ''} />
        </section>
      </div>

      <section className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h2 className='text-[22px] font-bold'>Your attempts</h2>
          {attempts.length > 5 &&
            <LinkButton href={`/attempts?case=${patient.slug}`} variant='ghost' size='sm'>View all {attempts.length}</LinkButton>}
        </div>
        <AttemptList
          attempts={attempts.slice(0, 5)}
          showCase={false}
          emptyText="You haven't tried this case yet. Start a session when you're ready."
        />
      </section>
    </PageContainer>
  )
}
