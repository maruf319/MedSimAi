import React from 'react'
import SessionWorkspace from './components/SessionWorkspace'
import { notFound, redirect } from 'next/navigation'
import { isValidObjectId } from 'mongoose'
import { dbconnect } from '@/lib/mongo'
import { getCurrentUser } from '@/lib/currentUser'
import Case from '@/models/Case'
import CaseAttempt from '@/models/CaseAttempt'
import CasePrep from '@/models/CasePrep'

export default async function Page({ params, searchParams }) {
    const { id: slug } = await params;
    const { attempt: attemptId } = await searchParams;

    const user = await getCurrentUser();
    if (!user) redirect('/signin');

    await dbconnect()

    // Only the details already printed on the case brief (name, age, sex, occupation)
    const clinicalCase = await Case.findOne({ slug })
        .select('_id title pdfUrl aiScenario.patient.name aiScenario.patient.age aiScenario.patient.gender aiScenario.patient.occupation')
        .lean();
    if (!clinicalCase) notFound();

    let caseAttempt = null;
    if (isValidObjectId(attemptId)) {
        caseAttempt = await CaseAttempt.findOne({ _id: attemptId, user: user._id, case: clinicalCase._id });
    } else {
        caseAttempt = await CaseAttempt.findOne({ user: user._id, case: clinicalCase._id, status: 'started' })
            .sort({ createdAt: -1 });
    }

    if (!caseAttempt) notFound();

    if (caseAttempt.status === 'completed') {
        redirect(`/cases/${slug}/feedback/${caseAttempt._id}`);
    }
    if (caseAttempt.status !== 'started') notFound();

    const plan = caseAttempt.prep?.plan != null
        ? caseAttempt.prep.plan
        : (await CasePrep.findOne({ user: user._id, case: clinicalCase._id }).select('plan').lean())?.plan ?? '';

    return (
        <SessionWorkspace
            slug={slug}
            title={clinicalCase.title}
            caseDocument={clinicalCase.pdfUrl || null}
            patient={{
                name: clinicalCase.aiScenario?.patient?.name ?? null,
                age: clinicalCase.aiScenario?.patient?.age ?? null,
                gender: clinicalCase.aiScenario?.patient?.gender ?? null,
                occupation: clinicalCase.aiScenario?.patient?.occupation ?? null,
            }}
            attemptId={caseAttempt._id.toString()}
            initialMessages={caseAttempt.messages.map(({ role, content }) => ({ role, content }))}
            initialNotes={caseAttempt.notes ?? ''}
            plan={plan}
            startedAt={(caseAttempt.startedAt ?? caseAttempt.createdAt)?.toISOString()}
        />
    )
}
