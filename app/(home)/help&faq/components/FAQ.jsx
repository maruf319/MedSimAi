'use client'

import React, { useState } from 'react'
import { ChevronDown, SearchIcon } from 'lucide-react'
import { Empty } from '@/app/components/ui'

export default function FAQ({ questions }) {
    const [openId, setOpenId] = useState(null)
    const [query, setQuery] = useState('')

    const q = query.trim().toLowerCase()
    const shown = q ? questions.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(q)) : questions

    return (
        <div className="flex flex-col gap-3.5">
            {questions.length > 0 &&
                <label className='relative'>
                    <SearchIcon className='pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3' aria-hidden />
                    <span className='sr-only'>Search questions</span>
                    <input
                        type='search'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search questions'
                        className='h-12 w-full rounded-full border border-line bg-surface pl-[42px] pr-4 text-[14.5px] outline-none'
                    />
                </label>}

            {questions.length === 0 && <div className='card p-6 text-ink-2'>No questions have been added yet.</div>}
            {questions.length > 0 && shown.length === 0 &&
                <div className='card'><Empty icon={SearchIcon} title={`No questions match “${query}”`} /></div>}

            <div className='flex flex-col gap-2.5'>
                {shown.map((item) => {
                    const isOpen = openId === item._id
                    return (
                        <div key={item._id} className='card overflow-hidden'>
                            <button
                                type="button"
                                onClick={() => setOpenId((current) => current === item._id ? null : item._id)}
                                aria-expanded={isOpen}
                                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-[22px] text-left sm:px-6"
                            >
                                <b className="font-display text-[16.5px] font-bold tracking-[-0.01em]">{item.question}</b>
                                <ChevronDown className={`h-5 w-5 shrink-0 text-ink-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                            </button>
                            {isOpen &&
                                <p className="max-w-[70ch] px-5 pb-6 text-ink-2 sm:px-6">{item.answer}</p>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
