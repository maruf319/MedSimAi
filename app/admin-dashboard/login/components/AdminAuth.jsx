'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import AuthField from '@/app/components/AuthField'
import AuthLayout, { FormError } from '@/app/components/AuthLayout'
import DemoAccess from '@/app/components/DemoAccess'
import { btn } from '@/app/components/ui'
import { adminLogout, adminSignin, adminSignup } from '@/app/actions/auth'

function SignInForm() {
    const [state, formAction, pending] = useActionState(adminSignin, null)
    return (
        <form action={formAction} className='flex flex-col gap-4'>
            <AuthField label='Email address' icon={Mail} name='email' type='email' autoComplete='email' placeholder='you@university.ac.uk' />
            <AuthField label='Password' icon={Lock} name='password' type='password' autoComplete='current-password' placeholder='Your password' />
            <FormError>{state?.error}</FormError>
            <button type='submit' disabled={pending} className={btn('primary', 'md', 'w-full')}>
                {pending ? 'Signing in...' : <>Sign in <ArrowRight aria-hidden /></>}
            </button>
        </form>
    )
}

function SignUpForm() {
    const [state, formAction, pending] = useActionState(adminSignup, null)
    return (
        <form action={formAction} className='flex flex-col gap-4'>
            <p className='rounded-[14px] bg-accent-soft px-3.5 py-3 text-[13.5px] text-accent-ink'>
                No admin account exists yet. The first account created here becomes the admin; after that,
                new admins are added from the Users page.
            </p>
            <AuthField label='Full name' icon={User} name='name' autoComplete='name' placeholder='Your name' />
            <AuthField label='Email address' icon={Mail} name='email' type='email' autoComplete='email' placeholder='you@university.ac.uk' />
            <AuthField label='Password' icon={Lock} name='password' type='password' minLength={8} autoComplete='new-password' placeholder='At least 8 characters' />
            <AuthField label='Confirm password' icon={Lock} name='confirmPassword' type='password' minLength={8} autoComplete='new-password' placeholder='Type it again' />
            <FormError>{state?.error}</FormError>
            <button type='submit' disabled={pending} className={btn('primary', 'md', 'w-full')}>
                {pending ? 'Creating account...' : 'Create admin account'}
            </button>
        </form>
    )
}

export default function AdminAuth({ allowSignup, signedInAs, demo }) {
    const [mode, setMode] = useState(allowSignup ? 'signup' : 'signin')

    return (
        <AuthLayout
            tag='Admin'
            title='Admin sign in'
            description='Manage cases, announcements, FAQ and users.'
            heroTitle='Manage cases, content and students in one place.'
        >
            {signedInAs &&
                <div className='flex flex-col gap-2 rounded-[14px] bg-warn-soft px-3.5 py-3 text-[13.5px] text-warn'>
                    You&apos;re signed in as {signedInAs}, which isn&apos;t an admin account.
                    Sign out to sign in with an admin account.
                    <form action={adminLogout}>
                        <button type='submit' className='cursor-pointer font-semibold underline underline-offset-[3px]'>Sign out</button>
                    </form>
                </div>}

            {allowSignup &&
                <div className='grid grid-cols-2 gap-0.5 rounded-full bg-surface-2 p-1 shadow-[inset_0_0_0_1px_var(--line)]' role='tablist'>
                    {[['signup', 'Create admin account'], ['signin', 'Sign in']].map(([value, label]) =>
                        <button
                            key={value}
                            type='button'
                            role='tab'
                            aria-selected={mode === value}
                            onClick={() => setMode(value)}
                            className={`h-9 cursor-pointer rounded-full text-[13.5px] font-medium ${mode === value ? 'bg-grad text-on-hero' : 'text-ink-2'}`}
                        >
                            {label}
                        </button>)}
                </div>}

            {mode === 'signup' && allowSignup ? <SignUpForm /> : <SignInForm />}

            {demo && <DemoAccess roles={['admin']} />}

            <p className='text-[13.5px] text-ink-2'>
                {!allowSignup && <>Need an admin account? Ask an existing admin to create one from the Users page. </>}
                Not an admin? <Link href='/signin' className='font-semibold text-accent-ink underline underline-offset-[3px]'>Student sign in</Link>
            </p>
        </AuthLayout>
    )
}
