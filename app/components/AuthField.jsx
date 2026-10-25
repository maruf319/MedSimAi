'use client'
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthField({ label, icon: Icon, type = 'text', ...inputProps }) {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'

    return (
        <label className='flex flex-col gap-[7px]'>
            <span className='text-[13px] font-semibold'>{label}</span>
            <span className='relative flex items-center'>
                {Icon && <Icon className='pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-ink-3' aria-hidden />}
                <input
                    type={isPassword && show ? 'text' : type}
                    className={`h-12 w-full rounded-[14px] border border-line bg-surface-2 text-[14.5px] outline-none transition focus:bg-surface ${Icon ? 'pl-[42px]' : 'pl-3.5'} ${isPassword ? 'pr-12' : 'pr-3.5'}`}
                    required
                    {...inputProps}
                />
                {isPassword &&
                    <button
                        type='button'
                        onClick={() => setShow((v) => !v)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        className='absolute right-1.5 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-ink-3 hover:text-ink'
                    >
                        {show ? <EyeOff className='h-[18px] w-[18px]' /> : <Eye className='h-[18px] w-[18px]' />}
                    </button>}
            </span>
        </label>
    )
}
