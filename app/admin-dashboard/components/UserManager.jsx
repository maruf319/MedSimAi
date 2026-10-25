'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, KeyRound, Trash2 } from 'lucide-react'
import { createUser, deleteUser, resetPassword, setUserRole } from '@/app/actions/adminUsers'
import { btn, Chip, fieldInput, Meter } from '@/app/components/ui'

const emptyForm = { name: '', email: '', password: '', role: 'student' }

function initials(name = '') {
    return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'
}

export default function UserManager({ users, currentUserId }) {
    const router = useRouter()
    const [form, setForm] = useState(emptyForm)
    const [isBusy, setIsBusy] = useState(false)
    const [message, setMessage] = useState(null)

    async function run(action, successText, after) {
        setIsBusy(true)
        setMessage(null)
        try {
            const result = await action()
            if (!result.success) throw new Error(result.message)
            after?.()
            if (successText) setMessage({ ok: true, text: successText })
            router.refresh()
        } catch (err) {
            setMessage({ ok: false, text: err.message || 'Something went wrong. Please try again.' })
        } finally {
            setIsBusy(false)
        }
    }

    function handleResetPassword(user) {
        const password = prompt(`New password for ${user.email} (at least 8 characters):`)
        if (password === null) return
        run(() => resetPassword(user._id, password), `Password updated for ${user.email}.`)
    }

    function handleDelete(user) {
        const attempts = user.attempts
            ? ` This also deletes their ${user.attempts} case attempt${user.attempts === 1 ? '' : 's'} and results.`
            : ''
        if (!confirm(`Delete ${user.email}?${attempts} This can't be undone.`)) return
        run(() => deleteUser(user._id), `${user.email} was deleted.`)
    }

    const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

    const roleSelect = (user, isSelf) => (
        <label className='relative inline-flex'>
            <span className='sr-only'>Role for {user.email}</span>
            <select
                value={user.role}
                disabled={isSelf || isBusy}
                onChange={(e) => run(() => setUserRole(user._id, e.target.value), `${user.email} is now ${e.target.value === 'admin' ? 'an admin' : 'a student'}.`)}
                className='h-9 cursor-pointer appearance-none rounded-full border border-line bg-surface-2 pl-3.5 pr-8 text-[13px] outline-none disabled:cursor-default disabled:opacity-60'
            >
                <option value='student'>Student</option>
                <option value='admin'>Admin</option>
            </select>
            <ChevronDown className='pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3' aria-hidden />
        </label>
    )

    const userActions = (user, isSelf) => (
        <div className='flex items-center justify-end gap-1.5'>
            <button type='button' onClick={() => handleResetPassword(user)} disabled={isBusy} className={btn('ghost', 'sm')}>
                <KeyRound aria-hidden /> Reset password
            </button>
            {!isSelf &&
                <button type='button' onClick={() => handleDelete(user)} disabled={isBusy} aria-label={`Delete ${user.email}`}
                    className='grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line)] hover:text-bad disabled:opacity-50'>
                    <Trash2 className='h-4 w-4' aria-hidden />
                </button>}
        </div>
    )

    const person = (user, isSelf) => (
        <div className='flex min-w-0 items-center gap-3'>
            <span className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full font-display text-[13.5px] font-bold ${isSelf ? 'bg-grad text-on-hero' : 'bg-accent-soft text-accent-ink'}`}>{initials(user.name)}</span>
            <span className='flex min-w-0 flex-col'>
                <span className='flex items-center gap-1.5 truncate font-semibold'>{user.name}{isSelf && <Chip tone='accent' className='!h-[22px]'>You</Chip>}</span>
                <span className='truncate text-[12.5px] text-ink-3'>{user.email}</span>
            </span>
        </div>
    )

    const score = (user) => user.averageScore === null
        ? <span className='text-ink-3'>–</span>
        : <span className='flex items-center gap-3'><Meter value={user.averageScore} n={12} size='sm' className='w-[90px]' /><b className='tabular-nums'>{user.averageScore}%</b></span>

    return (
        <div className='flex flex-col gap-4'>
            <form
                onSubmit={(e) => { e.preventDefault(); run(() => createUser(form), `Account created for ${form.email.trim().toLowerCase()}.`, () => setForm(emptyForm)) }}
                className='card tint flex flex-col gap-4 p-5 sm:p-[26px]'
            >
                <h2 className='text-[22px] font-bold'>New account</h2>
                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>Full name
                        <input value={form.name} onChange={set('name')} placeholder='e.g. Dr Sarah Khan' required className={`${fieldInput} font-normal`} />
                    </label>
                    <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>Email
                        <input value={form.email} onChange={set('email')} type='email' placeholder='name@university.ac.uk' required className={`${fieldInput} font-normal`} />
                    </label>
                    <label className='flex flex-col gap-[7px] text-[13px] font-semibold'>Password
                        <input value={form.password} onChange={set('password')} type='password' placeholder='At least 8 characters' minLength={8} required autoComplete='new-password' className={`${fieldInput} font-normal`} />
                    </label>
                    <span className='flex flex-col gap-[7px] text-[13px] font-semibold'>Role
                        <span className='grid h-12 grid-cols-2 gap-0.5 rounded-full bg-surface-2 p-1 shadow-[inset_0_0_0_1px_var(--line)]' role='radiogroup' aria-label='Role'>
                            {[['student', 'Student'], ['admin', 'Admin']].map(([value, label]) =>
                                <button key={value} type='button' role='radio' aria-checked={form.role === value} onClick={() => setForm((p) => ({ ...p, role: value }))}
                                    className={`cursor-pointer rounded-full text-[13.5px] font-medium ${form.role === value ? 'bg-grad text-on-hero' : 'text-ink-2'}`}>
                                    {label}
                                </button>)}
                        </span>
                    </span>
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                    {message && <p className={`text-[13.5px] ${message.ok ? 'text-good' : 'text-bad'}`}>{message.text}</p>}
                    <button type='submit' disabled={isBusy} className={btn('primary', 'sm', 'ml-auto')}>
                        {isBusy ? 'Working...' : 'Create account'}
                    </button>
                </div>
            </form>

            <ul className='flex flex-col gap-2.5 md:hidden'>
                {users.map((user) => {
                    const isSelf = user._id === currentUserId
                    return (
                        <li key={user._id} className='card flex flex-col gap-3 p-5'>
                            {person(user, isSelf)}
                            <div className='flex items-center justify-between gap-3 text-[13px] text-ink-2'>
                                {roleSelect(user, isSelf)}
                                <span>{user.attempts} {user.attempts === 1 ? 'attempt' : 'attempts'}</span>
                                {score(user)}
                            </div>
                            {userActions(user, isSelf)}
                        </li>
                    )
                })}
            </ul>

            <div className='card hidden overflow-x-auto px-2 py-1.5 md:block'>
                <table className='w-full min-w-[760px] text-left text-sm'>
                    <thead>
                        <tr className='text-[12.5px] text-ink-3'>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Name</th>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Role</th>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Attempts</th>
                            <th className='border-b border-line px-4 py-3.5 font-medium'>Avg score</th>
                            <th className='border-b border-line px-4 py-3.5 text-right font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const isSelf = user._id === currentUserId
                            return (
                                <tr key={user._id} className='[&:last-child>td]:border-b-0'>
                                    <td className='border-b border-line px-4 py-4'>{person(user, isSelf)}</td>
                                    <td className='border-b border-line px-4 py-4'>{roleSelect(user, isSelf)}</td>
                                    <td className='border-b border-line px-4 py-4 tabular-nums'>{user.attempts}</td>
                                    <td className='border-b border-line px-4 py-4'>{score(user)}</td>
                                    <td className='border-b border-line px-4 py-4'>{userActions(user, isSelf)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
