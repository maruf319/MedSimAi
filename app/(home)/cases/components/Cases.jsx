'use client'
import React, { useMemo, useState } from 'react'
import { ChevronDown, SearchIcon } from 'lucide-react'
import CaseCard from './CaseCard'
import PageHeader, { PageContainer } from '@/app/components/PageHeader'
import { Button, Empty } from '@/app/components/ui'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function optionsFrom(values) {
    return ['All', ...[...new Set(values.filter(Boolean))].sort()];
}

function SelectChip({ label, value, onChange, options }) {
    const on = value !== 'All'
    return (
        <label className='relative'>
            <span className='sr-only'>{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`h-10 max-w-full cursor-pointer appearance-none rounded-full pl-4 pr-9 text-[13.5px] font-medium outline-none ${on ? 'bg-accent-soft text-accent-ink' : 'bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line)]'}`}
            >
                {options.map((o) => <option key={o} value={o}>{o === 'All' ? `${label}: All` : o}</option>)}
            </select>
            <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3' aria-hidden />
        </label>
    )
}

export default function Cases({ data, stats = {} }) {
    const cards = data.data;
    const [keyword, setKeyword] = useState('');
    const [difficulty, setDifficulty] = useState('All');
    const [specialty, setSpecialty] = useState('All');
    const [casetype, setCasetype] = useState('All');

    const specialties = useMemo(() => optionsFrom(cards.map((c) => c.specialty)), [cards]);
    const caseTypes = useMemo(() => optionsFrom(cards.flatMap((c) => c.features ?? [])), [cards]);

    const filtered = cards.filter((card) =>
        (keyword === '' || card.title.toLowerCase().includes(keyword.trim().toLowerCase())) &&
        (difficulty === 'All' || card.difficulty === difficulty) &&
        (specialty === 'All' || card.specialty === specialty) &&
        (casetype === 'All' || (card.features ?? []).includes(casetype))
    );

    const hasFilters = keyword || difficulty !== 'All' || specialty !== 'All' || casetype !== 'All';
    function clearFilters() {
        setKeyword(''); setDifficulty('All'); setSpecialty('All'); setCasetype('All');
    }

    return (
        <PageContainer>
            <PageHeader
                title='Clinical cases'
                description={hasFilters ? `${filtered.length} of ${cards.length} cases` : `${cards.length} ${cards.length === 1 ? 'case' : 'cases'} available`}
            />

            <div className='flex flex-col gap-3'>
                <div className='flex flex-wrap items-center gap-3'>
                    <label className='relative min-w-[220px] flex-1'>
                        <SearchIcon className='pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3' aria-hidden />
                        <span className='sr-only'>Search cases</span>
                        <input
                            type='search'
                            placeholder='Search clinical cases'
                            className='h-12 w-full rounded-full border border-line bg-surface pl-[42px] pr-4 text-[14.5px] outline-none'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </label>
                    <div className='inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-surface-2 p-1 shadow-[inset_0_0_0_1px_var(--line)]' role='group' aria-label='Difficulty'>
                        {LEVELS.map((level) =>
                            <button
                                key={level}
                                type='button'
                                aria-pressed={difficulty === level}
                                onClick={() => setDifficulty(level)}
                                className={`h-9 shrink-0 cursor-pointer rounded-full px-4 text-[13.5px] font-medium ${difficulty === level ? 'bg-grad text-on-hero' : 'text-ink-2'}`}
                            >
                                {level}
                            </button>)}
                    </div>
                </div>
                <div className='flex flex-wrap items-center gap-2.5'>
                    <SelectChip label='Specialty' value={specialty} onChange={setSpecialty} options={specialties} />
                    <SelectChip label='Case type' value={casetype} onChange={setCasetype} options={caseTypes} />
                    {hasFilters &&
                        <button type='button' onClick={clearFilters} className='cursor-pointer px-2 text-[13px] font-semibold text-ink underline underline-offset-[3px]'>Clear all</button>}
                </div>
            </div>

            {filtered.length === 0
                ? <div className='card'>
                    <Empty icon={SearchIcon} title='No cases match these filters'>
                        <Button size='sm' onClick={clearFilters}>Clear filters</Button>
                    </Empty>
                </div>
                : <div className='grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(310px,1fr))]'>
                    {filtered.map((item, index) => (
                        <CaseCard
                            key={item._id}
                            title={item.title}
                            slug={item.slug}
                            image={item.image}
                            specialty={item.specialty}
                            difficulty={item.difficulty}
                            duration={item.duration}
                            patient={item.aiScenario?.patient}
                            completedBy={stats[item._id]?.completedBy ?? 0}
                            bestScore={stats[item._id]?.bestScore ?? null}
                            description={item.description}
                            tags={item.features ?? []}
                            priority={index === 0}
                        />
                    ))}
                </div>}
        </PageContainer>
    )
}
