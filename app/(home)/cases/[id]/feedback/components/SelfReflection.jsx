import React from 'react'

export default function SelfReflection({ question, answer }) {
    return (
        <div className='flex flex-col gap-1.5 border-t border-line py-4 first:border-t-0 first:pt-0 last:pb-0'>
            <b className='text-sm'>{question}</b>
            {answer
                ? <p className='text-ink-2'>{answer}</p>
                : <p className='text-[13.5px] text-ink-3'>Not answered yet.</p>}
        </div>
    )
}
