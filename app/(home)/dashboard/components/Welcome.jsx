import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/app/components/ui'

const FADE = 'linear-gradient(to bottom, #000 55%, transparent 92%)'

export default function Welcome({ name, stats, nextCase }) {
  const firstName = name?.split(' ')[0]

  return (
    <section className='hero grid gap-x-6 px-5 pb-[18px] pt-[26px] sm:px-8 sm:pt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:px-[52px] lg:pb-7 lg:pt-[52px]'>
      <div className='relative z-[2] flex flex-col gap-[18px] self-center pb-2 lg:pb-9'>
        <span className='text-[13px] font-medium text-on-hero-2'>Welcome back{firstName ? `, ${firstName}` : ''}</span>
        <h1 className='display text-[38px] text-on-hero sm:text-[46px] xl:text-[58px]'>Sharpen your clinical skills, one patient at a time</h1>
        <p className='max-w-[42ch] text-base leading-relaxed text-on-hero-2 sm:text-[17px]'>
          Practise real consultations with AI patients and get feedback on every decision you make.
        </p>
        <div className='flex flex-wrap gap-3'>
          <LinkButton href='/cases' variant='white'>Browse cases <ArrowRight aria-hidden /></LinkButton>
          {nextCase && <LinkButton href={`/cases/${nextCase.slug}`} variant='glass'>Start next case</LinkButton>}
        </div>
      </div>

      <div className='relative z-[1] mt-2 min-h-[330px] lg:mt-0 lg:min-h-[400px]'>
        <Image
          src='/auth/doctor.webp'
          alt=''
          width={522}
          height={900}
          priority
          className='pointer-events-none absolute bottom-[-30px] left-1/2 h-[calc(100%+30px)] w-auto max-w-none -translate-x-[46%] select-none lg:bottom-[-150px] lg:h-[calc(100%+170px)]'
          style={{ WebkitMaskImage: FADE, maskImage: FADE }}
        />
      </div>

      <div className='glass relative z-[3] grid grid-cols-3 rounded-[26px] px-2 py-[22px] lg:col-span-2'>
        {stats.map((stat, i) =>
          <div key={stat.label} className={`flex flex-col items-center gap-2 text-center ${i > 0 ? 'border-l border-on-hero-line' : ''}`}>
            <span className='num text-[30px] sm:text-[48px]'>{stat.value}</span>
            <span className='text-xs text-on-hero-2 sm:text-[13px]'>{stat.label}</span>
          </div>)}
      </div>
    </section>
  )
}
