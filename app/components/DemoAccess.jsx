'use client'

import { useActionState, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { demoSignin } from '@/app/actions/auth'
import { Divider, FormError } from './AuthLayout'

const OPTIONS = [
    { role: 'student', label: 'Student demo', hint: 'Browse cases and sample AI feedback' },
    { role: 'admin', label: 'Admin demo', hint: 'Browse the case manager, read-only' },
]

export default function DemoAccess({ roles = ['student', 'admin'] }) {
    const [state, formAction, pending] = useActionState(demoSignin, null)
    const [chosen, setChosen] = useState(null)
    const options = OPTIONS.filter((o) => roles.includes(o.role))

    return (
        <div className='flex w-full flex-col gap-3'>
            <Divider>or explore the demo</Divider>
            <form action={formAction} className={`grid gap-3 ${options.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {options.map(({ role, label, hint }) =>
                    <button
                        key={role}
                        type='submit'
                        name='role'
                        value={role}
                        disabled={pending}
                        onClick={() => setChosen(role)}
                        className='card tint flex cursor-pointer flex-col gap-1.5 rounded-[18px] p-[18px] text-left transition hover:shadow-[0_0_0_1px_var(--accent)] disabled:cursor-wait disabled:opacity-60'
                    >
                        <b className='flex items-center justify-between gap-2 font-display text-base font-bold'>
                            {pending && chosen === role ? 'Signing in...' : label}
                            <ArrowRight className='h-4 w-4' aria-hidden />
                        </b>
                        <span className='text-[13px] leading-snug text-ink-2'>{hint}</span>
                    </button>)}
            </form>
            <FormError>{state?.error}</FormError>
        </div>
    )
}
