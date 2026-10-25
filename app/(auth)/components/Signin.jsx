'use client'
import { signin } from '@/app/actions/auth';
import AuthField from '@/app/components/AuthField';
import AuthLayout, { FormError } from '@/app/components/AuthLayout';
import DemoAccess from '@/app/components/DemoAccess';
import { btn } from '@/app/components/ui';
import { ArrowRight, Lock, Mail } from 'lucide-react'
import Link from 'next/link';
import { useActionState } from 'react';

export default function Signin({ demo }) {
    const [state, formAction, pending] = useActionState(signin, null);
    return (
        <AuthLayout title='Sign in to MedSimAI' description='Welcome back. Enter your details to continue.'>
            <form action={formAction} className='flex flex-col gap-4'>
                <AuthField label='Email address' icon={Mail} name='email' type='email' autoComplete='email' placeholder='you@university.ac.uk' />
                <AuthField label='Password' icon={Lock} name='password' type='password' autoComplete='current-password' placeholder='Your password' />
                <FormError>{state?.error}</FormError>
                <button type='submit' disabled={pending} className={btn('primary', 'md', 'w-full')}>
                    {pending ? 'Signing in...' : <>Sign in <ArrowRight aria-hidden /></>}
                </button>
            </form>

            <p className='text-[13.5px] text-ink-2'>
                Don&apos;t have an account? <Link href='/signup' className='font-semibold text-accent-ink underline underline-offset-[3px]'>Sign up</Link>
            </p>

            {demo && <DemoAccess />}

            <p className='text-[13.5px] text-ink-2'>
                Teaching staff? <Link href='/admin-dashboard/login' className='font-semibold text-accent-ink underline underline-offset-[3px]'>Admin sign in</Link>
            </p>
        </AuthLayout>
    )
}
