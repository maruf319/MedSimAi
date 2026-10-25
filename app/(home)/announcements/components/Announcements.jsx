import React from 'react'
import { Bell } from 'lucide-react'
import PageHeader, { PageContainer } from '@/app/components/PageHeader'
import { Chip, Empty } from '@/app/components/ui'

const longDate = (value) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export function AnnouncementRow({ announcement, children }) {
    const date = new Date(announcement.publishedAt)
    return (
        <article className='card grid gap-2.5 p-5 sm:grid-cols-[76px_minmax(0,1fr)_auto] sm:items-start sm:gap-5 sm:p-[26px]'>
            <div className='flex items-baseline gap-2 sm:flex-col sm:gap-1'>
                <span className='num text-[26px] tracking-[-0.03em]'>{date.getDate()}</span>
                <small className='text-[12.5px] font-medium text-ink-3'>{date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</small>
            </div>
            <div className='flex min-w-0 flex-col gap-2'>
                <div className='flex flex-wrap gap-2'>
                    {announcement.type && <Chip>{announcement.type}</Chip>}
                    {announcement.isPublished === false && <Chip dot>Hidden</Chip>}
                </div>
                <h3 className='text-[19px] font-bold'>{announcement.title}</h3>
                <p className='text-ink-2'>{announcement.description}</p>
            </div>
            {children}
        </article>
    )
}

export default function Announcements({ announcements }) {
    const [latest, ...rest] = announcements

    return (
        <PageContainer>
            <PageHeader title='Announcements' description='News and updates from MedSimAI.' />

            {!latest &&
                <div className='card'><Empty icon={Bell} title='No announcements right now' /></div>}

            {latest &&
                <article className='hero flex flex-col gap-3.5 p-6 sm:p-10'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Chip tone='glass'>Latest</Chip>
                        {latest.type && <Chip tone='glass'>{latest.type}</Chip>}
                        <span className='text-[12.5px] text-on-hero-2'>{longDate(latest.publishedAt)}</span>
                    </div>
                    <h2 className='text-[28px] font-bold tracking-[-0.035em] text-on-hero sm:text-[38px]'>{latest.title}</h2>
                    <p className='max-w-[60ch] text-base text-on-hero-2'>{latest.description}</p>
                </article>}

            {rest.length > 0 &&
                <div className='flex flex-col gap-2.5'>
                    {rest.map((a) => <AnnouncementRow key={a._id} announcement={a} />)}
                </div>}
        </PageContainer>
    )
}
