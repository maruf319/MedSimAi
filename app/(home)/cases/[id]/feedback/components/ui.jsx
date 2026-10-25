// Score bands used across feedback, dashboard and attempts
export function scoreBand(score) {
    if (score >= 90) return { label: 'Excellent', tone: 'good' }
    if (score >= 80) return { label: 'Very good', tone: 'good' }
    if (score >= 70) return { label: 'Good', tone: 'accent' }
    if (score >= 60) return { label: 'Needs improvement', tone: 'warn' }
    return { label: 'Poor', tone: 'bad' }
}

export function IconTile({ icon: Icon }) {
    return (
        <div className='grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-accent-soft text-accent-ink'>
            <Icon className='h-5 w-5' strokeWidth={1.9} aria-hidden />
        </div>
    )
}
