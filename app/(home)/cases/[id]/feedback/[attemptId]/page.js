import { notFound, redirect } from 'next/navigation';
import { isValidObjectId } from 'mongoose';
import CaseAttempt from '@/models/CaseAttempt';
import Case from '@/models/Case';
import Feedback from '../components/Feedback'
import GenerateFeedback from '../components/GenerateFeedback'
import PageHeader, { PageContainer } from '@/app/components/PageHeader'
import { compareConfidence } from '@/utils/confidenceCheck'
import { dbconnect } from '@/lib/mongo';
import { getCurrentUser } from '@/lib/currentUser';

function toCategory(category) {
    return {
        score: category?.score ?? 0,
        description: category?.description ?? '',
        performance: (category?.performance ?? []).map((item) => ({
            section: item.section,
            score: item.score,
            maxScore: item.maxScore,
            details: item.details,
        })),
        strengths: category?.strengths ?? [],
        improvements: category?.improvements ?? [],
        recommendations: category?.recommendations ?? [],
    };
}

export default async function page({ params }) {
    const { attemptId } = await params;

    const user = await getCurrentUser();
    if (!user) redirect('/signin');
    if (!isValidObjectId(attemptId)) notFound();

    await dbconnect()
    const caseAttempt = await CaseAttempt.findOne({ _id: attemptId, user: user._id }).lean();
    if (!caseAttempt) notFound();

    const clinicalCase = await Case.findById(caseAttempt.case).select('title slug aiScenario.patient.name').lean();

    const stored = caseAttempt.feedback;
    if (stored?.overallScore == null) {
        return (
            <PageContainer>
                <PageHeader
                    back={clinicalCase ? { href: `/cases/${clinicalCase.slug}`, label: 'Back to case' } : null}
                    title='Session feedback'
                    description={clinicalCase?.title}
                />
                {caseAttempt.status === 'completed'
                    ? <GenerateFeedback attemptId={attemptId} />
                    : <div className='card p-6 text-ink-2'>
                        Feedback is available once the session has been completed.
                    </div>}
            </PageContainer>
        )
    }

    const feedback = {
        overallScore: stored.overallScore,
        summary: stored.summary ?? '',
        consultation: toCategory(stored.consultation),
        medicalKnowledge: toCategory(stored.medicalKnowledge),
        communication: toCategory(stored.communication),
    };

    const plan = caseAttempt.prep?.plan ?? '';
    const planReview = stored.planReview?.summary || stored.planReview?.followed?.length
        ? {
            summary: stored.planReview.summary ?? '',
            followed: stored.planReview.followed ?? [],
            skipped: stored.planReview.skipped ?? [],
            missing: stored.planReview.missing ?? [],
        }
        : null;
    const confidenceRows = compareConfidence(caseAttempt.prep?.confidence, feedback);

    return (
        <Feedback
            feedback={feedback}
            messages={(caseAttempt.messages ?? []).map(({ role, content }) => ({ role, content }))}
            notes={caseAttempt.notes ?? ""}
            caseTitle={clinicalCase?.title}
            caseSlug={clinicalCase?.slug}
            patientName={clinicalCase?.aiScenario?.patient?.name ?? null}
            plan={plan}
            planReview={planReview}
            confidenceRows={confidenceRows}
        />
    )
}
