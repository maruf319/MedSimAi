'use client'
import { signup } from '@/app/actions/auth';
import AuthField from '@/app/components/AuthField';
import AuthLayout, { FormError } from '@/app/components/AuthLayout';
import { btn } from '@/app/components/ui';
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import Link from 'next/link';
import { useActionState } from 'react';

export default function Signup() {
    const [state, formAction, pending] = useActionState(signup, null);
    return (
        <AuthLayout title='Create your account' description='Sign up to start practising clinical cases.'>
            <form action={formAction} className='flex flex-col gap-4'>
                <AuthField label='Full name' icon={User} name='name' autoComplete='name' placeholder='Your name' />
                <AuthField label='Email address' icon={Mail} name='email' type='email' autoComplete='email' placeholder='you@university.ac.uk' />
                <AuthField label='Password' icon={Lock} name='password' type='password' minLength={8} autoComplete='new-password' placeholder='At least 8 characters' />
                <AuthField label='Confirm password' icon={Lock} name='confirmPassword' type='password' minLength={8} autoComplete='new-password' placeholder='Type it again' />
                <FormError>{state?.error}</FormError>
                <button type='submit' disabled={pending} className={btn('primary', 'md', 'w-full')}>
                    {pending ? 'Creating account...' : <>Create account <ArrowRight aria-hidden /></>}
                </button>
            </form>

            <p className='text-[13.5px] text-ink-2'>
                Already have an account? <Link href='/signin' className='font-semibold text-accent-ink underline underline-offset-[3px]'>Sign in</Link>
            </p>
        </AuthLayout>
    )
}
