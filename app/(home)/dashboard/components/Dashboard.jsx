import React from 'react'
import Welcome from './Welcome'
import Section from './Section'
import CaseCard from './CaseCard'
import ContinueSessions from './ContinueSessions'
import RecentResults from './RecentResults';
import { PageContainer } from '@/app/components/PageHeader';
import { LinkButton } from '@/app/components/ui';

export default function Dashboard({ name, data }) {
    const stats = [
        { value: data.casesAttempted, label: 'Cases attempted' },
        { value: data.averageScore === null ? '–' : `${data.averageScore}%`, label: 'Average score' },
        { value: data.totalSessions, label: 'Total sessions' },
    ]

    return (
        <PageContainer>
            <Welcome name={name} stats={stats} nextCase={data.recommendedCases[0] ?? null} />

            <Section card={false} title='Recommended for you' action={<LinkButton href='/cases' variant='ghost' size='sm'>All cases</LinkButton>}>
                {data.recommendedCases.length === 0
                    ? <div className='card p-6 text-ink-2'>You&apos;ve tried every case. Nice work!</div>
                    : <div className='grid gap-4 md:grid-cols-3'>
                        {data.recommendedCases.map((cs) =>
                            <CaseCard key={cs._id} href={`/cases/${cs.slug}`} title={cs.title} type={cs.specialty} level={cs.difficulty} />)}
                    </div>}
            </Section>

            {data.inProgress.length > 0
                ? <div className='grid items-start gap-4 xl:grid-cols-2'>
                    <ContinueSessions sessions={data.inProgress} total={data.inProgressTotal} />
                    <RecentResults results={data.recentResults} />
                </div>
                : <RecentResults results={data.recentResults} />}
        </PageContainer>
    )
}
