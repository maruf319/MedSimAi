import React from 'react'

/** Titled block. `card` wraps the content in a plain card (used for lists). */
export default function Section({ title, action, card = true, children }) {
    return (
        <section className={`flex min-w-0 flex-col ${card ? 'card p-5 sm:p-[26px]' : 'gap-4'}`}>
            <div className={`flex items-center justify-between gap-4 ${card ? 'mb-[18px]' : ''}`}>
                <h2 className='text-[22px] font-bold leading-tight'>{title}</h2>
                {action}
            </div>
            {children}
        </section>
    )
}
