import React from 'react'
import FAQ from './FAQ'
import PageHeader, { PageContainer } from '@/app/components/PageHeader'
import { LinkButton } from '@/app/components/ui'

export default function Help({ questions }) {
    return (
        <PageContainer>
            <PageHeader title='Help & FAQ' description='Answers to common questions about MedSimAI.' />
            <div className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]'>
                <FAQ questions={questions} />
                <aside className='card tint flex flex-col gap-3 p-5 sm:p-[26px]'>
                    <h3 className='text-[17px] font-bold'>Still stuck?</h3>
                    <p className='text-[13.5px] text-ink-2'>Ask your tutor or course administrator. They can see your attempts and help with access.</p>
                    <LinkButton href='/cases' size='sm' className='w-fit'>Back to cases</LinkButton>
                </aside>
            </div>
        </PageContainer>
    )
}
